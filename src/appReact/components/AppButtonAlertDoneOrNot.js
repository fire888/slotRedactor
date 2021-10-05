import React, { useState } from 'react'
import { AppButton } from "./AppButton";

export function AppButtonAlertDoneOrNot(props) {
    const [showMode, changeShowMode] = useState(null)
    return (
        <div className='inline'>
            {showMode &&
                <span>
                    Are you sure {props.val}:
                    <AppButton
                        val='not'
                        callBackClick={e=>{
                            e.preventDefault()
                            e.stopPropagation()
                            changeShowMode(null)
                        }}/>
                </span>}

            <AppButton
                val={props.val}
                classNameCustom='color-alert'
                callBackClick = {() => {
                    showMode === 'alert'
                        ? props.callBackClick()
                        : changeShowMode('alert')
                }}/>
        </div>
    )
}
