import React, { useState, useEffect, } from 'react'
import { AppInput } from "../components/AppInput";
import uniqid from 'uniqid'
import { sendResponse } from "../../toServerApi/requests";

 
const prepareInitSpriteData = () => ({
    'id': uniqid(),
    'name': '',
    'typeExec': 'dragonBones',
    'typeView': 'slot-item',
    'files': {}
})


const addNewItemToServer = (dataItem, callback) => sendResponse('add-item', dataItem, callback)


export function ItemViewCreate(props) {
    const [dataItem, setToStateData] = useState(props.dataItem || prepareInitSpriteData())

    const sendDataToServer = () => {
        addNewItemToServer(dataItem, ()=>props.changeMainTab("items-list"))
    } 


    return (
        <div>
            <div className='content-stroke'>
                <span>id: {dataItem.id}</span>
            </div>
            <hr />

            <AppInput
                val={dataItem.name}
                type={"name"}
                callBackClick = {e => changeDataFile('name', e.val)} />
        </div>
    )
}


