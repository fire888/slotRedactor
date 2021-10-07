import React, { useState, useEffect, } from 'react'
import { AppInput } from "../components/AppInput";
import uniqid from 'uniqid'
import { sendResponse } from "../../toServerApi/requests";
import {AppButton} from "../components/AppButton";

 
const prepareInitSpriteData = () => ({
    'id': uniqid(),
    'name': '',
    'typeExec': 'dragonBones',
    'typeView': 'slot-item',
    'files': {}
})



export function ItemViewCreate(props) {
    const [isClosed, toggleClosed] = useState(true)

    const sendDataToServer = data => {
        const newItem = prepareInitSpriteData()

        sendResponse(
            'add-item',
            Object.assign(newItem, { name: data.val }),
            res => {props.changeMainTab("items-list")}
        )
    } 

    return (
        <div>
            {!isClosed && <AppInput
                val=''
                type="name"
                buttonVal="create"
                callback={sendDataToServer}/>}

            <AppButton
                val={isClosed ? "create item" : 'cancel create item'}
                callBackClick={() => toggleClosed(!isClosed)}/>
        </div>
    )
}
