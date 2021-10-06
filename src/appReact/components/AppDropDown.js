import React, { useState } from 'react'
import '../stylesheets/AppInput.css'
import {AppButton} from "./AppButton";


export function AppDropDown (props) {
    const [inputValue, changeInputValue] = useState(props.val)

    const changeHandler = event => changeInputValue(event.target.value)

    return (
        <div className={`AppInput`}>
            {props.type}
            <br/>
            <div className='content-stroke'>
                <input type="text" name="name" defaultValue={inputValue} onChange={changeHandler} />
                {inputValue !== "" && inputValue !== props.val &&
                (props.alertMess
                        ? props.alertMess
                        : <AppButton
                            val={props.buttonVal}
                            callBackClick={() => props.callback({ type: props.type, val: inputValue })}/>
                )
                }
            </div>
        </div>
    )
}