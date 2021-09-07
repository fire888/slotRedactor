import React, { useState } from 'react'
import '../stylesheets/AppLoadFile.css'


export function AppLoadFile (props) {
    // const [selectedFile, setSelectedFile] = useState();
    // const [isFilePicked,  setIsSelected] = useState(false);

    const changeHandler = event => {
        props.callBackClick({ type: props.type, file: event.target.files[0] })
    }

    const handleSubmission = () => {
    };

    return (
    <div className={`AppButton AppLoadFile`}>
            {props.val}
            <br/>
            <input type="file" name="file" onChange={changeHandler} />
            <div>
                <button onClick={handleSubmission}>Submit</button>
            </div>
    </div>
    )
}