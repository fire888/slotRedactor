import React, { useState, useEffect } from 'react'
import { AppButton } from "../components/AppButton";
import { sendResponse } from "../../toServerApi/requests";
import { ItemView } from "./ItemView";
import { ItemViewCreate } from "./ItemViewCreate";


export function List(props) {
    const [loadedRes, showList] = useState(null)
    const [currentId, changeCurrentItem] = useState(null)
    const [isCreateFormItem, toggleCreateFormItem] = useState(null)

    const userRole = localStorage.getItem('userRole')

    const prepareList = data => {
        const arr = data.list.map(item =>
            <ItemView
                isOpened={currentId === item.id}
                key={item.id}
                item={item}
                callBackClick={id => {
                    changeCurrentItem(id)
                    showList(loadedRes)
                }}/>)
        showList(arr)
    }

    useEffect(() => {
        sendResponse('get-list', {}, prepareList)
    })


    return (
        <div>
            {loadedRes && loadedRes.length !== 0 && loadedRes}
            {userRole && userRole==='animator' && 
                (!isCreateFormItem 
                    ?   <AppButton
                            val="create item"
                            callBackClick = {() => { toggleCreateFormItem(true)}}/>
                    :   <ItemViewCreate changeMainTab={props.changeMainTab}/>)
            }
        </div>
    )
}


