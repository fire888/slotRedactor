import React, { useState, useEffect, useRef } from 'react'
import { AppButton } from "../components/AppButton";
import {
    showDragonSpr,
    playAnimation,
    removeSpr,
} from '../../appPixi/AppPixi'
import {getItemDataById, prepareDragonFilesToSend} from '../helpers/prepareFilesToSend'
import {AppLoadMultFiles} from "../components/AppLoadMultFiles";
import {AppInput} from "../components/AppInput";
import {sendResponse} from "../../toServerApi/requests";
import {AppButtonAlertDoneOrNot} from "../components/AppButtonAlertDoneOrNot";


const startAnimate = (animationName, count) => playAnimation({ animationName, count })


const createArrFromObj = obj => {
    const arr = []
    for (let key in obj) {
        arr.push({ ...obj[key] })
    }
    return arr
}



const VIEW_MODES = {
    'none': 0,
    'preview': 1,
    'view': 2,
    'edit': 3,
}




export function ItemView(props) {
    const [isLight, toggleLigth] = useState(false)
    const viewElem = useRef(null)
    const [viewMode, changeViewMode] = useState(VIEW_MODES['none'])


    const [currentUserRole, setUserRole] = useState(null)

    const [name, setName] = useState(null)
    const [animations, setAnimations] = useState([])
    const [fileNames, setFileNames] = useState([])
    const [itemData, setItemData] = useState(null)


    useEffect(() => {
        const onWindowClick = e => {
            if (viewElem && viewElem.current && !viewElem.current.contains(e.target)) {
                changeViewMode(VIEW_MODES['preview'])
                toggleLigth(false)
            }
        }
        window.addEventListener('click', onWindowClick)

        getItemDataById(props.item.id, res => {
            const userRole = localStorage.getItem('userRole')
            setUserRole(userRole)
            setName(props.item.name)
            setItemData(res.item)
            changeViewMode(VIEW_MODES['preview'])
        })

        return () => {
            window.removeEventListener('click', onWindowClick)
        }
    }, [])


    const getResourcesItem = () => {
        getItemDataById(props.item.id, res => {
            setFileNames(res.item.files)
            setItemData(res.item)
            toggleLigth(true)
            changeViewByRole()
            showDragonSpr(res.item, animations => {
                setFileNames(res.item.files)
                setAnimations(animations)
                changeViewByRole()
            })
        })
    }

    /** EDIT ***********************************/

    const changeViewByRole = () => {
        if (currentUserRole === 'animator') {
            changeViewMode(VIEW_MODES['edit'])
            setUserRole('animator')
        } else {
            changeViewMode(VIEW_MODES['view'])
            //setUserRole(null)
        }
        toggleLigth(true)
    }


    /** change name */
    const changeNameFromInput = data => {
        setName(data.val)
        sendResponse('edit-item', Object.assign(itemData, { 'name': data.val }), changeViewByRole)
    }

    /** load files */
    const onLoadMultFiles = files => prepareDragonFilesToSend(itemData.id, files, getResourcesItem)


    return (
    <div
        ref={viewElem}>


        {/** PREVIEW ********************************************/}

        {viewMode > 0 &&
            <div className='content-stroke'>
                <AppButton
                    classNameCustom={`w-long ${isLight && 'current'}`}
                    val={name}
                    callBackClick = {getResourcesItem}
                />
                {currentUserRole === 'animator' &&
                    <AppButtonAlertDoneOrNot
                        val='del'
                        classNameCustom='color-alert'
                        callBackClick = {() => {
                            sendResponse(
                                'remove-item',
                                { id: itemData.id },
                                res => {
                                    if (res.mess[0] === 'removed') {
                                        changeViewMode(VIEW_MODES['none'])
                                        removeSpr()
                                    } else {
                                        console.log('delete mistake')
                                    }
                                })
                        }}
                    />
                }
            </div>
        }


        {/** VIEW ********************************************/}

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
                <hr/>
                <div>
                    {animations.map((n, i) => n &&
                        <div
                            className="content-stroke"
                            key={i}>
                            <span>{n}</span>
                            <div className="contrnt-right">
                                <AppButton
                                    val='once'
                                    callBackClick={() => startAnimate(n, 1)}/>
                                <AppButton
                                    val='repeat'
                                    callBackClick={() => startAnimate(n, 1000)}/>
                                <AppButton
                                    val='stop'
                                    callBackClick={() => startAnimate(n, false)}/>

                            </div>
                        </div>
                    )}
                </div>


                {/** EDIT ********************************************/}

                {viewMode > 2 &&
                    <div>
                        {createArrFromObj(fileNames).map((n, i) =>
                            <div
                                key={i}
                                className='content-stroke'>
                                <span>{n.name}</span>
                                <span>
                                    <a className='AppButton' href={`/${n.path}/${n.name}`} download={n.name}>download</a>
                                </span>
                            </div>)}
                        <hr/>
                        <AppInput
                            val={itemData.name}
                            type="name:"
                            buttonVal='save'
                            callback={changeNameFromInput}
                        />

                        <AppLoadMultFiles callback={onLoadMultFiles}/>

                        {/*<div>*/}
                        {/*    <AppButtonAlertDoneOrNot*/}
                        {/*        val='delete'*/}
                        {/*        classNameCustom='color-alert'*/}
                        {/*        callBackClick = {() => {*/}
                        {/*            sendResponse(*/}
                        {/*                'remove-item',*/}
                        {/*                { id: itemData.id },*/}
                        {/*                res => {*/}
                        {/*                    if (res.mess[0] === 'removed') {*/}
                        {/*                        changeViewMode(VIEW_MODES['none'])*/}
                        {/*                        removeSpr()*/}
                        {/*                    } else {*/}
                        {/*                        console.log('delete mistake')*/}
                        {/*                    }*/}
                        {/*                })*/}
                        {/*        }}*/}
                        {/*    />*/}
                        {/*</div>*/}
                    </div>
                }
            </div>)
        }
    </div>)
}


