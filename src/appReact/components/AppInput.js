import React, { useState } from 'react'
import '../stylesheets/AppInput.css'
import {AppButton} from "./AppButton";


export function AppInput (props) {
    const [inputValue, changeInputValue] = useState(props.val)
    const [alertMess, changeAlertMess] = useState(null)
    
    const changeHandler = event => changeInputValue(event.target.value)

    return (
        <div className={`AppInput`}>
            {props.type}
            <br/>
            <div className='content-stroke'>
                <input type="text" name="name" defaultValue={inputValue} onChange={changeHandler} />
                {inputValue !== "" && inputValue !== props.val &&
                    (alertMess
                        ? alertMess
                        : <AppButton
                            val={props.buttonVal}
                            callBackClick={e => {
                                e.stopPropagation()
                                e.preventDefault()
                                props.callback({ type: props.type, val: inputValue })
                                changeAlertMess('done')
                                setTimeout(() => {changeAlertMess(null)}, 2000)
                            }}/>
                    )
                }    
            </div>
        </div>
    )
}