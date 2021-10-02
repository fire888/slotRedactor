import React, { useState, useEffect } from 'react'
import { AppInput } from "../components/AppInput";
import { AppButton } from '../components/AppButton'


const ROLES_BY_WORLD = {
    'kitten':'user',
    '@animator': 'animator',
    '@superAdmin': 'superAdmin',
}


const getRole = pass => ROLES_BY_WORLD[pass] || null


export function ContainerAuth(props) {
    const userRole = localStorage.getItem('userRole')

    const [role, changeRole] = useState(userRole)
    const [isShowSendButton, toggleSendButton] = useState(false)
    const [value, changeValueFromInput] = useState('')
    const [alertMess, changeAlertMess] = useState(null)

    setTimeout(() => {
        props.callback(role)
    })

    const changeViewSendButton = e => {
        changeAlertMess(null) 
        changeValueFromInput(e.val)
        toggleSendButton(e.val !== '')
    }

    const checkInputValue = () => {
        const role = getRole(value)

        if (role) {
            localStorage.setItem('userRole', role)
            changeRole(role)
            props.callback(role)
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
            { !role
                ?   <div className='content-stroke'>
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

                :  <div className='contrnt-right'>
                        <AppButton
                            val='exit'
                            callBackClick={() => {
                                localStorage.removeItem('userRole');
                                changeRole(false)
                                props.callback(false)
                            }}/>
                    </div>}

            <hr />
        </div>
    )
}

