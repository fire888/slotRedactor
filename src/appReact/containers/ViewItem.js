import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";

const createArrFromObj = obj => {
    const arr = []
    for (let key in obj) {
        arr.push({ type: key, name: obj[key].name})
    }
    return arr
}

const setToView = data => setTimeout(() => {window.emitter.emit('dragonBonesFiles', data)})

export function ViewItem(props) {

    setToView(props.currentDataItem)

    return (
        <div className='content-tab'>
            <div>id: {props.currentDataItem.id}</div>
            <div>name: {props.currentDataItem.name}</div>
            <div>arm: {props.currentDataItem.armatureName}</div>
            <div>
                {props.currentDataItem.animationsNames.map((n, i) =>
                    <div key={i}>animation {i} {n}</div>)}
            </div>
            <div>
                {createArrFromObj(props.currentDataItem.files).map((n, i) =>
                    <div key={i}>type {n.type} file: {n.name}</div>)}
            </div>
            <div className="row-space-between">
                <AppButton
                    val='edit'
                    classNameCustom=''
                    callBackClick = {() => props.changeMainTab('edit-item')}
                />
            </div>
        </div>
    )
}


