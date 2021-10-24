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


const mapStateToProps = state => ({
    authRole: state.app.authRole,
    currentItemId: state.app.currentItemId,
})


//** TODO VERY BAD **************/
let itemDataGlobal = null


function ItemViewResources(props) {
    const [animations, setAnimations] = useState([])
    const [spineAnimations, setSpineAnimations] = useState([])
    const [fileNames, setFileNames] = useState([])
    const [itemData, setItemData] = useState({})
    const [currentFilesView, changeCurrentFilesView] = useState(null)
    const [currentAnimationPlay, changeCurrentAnimationPlay] = useState(null)


    const getResourcesItem = (inputKey) => {
        sendResponse('get-item-data', { id: props.currentItemId }, res => {
            setItemData((prev) => ({...res.item}))
            itemDataGlobal = res.item
            setFileNames(res.item.files)
            createItemViewByResources(inputKey, props.currentItemId, res.item, animatinsNames => {
                if (inputKey === 'spines-files') {
                    setSpineAnimations(animatinsNames)
                }
                if (inputKey === 'dragon-bone-files') {
                    setAnimations(animatinsNames)
                }

                changeCurrentFilesView(inputKey)
            })
        })
    }

    useEffect(() => {
        if (!itemData.files) {
            getResourcesItem()
        }
    })


    /** send files */
    const onLoadMultFiles = (inputKey, itemData, files) => {
        sendFilesToServer(inputKey, props.currentItemId, itemDataGlobal, files, () => getResourcesItem(inputKey))
    }



    return (
    <div>

        <div className='offset-top offset-bottom' />
        <hr />

        {(props.authRole === 'user' || props.authRole === 'animator') && (
            <div>

                {/** DRAGON_BONES VIEW ********************************************/}

                {itemData && itemData['files'] && itemData['files']['dragon-ske'] &&
                    <AppButton
                        val='dragon bones view'
                        classNameCustom={currentFilesView === 'dragon-bones-files' && 'current'}
                        callBackClick={() => createItemViewByResources('dragon-bones-files', props.currentItemId, itemData, animationsNames => {
                            changeCurrentFilesView('dragon-bones-files')
                            setAnimations(animationsNames)
                        })}/>
                }

                {currentFilesView === 'dragon-bones-files' && animations && animations.map((n, i) => n &&
                    <div
                        className="content-stroke"
                        key={i}>
                        <span>{n}</span>
                        <div className="contrnt-right">
                            <AppButton
                                val='once'
                                classNameCustom={currentAnimationPlay === n + '_once' && 'current'}
                                callBackClick={() => {
                                    startAnimate(n, 1)
                                    changeCurrentAnimationPlay(n + '_once')
                                }}/>
                            <AppButton
                                val='repeat'
                                classNameCustom={currentAnimationPlay === n + '_repeat' && 'current'}
                                callBackClick={() => {
                                    changeCurrentAnimationPlay(n + '_repeat')
                                    startAnimate(n, 1000)
                                }}/>
                            <AppButton
                                val='stop'
                                classNameCustom={currentAnimationPlay === n + '_stop' && 'current'}
                                callBackClick={() => {
                                    changeCurrentAnimationPlay(n + '_stop')
                                    startAnimate(n, false)
                                }}/>

                        </div>
                    </div>
                )}



                {props.authRole === 'animator' &&
                    <div>
                        <AppLoadMultFiles
                            val='upload DragonBones files'
                            inputKey='dragon-bones-files'
                            callback={(inputKey, files) => {
                                onLoadMultFiles(inputKey, itemData, files)
                            }}
                        />

                    </div>
                }

                {/** SPINE VIEW ********************************************/}

                <div className='offset-top' />
                <hr />

                {itemData && itemData['files'] && itemData['files']['spine-ske'] &&
                <AppButton
                    val='spine view'
                    classNameCustom={currentFilesView === 'spines-files' && 'current'}
                    callBackClick={() => createItemViewByResources('spines-files', props.currentItemId, itemData, (animationsNames) => {
                        changeCurrentFilesView('spines-files')
                        setSpineAnimations(animationsNames)
                    })}/>
                }

                {currentFilesView === 'spines-files' && spineAnimations && spineAnimations.map((n, i) => n &&
                    <div
                        className="content-stroke"
                        key={i}>
                        <span>{n}</span>
                        <div className="contrnt-right">
                            <AppButton
                                val='once'
                                classNameCustom={currentAnimationPlay === n + '_once' && 'current'}
                                callBackClick={() => {
                                    changeCurrentAnimationPlay(n + '_once')
                                    startAnimate(n, 1)
                                }}/>
                            <AppButton
                                val='repeat'
                                classNameCustom={currentAnimationPlay === n + '_repeat' && 'current'}
                                callBackClick={() => {
                                    changeCurrentAnimationPlay(n + '_repeat')
                                    startAnimate(n, 1000)
                                }}/>
                            <AppButton
                                val='stop'
                                classNameCustom={currentAnimationPlay === n + '_stop' && 'current'}
                                callBackClick={() => {
                                    changeCurrentAnimationPlay(n + '_stop')
                                    startAnimate(n, false)
                                }}/>

                        </div>
                    </div>
                )}

                {props.authRole === 'animator' &&
                    <div>

                        <AppLoadMultFiles
                            val='upload spine files'
                            inputKey='spines-files'
                            callback={(inputKey, files) => onLoadMultFiles(inputKey, itemData, files)}
                        />

                    </div>
                }


                {/** IMAGE STATIC **************************************************/}


                <div className='offset-top' />
                <hr />


                {itemData && itemData['files'] && itemData['files']['image-static'] && (
                    <div>
                        <AppButton
                            val='image static view'
                            classNameCustom={currentFilesView === 'image-static' && 'current'}
                            callBackClick={() => {
                                createItemViewByResources('image-static', props.currentItemId, itemData, () => {})
                                changeCurrentFilesView('image-static')
                            }}/>
                    </div>)
                }


                {props.authRole === 'animator' &&
                    <AppLoadMultFiles
                        val='upload static image file(.png)'
                        inputKey='image-static'
                        callback={(inputKey, files) => onLoadMultFiles(inputKey, itemData, files)}
                    />
                }


                {/** IMAGE BLUR **************************************************/}

                <div className='offset-top' />
                <hr />

                {itemData && itemData['files'] && itemData['files']['image-blur'] && (
                    <div>
                        <AppButton
                            val='image blur view'
                            classNameCustom={currentFilesView === 'image-blur' && 'current'}
                            callBackClick={() => {
                                createItemViewByResources('image-blur', props.currentItemId, itemData, () => {})
                                changeCurrentFilesView('image-blur')
                            }}/>

                    </div>)
                }

                {props.authRole === 'animator' &&
                    <AppLoadMultFiles
                        val='upload blur image file(.png)'
                        inputKey='image-blur'
                        callback={(inputKey, files) => onLoadMultFiles(inputKey, itemData, files)}
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

