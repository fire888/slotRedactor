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


const prepareInitSpriteData = () => {
    const newData = JSON.parse(JSON.stringify(initSpriteData))
    newData.id = uniqid()
    return newData
}


export function RedactDragonResources(props) {

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

    return (
        <div className='content-tab'>
            <div className='contrnt-right'>
                <AppButton
                        val='close'
                        classNameCustom=''
                        callBackClick = {()=>props.changeMainTab("view-item")}/>
            </div>
            <hr />
            <div className='content-stroke'>
                <span>id: {dataItem.id}</span>
            </div>

            <hr />

            <AppInput
                val={dataItem.name}
                type={"name"}
                callBackClick = {e => {
                    changeDataFile('name', e.val)
                }} />



            {/** EDIT SECTOR *************************************/}

            {props.mode === "edit-item" &&
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

                    </div>}           

                <AppButton
                    val='save'
                    classNameCustom=''
                    callBackClick = {() => {
                        if (props.mode === 'add-item') {
                            addNewItem(dataItem, res => {
                                console.log(res)
                                props.changeMainTab("items-list")
                            })
                        }

                        if (props.mode === 'edit-item') {
                            sendResponse('edit-item', dataItem, res => setAlertMess(res.mess))
                        }
                    }} 
                />    

                <hr />            

                {props.mode === "edit-item" &&            
                    <div>

                        <AppLoadFile
                            type='dragon-ske'
                            val='dragon-ske'
                            itemId={dataItem.id} />


                        <AppLoadFile
                            type='dragon-tex'
                            val='dragon-tex'
                            itemId={dataItem.id} />


                        <AppLoadFile
                            type='dragon-img'
                            val='dragon-img'
                            itemId={dataItem.id} />

                        <hr />    

                    </div>}

                <div>
                    {alertMess.map(item => <div key={Math.random()}>{item}</div>)}
                </div>


                <div className="contrnt-right">
                    {props.mode === "edit-item" &&
                        <AppButton
                            val='delete'
                            classNameCustom='color-alert'
                            callBackClick = {() => {
                                sendResponse(
                                    'remove-item',
                                    { id: dataItem.id },
                                    () => props.changeMainTab("items-list")) }
                            }/>}
            </div>
        </div>
    )
}


