import React, { useState, useEffect } from 'react'
import { AppButton } from "../components/AppButton";
import { sendResponse } from "../../toServerApi/requests";



export function ListSets(props) {
    const [loadedRes, showList] = useState(null)

    const userRole = localStorage.getItem('userRole')

    const prepareList = data => {
        console.log(data.list)
        const arr = data.list.map(item =>
            <AppButton
                classNameCustom={'long'}
                key={item.id}
                val={item.name}
                callBackClick = {() => props.callBackClick(props.type, item)}
            />)

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


