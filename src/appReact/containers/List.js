import React, { useState } from 'react'
import { sendResponse } from '../../toServerApi/requests'
//import { ItemView } from './ItemView'
import { ItemPreView } from './ItemPreView'
import { ItemViewCreate } from './ItemViewCreate'




export function List(props) {
    console.log(props)
    const [key, changeKey] = useState(null)
    const [list, updateList] = useState(null)
    const [currentId, setIdToCurrent] = useState(null)


    const userRole = localStorage.getItem('userRole')


    const prepareList = data => {
        if (!data.list) {
            updateList([])
            return;
        }

        const arrItems = data.list.filter(item => {
            if (props.tabName === 'all') {
                return true;
            }
            return item.gameTag === props.tabName;
        })

        console.log(arrItems)


        const arrElems = arrItems.map(item =>
                <ItemPreView
                    isOpened = {currentId === item.id}
                    key = {item.id}
                    item = {item}
                    callBackClick = {id => {
                        setIdToCurrent(id)
                        updateList(list)
                    }}/>)

        changeKey(props.key)
        updateList(arrElems)
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

