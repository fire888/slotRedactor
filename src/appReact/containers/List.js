import React, { useState, useEffect } from 'react'
import { AppButton } from "../components/AppButton";
import { sendResponse } from "../../toServerApi/requests";
import { ViewItem } from "./ViewItem";


export function List(props) {
    const [loadedRes, showList] = useState(null)
    const [currentId, changeCurrentItem] = useState(null)

    const userRole = localStorage.getItem('userRole')




    const prepareList = data => {
        const arr = data.list.map(item =>
            <ViewItem
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
        !loadedRes && sendResponse('get-list', {}, prepareList)
    })


    return (
        <div>
            {loadedRes && loadedRes.length !== 0 && loadedRes}
            {userRole && userRole==='animator'&&
            <AppButton
                val="add item"
                callBackClick = {() => {
                    props.changeMainTab('add-item')}}/>}
        </div>
    )
}


