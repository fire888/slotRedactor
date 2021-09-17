import React, { useState } from 'react'
import '../stylesheets/AppLoadFile.css'
import { AppButton } from './AppButton'


import { uploadFile } from "../../toServerApi/requests";


export function AppLoadFile (props) {
    
    const [currentFile, setCurrentFile] = useState(null)
    const [isShowUploadButton, toggleUploadButton] = useState(false)
    const [message, changeMessage] = useState(null)

    return (
        <div className={`AppLoadFile`}>
                {props.val}
                <br/>
                <input 
                    type="file" 
                    name="file" 
                    onChange={e => { 
                        setCurrentFile(e.target.files[0])
                        toggleUploadButton(true)
                    }} />
                {isShowUploadButton && <AppButton
                    val="upload"
                    callBackClick={() => {
                        toggleUploadButton(false)
                        uploadFile(
                            'upload-file',
                            { type: props.type, file: currentFile, id: props.itemId }, 
                            resp=>{
                                const mess = resp.mess[0] === 'loaded'
                                    ? `loaded ${resp.mess[1]}`
                                    : 'denied'
                                changeMessage(mess)    
                                setTimeout(()=>changeMessage(null), 3000)    
                            }
                        )
                        
                    }} />
                }
                {message}
        </div>
    )
}

// import React, {useState} from 'react'
// import '../stylesheets/AppInput.css'

/*
export function AppInput (props) {
    const [isShowUploadButton, toggleUploadButton] = useState(false)
    const [dataFile, changeDataFile] = useState(null)
    const [valMessage, changeMessage] = useState(null)

    const changeHandler = event => {
        changeDataFile({ type: props.type, val: event.target.value })
        toggleUploadButton(true)
    }

    return (
        <div className={`AppInput`}>
            {props.type}
            <div className='content-stroke'>
                <input type="text" name="name" defaultValue={props.val} onChange={changeHandler} />
                {isShowUploadButton && 
                    <button
                        onClick={() => { 
                            props.callBackClick(dataFile)
                            toggleUploadButton(false)
                            changeMessage('done')
                            setTimeout(()=>changeMessage(null), 2000) 
                        }}>
                        upload
                    </button>}
                {valMessage}    
            </div>    
        </div>
    )
}
*/