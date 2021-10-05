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




export function ItemViewCreate(props) {

    const sendDataToServer = (data) => {
        const newItem = prepareInitSpriteData()
        sendResponse('add-item', Object.assign(newItem, { name: data.val }), res=>{
            console.log(res)
            props.changeMainTab("items-list")
        })
    } 

    return (
        <div>
            <AppInput
                val=''
                type="name"
                buttonVal="create"
                callback={sendDataToServer} />
        </div>
    )
}


