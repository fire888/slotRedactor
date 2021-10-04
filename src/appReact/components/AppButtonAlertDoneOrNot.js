import React, { useState } from 'react'
import { AppButton } from "./AppButton";

export function AppButtonAlertDoneOrNot(props) {
    const [showMode, changeShowMode] = useState(null)
    return (
        <div> 
            {showMode &&
                <div className="contrnt-right">
                    Are you sure: {props.val}
                    <AppButton
                        val='cancel'
                        callBackClick={e=>{
                            e.preventDefault()
                            e.stopPropagation()
                            changeShowMode(null)
                        }}/>
                </div>}

            <div className="contrnt-right">
                <AppButton
                    val='delete'
                    classNameCustom='color-alert'
                    callBackClick = {() => {
                        showMode === 'alert'
                            ? props.callBackClick()
                            : changeShowMode('alert')
                    }}/>
            </div>
        </div>
    )
}
