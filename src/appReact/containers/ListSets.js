import React, { useState, useEffect } from 'react'
import { AppButton } from "../components/AppButton";
import { sendResponse } from "../../toServerApi/requests";



export function ListSets(props) {
    const [loadedRes, showList] = useState(null)
    const [openedId, changeOpenedId] = useState(null)

    const userRole = localStorage.getItem('userRole')

    const prepareList = data => {
        console.log(data.list)
        const arr = data.list.map(item => 
            <div>
                <AppButton
                    classNameCustom={'long'}
                    key={item.id}
                    val={item.name}
                    callBackClick = {() => { 
                        //props.callBackClick(props.type, item)
                        //console.log(item.id, openedId, item.id === openedId ? null : item.id)
                        changeOpenedId(item.id) 
                    }}/>
                {openedId}    
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


