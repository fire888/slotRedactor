import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { AppLoadFile } from "../components/AppLoadFile";
import { AppInput } from "../components/AppInput";

import uniqid from 'uniqid'
import { sendResponse, uploadFile } from "../../toServerApi/requests";


const arrKeys = [ 'dragon-ske', 'dragon-tex', 'dragon-img' ]
const filesData = {}


const startData = {
    'id': null,
    'typeExec': 'dragonBones',
    'typeView': 'slot-item',
    'name': '',
    'animationsNames': [null, null, null],
    'armatureName': '',
    files: {
        'dragon-ske': {},
        'dragon-tex': {},
        'dragon-img': {},
    }
}

const prepareNewDataFromStartData = () => {
    const newData = JSON.parse(JSON.stringify(startData))
    newData.id = uniqid()
    return newData
}


export function RedactDragonResources(props) {

    const [dataItem, setToStateData] = useState(props.dataItem || prepareNewDataFromStartData())
    const [alertMess, setAlertMess] = useState([])


    const changeDataFile = (key, data) => {
        if (key === "name" || key === "armatureName") {
            dataItem[key] = data
        }
        if (key === "animationName_0" || key === "animationName_1" || key === "animationName_2") {
            dataItem['animationsNames'][+key.split('_')[1]] = data
        }
        setToStateData(dataItem)
    }

    const setFileToData = data => {
        data.id = dataItem.id
        uploadFile('upload-file', data)
    }


    return (
        <div className='content-tab'>
            <div>id: {dataItem.id}</div>
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

            <AppInput
                val={dataItem.animationsNames && dataItem.animationsNames[0]}
                type={"animationName_0"}
                callBackClick = {e => {
                    changeDataFile('animationName_0', e.val)
                }} />

            <AppInput
                val={dataItem.animationsNames && dataItem.animationsNames[1]}
                type={"animationName_1"}
                callBackClick = {e => {
                    changeDataFile('animationName_1', e.val)
                }} />

            <AppInput
                val={dataItem.animationsNames && dataItem.animationsNames[2]}
                type={"animationName_2"}
                callBackClick = {e => {
                    changeDataFile('animationName_2', e.val)
                }} />


            <AppLoadFile
                type='dragon-ske'
                val='dragon-ske'
                callBackClick = {setFileToData} />


            <AppLoadFile
                type='dragon-tex'
                val='dragon-tex'
                callBackClick = {setFileToData} />


            <AppLoadFile
                type='dragon-img'
                val='dragon-img'
                callBackClick = {setFileToData} />


            <div style={{"color": "red"}}>
                {alertMess.map(item => <div key={Math.random()}>{item}</div>)}
            </div>    


            <div className="row-space-between">
                {props.mode === "edit-item" &&
                <AppButton
                    val='close'
                    classNameCustom=''
                    callBackClick = {() => props.changeMainTab("view-item")}/>}


                <AppButton
                        val='save'
                        classNameCustom=''
                        callBackClick = {() => {
                            if (props.mode === 'add-item') {
                                sendResponse('add-item', dataItem, res => {
                                    res.mess[0] !== 'success'
                                        ? setAlertMess(res.mess)
                                        : props.changeMainTab("items-list")
                                })
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
                        callBackClick = {() =>
                            sendResponse(
                                'remove-item',
                                { id: dataItem.id },
                                () => props.changeMainTab("items-list")) }/>}
            </div>
        </div>
    )
}


