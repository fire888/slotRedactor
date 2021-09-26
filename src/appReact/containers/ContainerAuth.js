import React, { useState, useEffect } from 'react'
import { AppInput } from "../components/AppInput";
import { AppButton } from '../components/AppButton'

const WORD = 'kitten'


export function ContainerAuth(props) {
    const userRole = localStorage.getItem('userRole')

    const [isAuth, toggleAuth] = useState(!!userRole)
    const [isShowSendButton, toggleSendButton] = useState(false)
    const [value, changeValueFromInput] = useState('')
    const [alertMess, changeAlertMess] = useState(null)

    setTimeout(() => {
        props.callback(isAuth)
    })

    const changeViewSendButton = e => {
        changeAlertMess(null) 
        changeValueFromInput(e.val)
        toggleSendButton(e.val !== '')
    }

    const checkInputValue = () => {
        if (value === WORD) {
            localStorage.setItem('userRole', 'animator')
            toggleAuth(true)
            props.callback(true)
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
        <div className='fixed left top'>
            { !isAuth
                ? <div className='content-stroke'>
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
                : <AppButton
                    val='exit'
                    callBackClick={() => {
                        localStorage.removeItem('userRole');
                        toggleAuth(false)
                        props.callback(false)
                    }}/> }
        </div>
    )
}


