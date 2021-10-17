import { sendResponse, uploadFile } from "../../toServerApi/requests";
import { showDragonSpr, playAnimation } from "../../appPixi/AppPixi"


const TYPES = [
    { include: '_ske.json', type: 'dragon-ske' },
    { include: '_tex.json', type: 'dragon-tex' },
    { include: '_tex.png', type: 'dragon-img' },
]


export const prepareDragonFilesToSend = (id, files, callback) => {
    const preparedFiles = prepareFiles(id, files)
    sendFiles(preparedFiles, callback)
}


const prepareFiles = (id, files) => {
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

//
// export const getItemDataById = (id, callback) => {
//     sendResponse('get-item', { id }, res => {
//         callback(res)
//     })
// }

