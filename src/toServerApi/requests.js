//const HOST = "http://192.168.0.101:3010"
const HOST = "http://192.168.10.2:3010"
const PATHS = {
    "add-item": "/api/add-item",
    "edit-item": "/api/edit-item",
    "remove-item": "/api/remove-item",
    "get-list": "/api/get-list",
}



const reqParams = {
    post: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }
}



export function sendResponse (key, data, onDone, offDone) {
    const path = `${ HOST }${ PATHS[key] }`

    const body = JSON.stringify({
        ...data
    })
    const params = Object.assign({}, reqParams.post, { body })

    console.log(params)
    startFetch(path, params, onDone || onSuccess, offDone || onDenied)
}


const onSuccess = (json) =>  console.log(JSON.stringify(json) + ',')


const onDenied = (mess, response) => console.log('denied', response)


const startFetch = (path, params, onSuccess, onDenied) => {
    fetch(path, params)
        .then(function (response) {
            if (response.status === 200) {
                response.json()
                    .then(onSuccess)
            }
            else if (response.status === 404) {
                onDenied('Session token doesnt exist or has expired', response)
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


