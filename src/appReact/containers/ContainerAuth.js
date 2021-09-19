import React, { useState, useEffect } from 'react'
import { AppInput } from "../components/AppInput";
import { AppButton } from '../components/AppButton'

const WORD = 'kitten'

export function ContainerAuth(props) {
    const [isShowSendButton, toggleSendButton] = useState(false)
    const [value, changeValueFromInput] = useState('')
    const [alertMess, changeAlertMess] = useState(null) 


    const changeViewSendButton = e => {
        changeAlertMess(null) 
        changeValueFromInput(e.val)
        toggleSendButton(e.val !== '')
    }

    const checkInputValue = () => {
        if (value === WORD) {
            props.callback()
        } else {
            toggleSendButton(false)
            changeAlertMess('denied')
        }
    }

    /**
     * create timeout to reset messages after time  
     * remove timeout of reset messages if component unmounted 
     */
    useEffect(() => {
        let timeout = null
        if (alertMess !== null) {
            timeout = setTimeout(() => changeAlertMess(null), 3000)
        } 
        return () => { 
            timeout && clearTimeout(timeout)
        }
    })


    return (
        <div className='ui-content'>
            <div className='content-stroke'>
                <AppInput
                    val={''}
                    type={''}
                    callBackClick={changeViewSendButton} />

                {alertMess}

                {isShowSendButton && 
                    <AppButton 
                        val="send"
                        classNameCustom=''
                        callBackClick={checkInputValue} />}
                </div>                
        </div>
    )
}


