import React, { useState } from 'react'
import { sendResponse } from '../../toServerApi/requests'
import { ItemView } from './ItemView'
import { ItemViewCreate } from './ItemViewCreate'




export function List(props) {
    const [key, changeKey] = useState(null)
    const [list, updateList] = useState(null)
    const [currentId, setIdToCurrent] = useState(null)


    const userRole = localStorage.getItem('userRole')


    const prepareList = data => {
        const arr = !data.list
            ? []
            : data.list.map(item =>
                <ItemView
                    isOpened = {currentId === item.id}
                    key = {item.id}
                    item = {item}
                    callBackClick = {id => {
                        setIdToCurrent(id)
                        updateList(list)
                    }}/>)

        changeKey(props.key)
        updateList(arr)
    }


    props.key !== key &&
        sendResponse(props.request, props.requestParams, prepareList, prepareList)


    return (
        <div>
            {list}
            {userRole === 'animator' && <ItemViewCreate changeMainTab = {props.changeMainTab}/>}
        </div>
    )
}

