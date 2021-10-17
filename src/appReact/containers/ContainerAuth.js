import React, { useState, useEffect } from 'react'
import { AppInput } from "../components/AppInput";
import { AppButton } from '../components/AppButton'
import { connect } from 'react-redux'


const mapStateToProps = state => ({
    authRole: state.app.authRole,
})


const getRole = pass => { 
    const ROLES_BY_WORLD = {
        'kitten':'user',
        '@animator': 'animator',
        '@superAdmin': 'superAdmin',
    }
    return ROLES_BY_WORLD[pass] || null 
}



function ContainerAuth(props) {


    const [alertMess, changeAlertMess] = useState(null)

    useEffect(() => {
        const role = localStorage.getItem('userRole')
        props.dispatch({ type: 'CHANGE_AUTH_ROLE', authRole: role })
    })

    const checkInputValue = ({ val }) => {
        const role = getRole(val)

        if (role) {
            localStorage.setItem('userRole', role)
            props.dispatch({ type: 'CHANGE_AUTH_ROLE', authRole: role })
        } else {
            changeAlertMess('denied')
            setTimeout(() => changeAlertMess(''), 2000)
        }
    }

    return (
        <div className='fixed left top'>
            {!props.authRole
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
                                props.dispatch({ type: 'CHANGE_AUTH_ROLE', authRole: null })
                            }}/>
                    </div>}

            <hr />
        </div>
    )
}


export default connect(mapStateToProps)(ContainerAuth)

