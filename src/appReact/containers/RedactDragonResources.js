import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { AppLoadFile } from "../components/AppLoadFile";
import {AppInput} from "../components/AppInput";

import {sendResponse} from "../../toServerApi/requests";


const arrKeys = [ 'skeletonJson', 'textureJson', 'imageDr' ]
const fileData = {}


const startData = {
    'typeExec': 'dragonBones',
    'typeView': 'slot-item',
    'name': '',
    'animationsNames': [],
    'armatureName': '',
    files: [
        { 'type-file': 'dragon-ske', path: '././', name: 'aaaa.json', file: '--' },
        { 'type-file': 'dragon-tex', path: '././', name: 'bbb.json', file: '--' },
        { 'type-file': 'dragon-img', path: '././', name: 'bbb.png', file: '--' }
    ]
}


export function RedactDragonResources(props) {

    const [dataItem, setToStateData] = useState(props.dataItem || JSON.parse(JSON.stringify(startData)))
    const [alertMess, setAlertMess] = useState([])
    const [isShowDelete, showButtonDelete] = useState(props.type !=="add-item")


    const changeDataFile = (key, data) => {
        if (key === "name" || key === "armatureName") {
            dataItem[key] = data
        }
        setToStateData(dataItem)
    }

    const checkAllLoaded = v => {
        fileData[v.type] = v.file
        let isAllFiles = true
        for (let i = 0; i < arrKeys.length; i++) {
            if (!fileData[arrKeys[i]]) isAllFiles = false
        }
        isAllFiles && showStartButton(true)
    }

    return (
        <div>
            <AppInput
                val={dataItem.name}
                type={"name"}
                callBackClick = {e => {
                    changeDataFile('name', e.val)
                }} />


            <AppInput
                val={dataItem.armatureName}
                type={"armatureName"}
                callBackClick = {e => {
                    changeDataFile('armatureName', e.val)
                }} />    


            <AppLoadFile
                type='skeletonJson'
                val='skeletonJson'
                callBackClick = {checkAllLoaded} />


            <AppLoadFile
                type='textureJson'
                val='textureJson'
                callBackClick = {checkAllLoaded} />


            <AppLoadFile
                type='imageDr'
                val='image'
                callBackClick = {checkAllLoaded} />


            <div style={{"color": "red"}}>
                {alertMess.map(item => <div key={Math.random()}>{item}</div>)}
            </div>    


            <div> 
                <AppButton
                        val='save'
                        classNameCustom=''
                        callBackClick = {() => {
                            if (props.mode === 'add-item') {
                                sendResponse('add-item', dataItem, res => setAlertMess(res.mess))
                            }
                            if (props.mode === 'edit-item') {
                                sendResponse('edit-item', dataItem, res => setAlertMess(res.mess))
                            }
                        }} 
                    />


                {props.mode === "edit-item" && 
                    <AppButton
                        val='delete'
                        classNameCustom=''
                        callBackClick = {()=>sendResponse('remove-item', { id: dataItem.id })} 
                    />}    
            </div>       
        </div>
    )
}


