import React, { useState, useEffect, useRef } from 'react'
import { AppButton } from "../components/AppButton"
import {
    showDragonSpr,
    playAnimation,
    removeSpr,
} from '../../appPixi/AppPixi'
import { getItemDataById, prepareDragonFilesToSend } from '../helpers/prepareFilesToSend'
import { AppLoadMultFiles } from "../components/AppLoadMultFiles";
import { AppInput } from "../components/AppInput";
import { AppDropDown } from "../components/AppDropDown";
import { sendResponse } from "../../toServerApi/requests";
import { AppButtonAlertDoneOrNot } from "../components/AppButtonAlertDoneOrNot";



const VIEW_MODES = {
    'none': 0,
    'preview': 1,
    'view': 2,
}



export function ItemPreView(props) {
    const [gameTag, changeGameTag] = useState(props.item.gameTag)
    const [name, changeName] = useState(props.item.name)
    const [typeView, changeTypeView] = useState(props.item.typeView)


    const changeMainParams = inputData => {
        console.log(inputData)
        const objToSend = {
            'id': props.item.id,
            'gameTag': inputData.type === 'gameTag' ? inputData.val : gameTag,
            'name': inputData.type === 'name' ? inputData.val : name,
            'typeView': inputData.type === 'typeView' ? inputData.val : typeView,
        }
        sendResponse('edit-item', objToSend, respData => {
            console.log('done', respData)
            changeGameTag(respData.newData.gameTag)
            changeName(respData.newData.name)
            changeTypeView(respData.newData.typeView)
        })
    }





    const [isLight, toggleLigth] = useState(false)

    const previewRef = useRef(props.item)
    const [viewMode, changeViewMode] = useState(VIEW_MODES['preview'])
    const currentUserRole = localStorage.getItem('userRole')

    const onWindowClickToClose = e => {
        if (previewRef && previewRef.current && !previewRef.current.contains(e.target)) {
            changeViewMode(VIEW_MODES['preview'])
            toggleLigth(false)
        }
    }


    useEffect(() => {
        window.addEventListener('click', onWindowClickToClose)
        return () => window.removeEventListener('click', onWindowClickToClose)
    }, [])

    console.log(viewMode)

    return (
        <div
            ref={previewRef}>

            <div className='content-stroke'>
                <AppButton
                    classNameCustom={`w-long ${isLight && 'current'}`}
                    val={name}
                    callBackClick = {() => changeViewMode(VIEW_MODES['view'])}
                />
                {currentUserRole === 'animator' &&
                <AppButtonAlertDoneOrNot
                    val='del'
                    classNameCustom='color-alert'
                    callBackClick = {() => {
                        sendResponse(
                            'remove-item',
                            { id: props.item.id },
                            res => {
                                    changeViewMode(VIEW_MODES['none'])
                                    removeSpr()
                            })
                    }}
                />
                }
            </div>

            {/** EDIT MAIN PARAMS *****************************************/}

            {viewMode > 1 && (
                <div className='content-tab'>
                    <div className="content-stroke">
                        <AppButton
                            val="close"
                            callBackClick={e => {
                                changeViewMode(VIEW_MODES['preview'])
                                e.stopPropagation()
                                e.preventDefault()
                            }}/>
                        <div>id: {props.item.id}</div>
                    </div>
                </div>
            )}

            {viewMode > 1 && (
                <div>
                    {currentUserRole === "animator" && (
                        <AppInput
                            val = {name}
                            type = "name"
                            buttonVal = 'save'
                            callback = {changeMainParams}
                        />
                    )}
                    {currentUserRole === "animator" && (
                        <AppDropDown
                            val = {gameTag}
                            type = "gameTag"
                            buttonVal = 'save'
                            arrOptions = {['spells', 'cleo', 'eagles', 'none']}
                            callback = {changeMainParams}
                        />
                    )}
                    {currentUserRole === "animator" && (
                        <AppDropDown
                            val = {typeView}
                            type = "typeView"
                            buttonVal = 'save'
                            arrOptions = {['slot-item', 'background', 'element', 'none']}
                            callback = {changeMainParams}
                        />
                    )}
                    gameTag: {gameTag}, typeView: {typeView}
                </div>
            )}
        </div>)
}


