import React from 'react'
import '../stylesheets/AppLoadFile.css'


export function AppInput (props) {
    const changeHandler = event => {
        props.callBackClick({ type: props.type, val: event.target.value })
    }

    return (
        <div className={`AppButton AppLoadFile`}>
            {props.val}
            <br/>
            <input type="text" name="name" onChange={changeHandler} />
        </div>
    )
}