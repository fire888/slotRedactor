import React, { useState } from 'react'
import '../stylesheets/AppInput.css'
import {AppButton} from "./AppButton";


export function AppInput (props) {
    const [inputValue, changeInputValue] = useState(props.val)

    const changeHandler = event => changeInputValue(event.target.value)

    const returnNewVal = () => {
        console.log(inputValue)
        props.callback({ type: props.type, val: inputValue })
    }

    return (
        <div className={`AppInput`}>
            {props.type}:
            <br/>
            <div className='content-stroke'>
                <input type="text" name="name" defaultValue={inputValue} onChange={changeHandler} />
                {inputValue !== "" && inputValue !== props.val &&
                    <AppButton
                        val='save'
                        callBackClick={returnNewVal}

                />}
            </div>
        </div>
    )
}