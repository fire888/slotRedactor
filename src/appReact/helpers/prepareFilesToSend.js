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





export const sendFilesToServer = (inputKey, id, files, callback) => {
    let preparedFiles = null

    if (inputKey === 'dragon-bones-files') {
        preparedFiles = prepareFiles(TYPES_DRAGONS, id, files)
    }

    if (inputKey === 'spines-files') {
        preparedFiles = prepareFiles(TYPES_SPINE, id, files)
    }

    if (inputKey === 'image-static') {
        console.log('!!!!', TYPES_IMG_STATIC, id, files)
        preparedFiles = prepareFiles(TYPES_IMG_STATIC, id, files)
    }

    if (inputKey === 'image-blur') {
        preparedFiles = prepareFiles(TYPES_IMG_BLUR, id, files)
    }

    preparedFiles && sendFiles(preparedFiles, callback)
}




const prepareFiles = (TYPES, id, files) => {
    const filesDataToSend = []
    for (let i = 0; i < files.length; i++) {
        for (let j = 0; j < TYPES.length; j++) {
            if (files[i].name.includes(TYPES[j].include)) {
                filesDataToSend.push({
                    id,
                    type: TYPES[j].type,
                    file: files[i],
                })
            }
        }
    }
    return filesDataToSend
}


const removeFilesFromSever = (id, callback) => {
    sendResponse("remove-files", { id }, res => {
        if (res.mess[0] === 'files removed') {
            callback()
        }
    })
}


const sendFiles = (arr, callback) => {

    const checkerIsUploadComplete = resp => {
        if (resp.mess[0] === 'loaded') {
            console.log(`loaded ${resp.mess[1]}`)
            return true
        }
        console.log('mistake')
        return false
    }


    const iterator = i => {
        if (i === arr.length) return void callback()

        uploadFile('upload-file', arr[i], resp => checkerIsUploadComplete(resp) && iterator(++i))
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


