import React, { useState } from 'react'
import { AppButton } from "./AppButton";

export function AppButtonAlertDoneOrNot(props) {
    const [showMode, changeShowMode] = useState(null)
    return (
        <div> 
            {showMode === 'popup' && 
                <div className="contrnt-right">
                    Are you sure: {props.val}
                    <AppButton
                        val='cancel'
                        callBackClick = {() => changeShowMode(null)}
                    />
                </div>}

            <div className="contrnt-right">
            <AppButton
                val='delete'
                classNameCustom='color-alert'
                callBackClick = {() => {
                    console.log('delete')
                    changeShowMode('popup')
                }}
            />
            </div>
        </div>
    )
}


/*
                (<div className='black-wrapper'>
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
 
 */