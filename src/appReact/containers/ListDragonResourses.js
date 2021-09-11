import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import {sendResponse} from "../../toServerApi/requests";


export function ListDragonResources() {
    const [loadedRes, showList] = useState([])


    const prepareList = data => {
        const arr = data.list.map(item =>
            <div key={item.id}>
                <span>name: {item.name}</span>
                <AppButton
                    val={"delete"}
                    callBackClick = {() => sendResponse('remove-item', { id: item.id }, prepareList)}/>
            </div>)
        showList(arr)
    }

    setTimeout(() => loadedRes.length === 0 && sendResponse('get-list', {}, prepareList))

    return (
        <div>{loadedRes.length !== 0 && loadedRes}</div>
    );
}


