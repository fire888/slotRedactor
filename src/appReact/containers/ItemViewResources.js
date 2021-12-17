import React, { useState, useEffect, useRef } from 'react'
import { AppButton } from "../components/AppButton"
import {
    createItemViewByResources,
    playAnimation,
} from '../../appPixi/AppPixi'
import { sendFilesToServer } from '../helpers/prepareFilesToSend'
import { AppLoadMultFiles } from "../components/AppLoadMultFiles";
import { sendResponse } from "../../toServerApi/requests";
import { connect } from 'react-redux'

import { HOST } from '../../globals'




const startAnimate = (animationName, count) => {
    playAnimation({animationName, count})
}


const createArrFromObj = obj => {
    const arr = []
    for (let key in obj) {
        arr.push({ key: key, ...obj[key] })
    }
    return arr
}


const mapStateToProps = state => {
    let item = null
    if (state.app.currentList) {
        item = state.app.currentList.filter(item => item.id === state.app.currentItemId)
    }
    return ({
        authRole: state.app.authRole,
        currentItemId: state.app.currentItemId,
        item: (item && item[0]) || null
    })
}


/** TODO VERY BAD ******************************/
/** TODO VERY BAD ******************************/
/** TODO VERY BAD ******************************/
/** TODO VERY BAD ******************************/
/** TODO VERY BAD ******************************/
let itemDataGlobal = null


