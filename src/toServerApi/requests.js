import { HOST } from '../globals'



const PATHS = {
    "add-item": `${ HOST }/api/add-item`,
    "edit-item": `${ HOST }/api/edit-item`,
    "remove-item": `${ HOST }/api/remove-item`,
    "get-list": `${ HOST }/api/get-list`,
    "get-item-data": `${ HOST }/api/get-item-data`,
    "change-item-data": `${ HOST }/api/change-item-data`,
    
    "upload-file": `${ HOST }/api/upload-file`,
    "remove-file": `${ HOST }/api/remove-file`,

    "get-games-tags": `${ HOST }/api/get-games-tags`,
    "add-game-tag": `${ HOST }/api/add-game-tag`
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
    const body = JSON.stringify({...data})
    const params = Object.assign({}, reqParams.post, { body })

    doFetch(PATHS[key], params, onDone || defaultOnSuccess, offDone || defaultOnDenied)
}



export function uploadFile (key, fileData, onDone, offDone) {
    const body = new FormData()
    body.append('id', fileData.id)
    body.append('type', fileData.type)
    body.append('fileKey', fileData.type + '_' + fileData.id)
    body.append('file', fileData.file)
    const params = Object.assign({}, reqParams.postFiles, { body })

    doFetch(PATHS[key], params, onDone || defaultOnSuccess, offDone || defaultOnDenied)
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

