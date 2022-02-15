import React, { useState, useEffect } from 'react'
import { AppButton } from './AppButton'
import { AppInput } from "./AppInput";


export function WordsList (props) {
    const [isOpened, toggleOpened] = useState(false)
    const [isShowInputAdd, toggleShowInputAdd] = useState(false)
    const [currentList, changeCurrentList] = useState(props.list)


    return  (
        <div>

            <div className='offset-top' />
            <hr />


            {<AppButton
                val={props.title}
                classNameCustom={isOpened && 'current'}
                callBackClick={() => {
                    toggleOpened(!isOpened)
                }}
            />}


            {!compareOldNewKeys(props.list, currentList) &&
                <AppButton
                    val={'save changes'}
                    callBackClick={() => {
                        props.callBackClick(currentList)
                    }}
                />}


            {isOpened &&
                <div>
                    {currentList.map((n, i) =>
                        <div
                            className='content-stroke'
                            key={'word_' + i}>
                            <b>{n.key}</b>
                            <AppButton
                                val='remove'
                                callBackClick={() => {
                                    changeCurrentList(currentList.filter(item => {
                                        return item.key !== n.key
                                    }))
                                }}
                            />
                        </div>)}

                    <div className='offset-top' />

                    {isShowInputAdd &&
                        <AppInput
                            val=''
                            buttonVal='add'
                            type='add word:'
                            callback={data => {
                                if (isValueInList(data.val, currentList)) {
                                    return;
                                }

                                toggleShowInputAdd(false)
                                changeCurrentList([...currentList, { key: data.val }])
                            }}
                        />}

                    <AppButton
                        val={!isShowInputAdd ? "add" : 'cancel create item'}
                        callBackClick={() => toggleShowInputAdd(!isShowInputAdd)} />
                </div>}


        </div>)
}



const createArrFromObj = obj => {
    const arr = []
    for (let key in obj) {
        arr.push({ key: key, val: obj[key] })
    }
    return arr
}



const compareOldNewKeys = (oldList, newList) => {
    const arrKeysOld = oldList.length && oldList.map(item => item.key) || null
    const arrKeysNew = newList.length && newList.map(item => item.key) || null

    return JSON.stringify(arrKeysOld) === JSON.stringify(arrKeysNew)
}
const isValueInList = (val, list) => list.filter(item => item.key === val).length > 0
