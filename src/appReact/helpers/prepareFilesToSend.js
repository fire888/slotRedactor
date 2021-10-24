import { sendResponse, uploadFile } from "../../toServerApi/requests";
import { showDragonSpr, playAnimation } from "../../appPixi/AppPixi"
import {useCallback} from "react";


const TYPES_DRAGONS = [
    { include: '_ske.json', type: 'dragon-ske' },
    { include: '_tex.json', type: 'dragon-tex' },
    { include: '_tex.png', type: 'dragon-img' },
]

const TYPES_SPINE = [
    { include: '.json', type: 'spine-ske' },
    { include: '.atlas', type: 'spine-atlas' },
    { include: '.png', type: 'spine-img' },
]

const TYPES_IMG_STATIC = [
    { include: '.png', type: 'image-static' }
]

const TYPES_IMG_BLUR = [
    { include: '.png', type: 'image-blur' }
]





export const sendFilesToServer = (inputKey, id, oldItemData, files, callback) => {
    // const dataRemoveOldFile = {
    //     id,
    //     name: fileData.file.name,
    //     type: fileData.type,
    // }
    // sendResponse('remove-file', dataRemoveOldFile, () => {
    //
    //
    //
    // }

    //console.log('AAAA',itemData)

    let preparedFiles = null

    if (inputKey === 'dragon-bones-files') {
        preparedFiles = prepareFiles(TYPES_DRAGONS, id, oldItemData, files)
    }

    if (inputKey === 'spines-files') {
        preparedFiles = prepareFiles(TYPES_SPINE, id, oldItemData, files)
    }

    if (inputKey === 'image-static') {
        preparedFiles = prepareFiles(TYPES_IMG_STATIC, id, oldItemData, files)
    }

    if (inputKey === 'image-blur') {
        preparedFiles = prepareFiles(TYPES_IMG_BLUR, id, oldItemData, files)
    }

    preparedFiles && sendFiles(preparedFiles, callback)
}




const prepareFiles = (TYPES, id, oldItemData, files) => {
    const filesDataToSend = []
    for (let i = 0; i < files.length; i++) {
        for (let j = 0; j < TYPES.length; j++) {
            if (files[i].name.includes(TYPES[j].include)) {
                filesDataToSend.push({
                    id,
                    oldFileName: (oldItemData.files[TYPES[j].type] && oldItemData.files[TYPES[j].type].name) ? oldItemData.files[TYPES[j].type].name : null,
                    type: TYPES[j].type,
                    file: files[i],
                })
            }
        }
    }
    return filesDataToSend
}




const sendFiles = (arr, callback) => {

    const checkerIsUploadComplete = resp => {
        if (resp.mess[0] === 'loaded') {
            return true
        }
        console.log('mistake')
        return false
    }


    const iterator = i => {
        if (i === arr.length) return void callback()

        arr[i].oldFileName
            ? sendResponse('remove-file', { id: arr[i].id, type:arr[i].type, name: arr[i].oldFileName }, () => {
                    uploadFile('upload-file', arr[i], resp => checkerIsUploadComplete(resp) && iterator(++i))
                })
            :  uploadFile('upload-file', arr[i], resp => checkerIsUploadComplete(resp) && iterator(++i))

    }

    iterator(0)
}



export const sendFileData = (id, imageViewType, files, callback) => {
    const dataToSend = { id, type: imageViewType, file: files[0], }
    uploadFile('upload-image', dataToSend, resp => {
        if (resp.mess[0] === 'loaded') {
            console.log(`loaded ${resp.mess[1]}`)
            callback()
        }
    })
}


