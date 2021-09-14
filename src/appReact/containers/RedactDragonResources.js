import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { AppLoadFile } from "../components/AppLoadFile";
import { AppInput } from "../components/AppInput";

import uniqid from 'uniqid'
import { sendResponse, uploadFile } from "../../toServerApi/requests";



const addNewItem = (dataItem, callback) => sendResponse('add-item', dataItem, callback)




const initSpriteData = {
    'id': null,
    'name': '',
    'typeExec': 'dragonBones',
    'typeView': 'slot-item',
}


const editSpriteData = {
    'animationsNames': [null, null, null, null],
    'armatureName': '',
    'files': {
        'dragon-ske': {},
        'dragon-tex': {},
        'dragon-img': {},
    }
}


const prepareInitSpriteData = () => {
    const newData = JSON.parse(JSON.stringify(initSpriteData))
    newData.id = uniqid()
    return newData
}


export function RedactDragonResources(props) {

    console.log('dataItem', props.dataItem)
    
    const [modeView, changeModeView] = useState(props.mode)
    const [dataItem, setToStateData] = useState(props.dataItem || prepareInitSpriteData())
    const [alertMess, setAlertMess] = useState([])


    const changeDataFile = (key, data) => {
        if (key === "name" || key === "armatureName") {
            dataItem[key] = data
        }
        if (
            key === "animationName_0" ||
            key === "animationName_1" ||
            key === "animationName_2" ||
            key === "animationName_3"
        ) {
            dataItem['animationsNames'][+key.split('_')[1]] = data
        }
        setToStateData(dataItem)
    }

    const setFileToData = data => {
        console.log(data)
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



            {/** EDIT SECTOR *************************************/}

            {modeView === "edit-item" &&
                <div>
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


                    <AppInput
                        val={dataItem.animationsNames && dataItem.animationsNames[3]}
                        type={"animationName_3"}
                        callBackClick = {e => {
                            changeDataFile('animationName_3', e.val)
                        }} />


                    <AppLoadFile
                        type='dragon-ske'
                        val='dragon-ske'
                        callBackClick={setFileToData} />


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

                </div>}



            <div className="row-space-between">
                <AppButton
                    val='close'
                    classNameCustom=''
                    callBackClick = {() => props.changeMainTab("items-list")}/>


                <AppButton
                        val='save'
                        classNameCustom=''
                        callBackClick = {() => {
                            console.log('!!!')
                            if (modeView === 'add-item') {
                                addNewItem(dataItem, res => {
                                    console.log(res)
                                    props.changeMainTab("items-list")
                                })
                            }

                            if (modeView === 'edit-item') {
                                sendResponse('edit-item', dataItem, res => setAlertMess(res.mess))
                            }
                        }} 
                    />


                {modeView === "edit-item" &&
                    <AppButton
                        val='delete'
                        classNameCustom=''
                        callBackClick = {() => {
                            console.log('!!! delete')
                            sendResponse(
                                'remove-item',
                                { id: dataItem.id },
                                () => props.changeMainTab("items-list")) }
                        }/>}
            </div>
        </div>
    )
}


