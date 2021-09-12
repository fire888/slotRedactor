import React from 'react'
import '../stylesheets/AppLoadFile.css'


export function AppLoadFile (props) {

    const changeHandler = event => props.callBackClick({ type: props.type, file: event.target.files[0] })
    const handleSubmission = event => console.log(event)

    return (
        <div className={`AppLoadFile`}>
                {props.val}
                <br/>
                <input type="file" name="file" onChange={changeHandler} />
                <button type="submit" onClick={handleSubmission}>Submit</button>
        </div>
    )
}