import React, { useState, useEffect, useRef } from 'react'
import { AppButton } from "../components/AppButton"
import {
    canvasShow,
    // showDragonSpr,
    playAnimation,
    // showImage,
    // hideImage,
    // removeSpr,
} from '../../appPixi/AppPixi'
import { sendFilesToServer } from '../helpers/prepareFilesToSend'
import { AppLoadMultFiles } from "../components/AppLoadMultFiles";
import { sendResponse } from "../../toServerApi/requests";
import { connect } from 'react-redux'

import { HOST } from '../../globals'


const startAnimate = (animationName, count) => {
    console.log('!!!!!')
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



function ItemViewAnimations(props) {
    const [animations, setAnimations] = useState([])
    const [spineAnimations, setSpineAnimations] = useState([])
    const [fileNames, setFileNames] = useState([])
    const [itemData, setItemData] = useState(null)


    const getResourcesItem = () => {
        sendResponse('get-item-data', { id: props.currentItemId }, res => {
            console.log(res.item)
            setItemData(res.item)
            setFileNames(res.item.files)
            //showDragonSpr(res.item, animations => {
            //    setFileNames(res.item.files)
            //    setAnimations(null)
            //    setAnimations(animations)
            //})
        })
    }

    useEffect(() => {
        if (itemData === null) {
            getResourcesItem()
        }
    })


    /** send files */
    const onLoadMultFiles = (inputKey, files) => sendFilesToServer(inputKey, props.currentItemId, files, getResourcesItem)



    return (
    <div>

        <div className='offset-top offset-bottom' />
        <hr />

        {(props.authRole === 'user' || props.authRole === 'animator') && (
            <div>

                {/** DRAGON_BONES VIEW ********************************************/}

                {itemData && itemData['files'] && itemData['files']['dragon-ske'] &&
                    <AppButton
                        val='dragonBones-view'
                        callBackClick={() => canvasShow('dragonBones-view', props.currentItemId, itemData, animationsNames => {
                            setAnimations(animationsNames)
                        })}/>
                }

                {animations && animations.map((n, i) => n &&
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



                {props.authRole === 'animator' &&
                    <div>
                        <AppLoadMultFiles
                            val='upload DragonBones files'
                            inputKey='dragon-bones-files'
                            callback={onLoadMultFiles}
                        />

                    </div>
                }

                {/** SPINE VIEW ********************************************/}

                <div className='offset-top' />
                <hr />

                {spineAnimations && spineAnimations.map((n, i) => n &&
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

                {itemData && itemData['files'] && itemData['files']['spine-ske'] &&
                    <AppButton
                        val='spine-view'
                        callBackClick={() => canvasShow('spine-view', props.currentItemId, itemData, (animationsNames) => {
                            setSpineAnimations(animationsNames)
                        })}/>
                }


                {props.authRole === 'animator' &&
                    <div>

                        <AppLoadMultFiles
                            val='upload spine files'
                            inputKey='spines-files'
                            callback={onLoadMultFiles}
                        />

                    </div>
                }


                {/** IMAGE STATIC **************************************************/}


                <div className='offset-top' />
                <hr />


                {itemData && itemData['files'] && itemData['files']['image-static'] && (
                    <div>
                        <AppButton
                            val='image-static'
                            callBackClick={() => {canvasShow('image-static', props.currentItemId, itemData, () => {})}}/>
                    </div>)
                }


                {props.authRole === 'animator' &&
                    <AppLoadMultFiles
                        val='upload static image file'
                        inputKey='image-static'
                        callback={onLoadMultFiles}
                    />
                }


                {/** IMAGE BLUR **************************************************/}

                <div className='offset-top' />
                <hr />

                {itemData && itemData['files'] && itemData['files']['image-blur'] && (
                    <div>
                        <AppButton
                            val='image-blur-view'
                            callBackClick={() => {canvasShow('image-blur', props.currentItemId, itemData, () => {})}}/>

                    </div>)
                }

                {props.authRole === 'animator' &&
                    <AppLoadMultFiles
                        val='upload blur image file'
                        inputKey='image-blur'
                        callback={onLoadMultFiles}
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

export default connect(mapStateToProps)(ItemViewAnimations)

