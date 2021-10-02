import React, { useState } from 'react'
import { AppButton } from "./AppButton";
import {sendResponse} from "../../toServerApi/requests";

export function AppButtonAlertDoneOrNot(props) {
    const [showMode, changeShowMode] = useState('button')
    return (
        <> {
            showMode === 'button'
                ?   (<AppButton
                        val='delete'
                        classNameCustom='color-alert'
                        callBackClick = {() => {
                            changeShowMode('popup')
                        }}
                    />)
                :   (<div className='black-wrapper'>
                        <div className='alert-cont'>
                            <div className='message-cont'>
                                Are you sure: {props.val}
                            </div>
                            <div className='body'>
                                <AppButton
                                    val="cancel"
                                    callBackClick={() => changeShowMode('button')}
                                />
                                <AppButton
                                    classNameCustom='color-alert'
                                    val={props.val}
                                    callBackClick={props.callBackClick}
                                />
                            </div>
                        </div>
                    </div>)
        }
        </>
    )
}