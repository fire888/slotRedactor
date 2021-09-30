import React, { useState, useEffect, } from 'react'
import { AppButton } from "../components/AppButton";
import { AppInput } from "../components/AppInput";
import { AppLoadMultFiles } from '../components/AppLoadMultFiles'
import { prepareDragonFilesToSend } from '../helpers/prepareFilesToSend'

import uniqid from 'uniqid'
import { sendResponse } from "../../toServerApi/requests";
import { playAnimation, showDragonSpr } from "../../appPixi/AppPixi";


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
    const [animations, setAnimations] = useState([])
    // useEffect(() => {
    //     showDragonSpr(props.dataItem, setAnimations)
    // })

    //setTimeout(() => { showDragonSpr(props.dataItem, setAnimations)})



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
            addNewItemToServer(dataItem, ()=>props.changeMainTab("items-list"))
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
        prepareDragonFilesToSend(dataItem.id, files, arr => {
            console.log('----------------', arr)
            setAnimations(arr)
        })
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
                    {animations.map((n, i) => n &&
                        <div
                            className="content-stroke"
                            key={i}>
                            <span>{n}</span>
                            <div className="contrnt-right">
                                <AppButton
                                    val='once'
                                    callBackClick={()=>playAnimation({ animationName: n, count: 1 })} />
                                <AppButton
                                    val='repeat'
                                    callBackClick={()=>playAnimation({ animationName: n, count: 1000 })} />
                                <AppButton
                                    val='stop'
                                    callBackClick={()=>playAnimation({ animationName: n, count: false })} />

                            </div>
                        </div>
                    )}
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


