import React, { useState } from 'react'
import '../stylesheets/AppSelect.css'
import { AppButton } from "./AppButton"


export function AppDropDown (props) {
    const [inputValue, changeInputValue] = useState(props.val)

    const changeHandler = event => changeInputValue(event.target.value)
    const submitHandler = e => {
        e.preventDefault()
        e.stopPropagation()
        props.callback({ type: props.type, val: inputValue })
    }


    return (
        <div className={`AppInput`}>
            {props.type}
            <br/>
            <div className='content-stroke'>
                <select value={inputValue} onChange={changeHandler}>
                    {props.arrOptions.map((item, i) => <option key = {i} value = {item}>{item}</option>)}
                </select>
                {inputValue !== "" && inputValue !== props.val &&
                    (props.alertMess
                            ? props.alertMess
                            : <AppButton
                                val={props.buttonVal}
                                callBackClick={submitHandler}/>
                    )}
            </div>
        </div>
    )
}