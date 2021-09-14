import React, { useState } from 'react'
import '../stylesheets/AppLoadFile.css'
import { AppButton } from './AppButton'


export function AppLoadFile (props) {
    
    const [currentFile, setCurrentFile] = useState(null)

    return (
        <div className={`AppLoadFile`}>
                {props.val}
                <br/>
                <input 
                    type="file" 
                    name="file" 
                    onChange={e => setCurrentFile(e.target.files[0])} />
                <AppButton
                    val="upload"
                    callBackClick={() => {props.callBackClick({ type: props.type, file: currentFile })}} />
        </div>
    )
}
