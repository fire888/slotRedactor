import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";

const startAnimate = animationName => {
    console.log(animationName)
    window.emitter.emit('startAnimate', animationName)
}


const createArrFromObj = obj => {
    const arr = []
    for (let key in obj) {
        arr.push({ type: key, name: obj[key].name})
    }
    return arr
}

const setToView = data => setTimeout(() => {
    window.emitter.emit('dragonBonesFiles', data)
})

export function ViewItem(props) {

    console.log(props.currentDataItem.name)
    setToView(props.currentDataItem)

    return (
        <div className='content-tab'>
            <div>id: {props.currentDataItem.id}</div>
            <div>name: {props.currentDataItem.name}</div>
            <div>arm: {props.currentDataItem.armatureName}</div>
            <div>
                {props.currentDataItem.animationsNames.map((n, i) => n &&
                    <AppButton
                        key={i}
                        classNameCustom={'long'}
                        val={n}
                        callBackClick={()=>startAnimate(n)} />
                   )}
            </div>
            <div>
                {createArrFromObj(props.currentDataItem.files).map((n, i) =>
                    <div key={i}>type {n.type} file: {n.name}</div>)}
            </div>
            <div className="row-space-between">
                <AppButton
                    val='edit'
                    classNameCustom=''
                    callBackClick={() => props.changeMainTab('edit-item')}
                />
            </div>
        </div>
    )
}


