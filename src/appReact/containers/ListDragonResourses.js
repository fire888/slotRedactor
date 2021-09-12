import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { sendResponse } from "../../toServerApi/requests";


export function ListDragonResources(props) {
    const [loadedRes, showList] = useState([])

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


    setTimeout(() => loadedRes.length === 0 && sendResponse('get-list', {}, prepareList))


    return (
        <div>
            {loadedRes.length !== 0 && loadedRes}
            <AppButton
                val = "add item"
                callBackClick = {() => {
                    props.changeMainTab('add-item')}
                }/>
        </div>
    )
}


