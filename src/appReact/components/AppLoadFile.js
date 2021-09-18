import React, { useState, useEffect } from 'react'
import '../stylesheets/AppLoadFile.css'
import { AppButton } from './AppButton'


import { uploadFile } from "../../toServerApi/requests";


export function AppLoadFile (props) {
    
    const [currentFile, setCurrentFile] = useState(null)
    const [isShowUploadButton, toggleUploadButton] = useState(false)
    const [message, changeMessage] = useState(null)


    /**
     * create timeout to reset messages after time  
     * remove timeout of reset messages if component unmounted 
     */
    useEffect(() => {
        let timeout = null
        if (message !== null) {
            timeout = setTimeout(() => changeMessage(null), 3000)
        } 
        return () => { 
            timeout && clearTimeout(timeout)
        }
    })


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
                            }
                        )
                        
                    }} />
                }
                {message}
        </div>
    )
}
