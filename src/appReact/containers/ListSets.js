import React, { useState, useEffect } from 'react'
import { AppButton } from "../components/AppButton";
import { sendResponse } from "../../toServerApi/requests";
import { ViewItem } from "./ViewItem"
import { getItemDataById } from "../helpers/prepareFilesToSend"



export function ListSets(props) {
    const [loadedRes, showList] = useState(null)
    const [currentButton, changeCurrentButton] = useState(null)
    const [currentDataItem, changeCurrentDataItem] = useState(null)

    const openSet = (buttonId, currentItemId) => {
        if (currentButton === buttonId) {
            changeCurrentButton(null)
            return void showList(loadedRes)
        }
        changeCurrentButton(buttonId)
        getItemDataById(currentItemId, res => {
            changeCurrentDataItem(res.item)
            showList(loadedRes)
        })

    }

    const userRole = localStorage.getItem('userRole')

    const prepareList = data => {
        console.log(data.list)
        const arr = data.list.map(item =>
            <div>
                <AppButton
                    classNameCustom={`long ${currentButton === item.id && 'current'}`}
                    key={item.id}
                    val={item.name}
                    callBackClick = {
                        () => openSet(item.id, item.currentItem)
                    }
                />
                {
                    currentDataItem &&
                    currentDataItem.id === item.currentItem &&
                    currentButton === item.id &&
                    <div className='w-250'>
                        <ViewItem
                            currentDataItem={currentDataItem}/>
                        other versions:
                    </div>}
            </div>)

        showList(arr)
    }

    useEffect(() => {
        !loadedRes && sendResponse('get-sets-list', {}, prepareList)
    })


    return (
        <div>
            {loadedRes && loadedRes.length !== 0 && loadedRes}
            {userRole && userRole==='animator' &&
            <AppButton
                val="add item"
                callBackClick = {() => {
                    props.changeMainTab('add-set')}}/>}
        </div>
    )
}


