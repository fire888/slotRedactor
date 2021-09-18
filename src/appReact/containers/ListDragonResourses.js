import React, { useState, useEffect } from 'react'
import { AppButton } from "../components/AppButton";
import { sendResponse } from "../../toServerApi/requests";



export function ListDragonResources(props) {
    const [loadedRes, showList] = useState(null)

    const prepareList = data => {
        console.log(data.list)
        const arr = data.list.map(item =>
            <AppButton
                classNameCustom={'long'}
                key={item.id}    
                val={item.name}
                callBackClick = {() => props.callBackClick(item)} 
            />)
            
        showList(arr)
    }

    useEffect(() => {
        !loadedRes && sendResponse('get-list', {}, prepareList)
    })
    //setTimeout(() => loadedRes.length === 0 && sendResponse('get-list', {}, prepareList))


    return (
        <div>
            {loadedRes && loadedRes.length !== 0 && loadedRes}
            <AppButton
                val="add item"
                callBackClick = {() => {
                    props.changeMainTab('add-item')}
                }/>
        </div>
    )
}


