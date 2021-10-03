import React, { useState, useEffect } from 'react'
import { AppInput } from "../components/AppInput";
import { AppButton } from '../components/AppButton'


const getRole = pass => { 
    const ROLES_BY_WORLD = {
        'kitten':'user',
        '@animator': 'animator',
        '@superAdmin': 'superAdmin',
    }
    return ROLES_BY_WORLD[pass] || null 
}


export function ContainerAuth(props) {
    const userRole = localStorage.getItem('userRole')

    const [role, changeRole] = useState(userRole)
    const [alertMess, changeAlertMess] = useState(null)

    setTimeout(() => props.callback(role))

    const checkInputValue = ({ val }) => {
        const role = getRole(val)

        if (role) {
            localStorage.setItem('userRole', role)
            changeRole(role)
            props.callback(role)
        } else {
            changeAlertMess('denied')
            setTimeout(() => changeAlertMess(''), 2000)
        }
    }

    return (
        <div className='fixed left top'>
            {!role
                ?   <AppInput
                        val=''
                        type='enter code:'
                        buttonVal='send'
                        alertMess={alertMess}
                        callback={checkInputValue} />

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

