import { HOST } from '../globals'



const PATHS = {
    "add-item": "/api/add-item",
    "edit-item": "/api/edit-item",
    "remove-item": "/api/remove-item",
    "get-list": "/api/get-list",
    "get-item-data": "/api/get-item-data",
    
    "upload-file": "/api/upload-file",
    "remove-files": "/api/remove-files",
    "upload-image": "/api/upload-image",

    'get-games-tags': '/api/get-games-tags',
    //"get-sets-list": "/api/get-sets-list",
}



const reqParams = {
    post: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    },
    postFiles: {
        method: 'POST',
        headers: {
            'mode': 'cors',
            'credentials': 'include',
        }
    }
}



const defaultOnSuccess = json =>  console.log(JSON.stringify(json) + ',')
const defaultOnDenied = (mess, response) => console.log('denied', response)



export function sendResponse (key, data, onDone, offDone) {
    const path = `${ HOST }${ PATHS[key] }`

    const body = JSON.stringify({...data})
    const params = Object.assign({}, reqParams.post, { body })

    doFetch(path, params, onDone || defaultOnSuccess, offDone || defaultOnDenied)
}



export function uploadFile (key, fileData, onDone, offDone) {
    const path = `${ HOST }${ PATHS[key] }`

    const body = new FormData()
    body.append('id', fileData.id)
    body.append('type', fileData.type)
    body.append('fileKey', fileData.type + '_' + fileData.id)
    body.append('file', fileData.file)
    const params = Object.assign({}, reqParams.postFiles, { body })

    doFetch(path, params, onDone || defaultOnSuccess, offDone || defaultOnDenied)
}



const doFetch = (path, params, onSuccess, onDenied) => {
    fetch(path, params)
        .then(response => {

            if (response.status === 200) {

                response.json().then(onSuccess)

            } else if (response.status === 404) {

                onDenied('404 error', response)

            } else if (response.status === 412) {

                response.text().then(text => onDenied(text, response))

            } else {

                onDenied(response.status, response)

            }

        })
        .catch(err => onDenied('NETWORK ERROR', err))
}

