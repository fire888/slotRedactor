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
    'edit': 3,
}



export function ItemPreView(props) {
    const [isLight, toggleLigth] = useState(false)
    const viewElem = useRef(props.item)
    const [viewMode, changeViewMode] = useState(VIEW_MODES['preview'])

    const currentUserRole = localStorage.getItem('userRole')
    const [itemData, setItemData] = useState(null)


    useEffect(() => {
        const onWindowClick = e => {
            if (viewElem && viewElem.current && !viewElem.current.contains(e.target)) {
                changeViewMode(VIEW_MODES['preview'])
                toggleLigth(false)
            }
        }
        window.addEventListener('click', onWindowClick)

        return () => {
            window.removeEventListener('click', onWindowClick)
        }
    }, [])


    return (
        <div
            ref={viewElem}>


            {/** PREVIEW ********************************************/}

            {viewMode > 0 &&
            <div className='content-stroke'>
                <AppButton
                    classNameCustom={`w-long ${isLight && 'current'}`}
                    val={props.item.name}
                    callBackClick = {() => {}}
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
            }
        </div>)
}


