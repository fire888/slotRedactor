import React from 'react'
import '../stylesheets/AppButton.css'

export function AppButton (props) {

    return <div
        className={`AppButton ${props.classNameCustom}`}
        onClick={() => {
            props.callBackClick()}}>
        {props.val}
    </div>
}