import { HOST } from '../globals'


const PATHS = {
    "add-item": "/api/add-item",
    "edit-item": "/api/edit-item",
    "remove-item": "/api/remove-item",
    "get-list": "/api/get-list",
    "get-item": "/api/get-item",
    "upload-file": "/api/upload-file",
    "remove-files": "/api/remove-files",

    "get-sets-list": "/api/get-sets-list",
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
    }
}



export function sendResponse (key, data, onDone, offDone) {
    const path = `${ HOST }${ PATHS[key] }`

    const body = JSON.stringify({...data})
    const params = Object.assign({}, reqParams.post, { body })

    startFetch(path, params, onDone || onSuccess, offDone || onDenied)
}



export function uploadFile (key, fileData, onDone, offDone) {
    const path = `${ HOST }${ PATHS[key] }`

    const formData = new FormData();
    formData.append('id', fileData.id)
    formData.append('type', fileData.type)
    formData.append('fileKey', fileData.type + '_' + fileData.id)
    formData.append('file', fileData.file)

    const params = Object.assign({}, reqParams.postFiles, { body: formData })

    startFetch(path, params, onDone || onSuccess, offDone || onDenied)
}


export function removeFiles() {

}


const onSuccess = (json) =>  console.log(JSON.stringify(json) + ',')


const onDenied = (mess, response) => console.log('denied', response)


const startFetch = (path, params, onSuccess, onDenied) => {
    fetch(path, params)
        .then(function (response) {
            if (response.status === 200) {
                response.json()
                    .then((r) => { 
                        onSuccess(r) 
                    })
            }
            else if (response.status === 404) {
                onDenied('404 error', response)
            }
            else if (response.status === 412) {
                response.text()
                    .then(text => onDenied(text, response))
            }
            else {
                onDenied(response.status, response)
            }
        }.bind(this))
        .catch(function(err) {
            onDenied('NETWORK ERROR', err)
        }.bind(this))
}