function ItemViewResources(props) {
    const [animations, setAnimations] = useState([])
    const [dragonArmature, setDragonArmature] = useState(null)
    const [spineAnimations, setSpineAnimations] = useState([])
    const [fileNames, setFileNames] = useState([])
    const [itemData, setItemData] = useState({})
    const [currentFilesView, changeCurrentFilesView] = useState(null)
    const [currentAnimationPlay, changeCurrentAnimationPlay] = useState(null)

    const getResourcesItem = (inputKey) => {
        props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: true }))
        sendResponse('get-item-data', { id: props.currentItemId }, res => {
            props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: false }))

            setItemData((prev) => ({...res.item}))
            itemDataGlobal = res.item
            setFileNames(res.item.files)

            createItemViewByResources(inputKey, props.currentItemId, res.item, animatinsData => {
                if (inputKey === 'spines-files') {
                    setSpineAnimations(animatinsNames)
                }
                if (inputKey === 'dragon-bone-files') {
                    setAnimations(animatinsData)
                }

                changeCurrentFilesView(inputKey)
            })
        })
    }

    useEffect(() => {
        getResourcesItem()
        return () => {
            setAnimations([])
            setSpineAnimations([])
            setFileNames([])
            setItemData({})
            changeCurrentFilesView(null)
            changeCurrentAnimationPlay(null)
        }
    }, [props.currentItemId])


    /** send files */
    const onLoadMultFiles = (inputKey, itemData, files) => {
        sendFilesToServer(inputKey, props.currentItemId, itemDataGlobal, files, () => getResourcesItem(inputKey))
    }


    if (!props.item || (props.currentItemId !== props.item.id)) {
        return (<div></div>)
    }


    return (
    <div>

        <div className='offset-top offset-bottom' />
        <hr />

        {(props.authRole === 'user' || props.authRole === 'animator') && (
            <div>

                {/** DRAGON_BONES VIEW ********************************************/}

                <div className="content-stroke">
                    {itemDataGlobal && itemDataGlobal['files'] && itemDataGlobal['files']['dragon-ske'] &&
                        <AppButton
                            val='dragon bones view'
                            classNameCustom={currentFilesView === 'dragon-bones-files' && 'current'}
                            callBackClick={() => {
                                props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: true }))
                                createItemViewByResources('dragon-bones-files', props.currentItemId, itemDataGlobal, (animationsNames, armatureName) => {
                                    changeCurrentFilesView('dragon-bones-files')
                                    setAnimations(animationsNames)
                                    setDragonArmature(armatureName)
                                    props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: false }))
                            })}}/>
                    }

                    {currentFilesView === 'dragon-bones-files' && dragonArmature && <span>armature: <b>{dragonArmature}</b></span>}
                </div>

                {currentFilesView === 'dragon-bones-files' && animations && animations.map((n, i) => n &&
                    <div
                        className="content-stroke"
                        key={i}>
                        <span>{n.name}</span>
                        <div className="contrnt-right">
                            <span className="m-r-5">{n.duration.toFixed(2)} s</span>
                            <AppButton
                                val='once'
                                classNameCustom={currentAnimationPlay === n.name + '_once' && 'current'}
                                callBackClick={() => {
                                    startAnimate(n.name, 1)
                                    changeCurrentAnimationPlay(n.name + '_once')
                                }}/>
                            <AppButton
                                val='repeat'
                                classNameCustom={currentAnimationPlay === n.name + '_repeat' && 'current'}
                                callBackClick={() => {
                                    changeCurrentAnimationPlay(n.name + '_repeat')
                                    startAnimate(n.name, 1000)
                                }}/>
                            <AppButton
                                val='stop'
                                classNameCustom={currentAnimationPlay === n.name + '_stop' && 'current'}
                                callBackClick={() => {
                                    changeCurrentAnimationPlay(n.name + '_stop')
                                    startAnimate(n.name, false)
                                }}/>
                        </div>
                    </div>
                )}



                {props.authRole === 'animator' && animations &&
                    <div>
                        <AppLoadMultFiles
                            val='upload DragonBones files'
                            inputKey='dragon-bones-files'
                            callback={(inputKey, files) => {
                                onLoadMultFiles(inputKey, itemDataGlobal, files)
                            }}
                        />

                    </div>
                }

                {/** SPINE VIEW ********************************************/}

                <div className='offset-top' />
                <hr />

                {itemDataGlobal && itemDataGlobal['files'] && itemDataGlobal['files']['spine-ske'] &&
                <AppButton
                    val='spine view'
                    classNameCustom={currentFilesView === 'spines-files' && 'current'}
                    callBackClick={() => {
                        props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: true }))
                        createItemViewByResources('spines-files', props.currentItemId, itemDataGlobal, (animationsNames) => {
                            changeCurrentFilesView('spines-files')
                            setSpineAnimations(animationsNames)
                            props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: false }))
                    })}}/>
                }

                {currentFilesView === 'spines-files' && spineAnimations && spineAnimations.map((n, i) => n &&
                    <div
                        className="content-stroke"
                        key={i}>
                        <span>{n.name}</span>
                        <div className="contrnt-right">
                            <span className="m-r-5">{n.duration.toFixed(2)} s</span>
                            <AppButton
                                val='once'
                                classNameCustom={currentAnimationPlay === n.name + '_once' && 'current'}
                                callBackClick={() => {
                                    changeCurrentAnimationPlay(n.name + '_once')
                                    startAnimate(n.name, 1)
                                }}/>
                            <AppButton
                                val='repeat'
                                classNameCustom={currentAnimationPlay === n.name + '_repeat' && 'current'}
                                callBackClick={() => {
                                    changeCurrentAnimationPlay(n.name + '_repeat')
                                    startAnimate(n.name, 1000)
                                }}/>
                            <AppButton
                                val='stop'
                                classNameCustom={currentAnimationPlay === n.name + '_stop' && 'current'}
                                callBackClick={() => {
                                    changeCurrentAnimationPlay(n.name + '_stop')
                                    startAnimate(n.name, false)
                                }}/>

                        </div>
                    </div>
                )}

                {props.authRole === 'animator' &&
                    <div>

                        <AppLoadMultFiles
                            val='upload spine files'
                            inputKey='spines-files'
                            callback={(inputKey, files) => onLoadMultFiles(inputKey, itemDataGlobal, files)}
                        />

                    </div>
                }


                {/** IMAGE STATIC **************************************************/}


                <div className='offset-top' />
                <hr />


                {itemDataGlobal && itemDataGlobal['files'] && itemDataGlobal['files']['image-static'] && (
                    <div>
                        <AppButton
                            val='image static view'
                            classNameCustom={currentFilesView === 'image-static' && 'current'}
                            callBackClick={() => {
                                props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: true }))
                                createItemViewByResources('image-static', props.currentItemId, itemDataGlobal, () => {
                                    props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: false }))
                                })
                                changeCurrentFilesView('image-static')
                            }}/>
                    </div>)
                }


                {props.authRole === 'animator' &&
                    <AppLoadMultFiles
                        val='upload static image file(.png)'
                        inputKey='image-static'
                        callback={(inputKey, files) => onLoadMultFiles(inputKey, itemDataGlobal, files)}
                    />
                }


                {/** IMAGE BLUR **************************************************/}

                <div className='offset-top' />
                <hr />

                {itemDataGlobal && itemDataGlobal['files'] && itemDataGlobal['files']['image-blur'] && (
                    <div>
                        <AppButton
                            val='image blur view'
                            classNameCustom={currentFilesView === 'image-blur' && 'current'}
                            callBackClick={() => {
                                props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: true }))
                                createItemViewByResources('image-blur', props.currentItemId, itemDataGlobal, () => {
                                    props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: false }))
                                })
                                changeCurrentFilesView('image-blur')
                            }}/>

                    </div>)
                }

                {props.authRole === 'animator' &&
                    <AppLoadMultFiles
                        val='upload blur image file(.png)'
                        inputKey='image-blur'
                        callback={(inputKey, files) => onLoadMultFiles(inputKey, itemDataGlobal, files)}
                    />
                }


                {/** DOWNLOAD FILES *****************************/}

                {props.authRole === 'animator' && (
                    <div>

                        <div className='offset-top' />
                        <hr />

                        all files:
                        {createArrFromObj(fileNames).map((n, i) =>
                            <div
                                key={i}
                                className='content-stroke'>
                                <span>{n.key}:</span>
                                <span>{n.name}</span>
                                <span>
                                    <a
                                        className='AppButton'
                                        target="_blank"
                                        href={`${HOST}/${n.path}/${n.name}`}
                                        rel="noopener noreferrer"
                                        download>
                                        download
                                    </a>
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>)
        }
    </div>)
}

export default connect(mapStateToProps)(ItemViewResources)

