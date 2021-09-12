import React from 'react'
import '../stylesheets/AppInput.css'


export function AppInput (props) {
    const changeHandler = event => {
        props.callBackClick({ type: props.type, val: event.target.value })
    }

    return (
        <div className={`AppInput`}>
            {props.type}
            <br/>
            <input type="text" name="name" defaultValue={props.val} onChange={changeHandler} />
        </div>
    )
}