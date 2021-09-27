import { uploadFile } from "../../toServerApi/requests";


const TYPES = [
    { include: '_ske.json', type: 'dragon-ske' },
    { include: '_tex.json', type: 'dragon-tex' },
    { include: '_tex.png', type: 'dragon-img' },
]


export const prepareDragonFilesToSend = (id, files) => {
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


    const checkerIsUploadComplete = resp => {
        if (resp.mess[0] === 'loaded') {
            console.log(`loaded ${resp.mess[1]}`)
            return true
        }
        
        console.log('mistake')
        return false
    }


    const iterator = i => {
        if (i === TYPES.length) {
            return;
        }

        uploadFile('upload-file', filesDataToSend[i], resp => {
            if (checkerIsUploadComplete(resp)) {
                iterator(++i)
            }
        })
    }

    iterator(0)
}