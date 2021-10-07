import React, { useState } from 'react'
import { sendResponse } from '../../toServerApi/requests'
import { ItemView } from './ItemView'
import { ItemViewCreate } from './ItemViewCreate'




export function List(props) {
    const [key, changeKey] = useState(null)
    const [list, updateList] = useState(null)
    const [currentId, setIdToCurrent] = useState(null)


    const userRole = localStorage.getItem('userRole')


<<<<<<< HEAD
    console.log( props.reguest,  props.requestParams )

    const prepareList = data => {
        console.log(data)
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
        console.log( props.reguest,  props.requestParams )
        sendResponse(props.request, props.requestParams, prepareList)
    })
=======
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
>>>>>>> 1cbf2c032af0d1d5f55b66b2cba027174a6f3e65


    return (
        <div>
            {list}
            {userRole === 'animator' && <ItemViewCreate changeMainTab = {props.changeMainTab}/>}
        </div>
    )
}

