import React, { useState, useEffect } from 'react'
import { AppButton } from "../components/AppButton";
import { AppLoadFile } from "../components/AppLoadFile";
import { AppInput } from "../components/AppInput";
import { AppLoadMultFiles } from '../components/AppLoadMultFiles'
import { prepareDragonFilesToSend } from '../helpers/prepareFilesToSend'

import uniqid from 'uniqid'
import { sendResponse } from "../../toServerApi/requests";


const prepareInitSpriteData = () => ({
    'id': uniqid(),
    'name': '',
    'typeExec': 'dragonBones',
    'typeView': 'slot-item',
    'animationsNames': [null, null, null, null],
    'files': {}
})


const addNewItemToServer = (dataItem, callback) => sendResponse('add-item', dataItem, callback)
const changeItemOnServer = (dataItem, callback) => sendResponse('edit-item', dataItem, callback)




export function RedactDragonResources(props) {
    const [dataItem, setToStateData] = useState(props.dataItem || prepareInitSpriteData())
    const [alertMess, setAlertMess] = useState(null)
    const [isShowSaveButton, toggleShowSaveButton] = useState(false)


    /** set changes from inputs to state */
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
        toggleShowSaveButton(true)
    }


    /** send state to server */
    const sendDataToServer = () => {
        toggleShowSaveButton(false)

        if (props.mode === 'add-item') {
            addNewItemToServer(dataItem, () =>props.changeMainTab("items-list"))
        }

        if (props.mode === 'edit-item') {
            changeItemOnServer(dataItem, (res) => {
                setAlertMess(res.mess)
            })
        }
    } 


    /** remove message since 3 sec */
    useEffect(() => {
        let timeout = null
        if (alertMess !== null) {
            timeout = setTimeout(() => setAlertMess(null), 3000)
        } 
        return () => { 
            timeout && clearTimeout(timeout)
        }
    })



    const onLoadMultFiles = files => {
        prepareDragonFilesToSend(dataItem.id, files)
    }




    return (
        <div className='content-tab'>
            <div className='contrnt-right'>
                <AppButton
                    val='close'
                    classNameCustom=''
                    callBackClick = {()=>props.changeMainTab("items-list")}/>
            </div>
            <hr />


            <div className='content-stroke'>
                <span>id: {dataItem.id}</span>
            </div>
            <hr />


            <AppInput
                val={dataItem.name}
                type={"name"}
                callBackClick = {e => changeDataFile('name', e.val)} />



            {/** EDIT SECTOR *************************************/}

            {props.mode === "edit-item" &&
                <div>
                    {/* <AppInput
                        val={dataItem.armatureName}
                        type={"armatureName"}
                        callBackClick = {e => changeDataFile('armatureName', e.val)} /> */}

                    <AppInput
                        val={dataItem.animationsNames && dataItem.animationsNames[0]}
                        type={"animationName_0"}
                        callBackClick = {e => changeDataFile('animationName_0', e.val)} />

                    <AppInput
                        val={dataItem.animationsNames && dataItem.animationsNames[1]}
                        type={"animationName_1"}
                        callBackClick = {e => changeDataFile('animationName_1', e.val)} />

                    <AppInput
                        val={dataItem.animationsNames && dataItem.animationsNames[2]}
                        type={"animationName_2"}
                        callBackClick = {e => changeDataFile('animationName_2', e.val)} />
  
                    
                    <AppInput
                        val={dataItem.animationsNames && dataItem.animationsNames[3]}
                        type={"animationName_3"}
                        callBackClick = {e => changeDataFile('animationName_3', e.val)} /> 
                </div>}           


                <div className="offset-top" />


                <div>
                    {alertMess && alertMess.map(item => <div key={Math.random()}>{item}</div>)}
                </div>  


                {isShowSaveButton && 
                    <AppButton
                        val='save'
                        callBackClick={sendDataToServer} />}



                <hr />            



                {props.mode === "edit-item" &&            
                    <div>
                        <AppLoadMultFiles 
                            callback={onLoadMultFiles}/>


                        {/* <AppLoadFile
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
                            itemId={dataItem.id} /> */}

                        <hr />    

                    </div>}


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


