import React, { useState, useEffect, useRef } from 'react'
import { AppButton } from "../components/AppButton"
import {
    showDragonSpr,
    playAnimation,
    removeSpr,
} from '../../appPixi/AppPixi'
import { prepareDragonFilesToSend, sendFileData } from '../helpers/prepareFilesToSend'
import { AppLoadMultFiles } from "../components/AppLoadMultFiles";
import { sendResponse } from "../../toServerApi/requests";
import { connect } from 'react-redux'


const startAnimate = (animationName, count) => playAnimation({ animationName, count })


const createArrFromObj = obj => {
    const arr = []
    for (let key in obj) {
        arr.push({ ...obj[key] })
    }
    return arr
}


const mapStateToProps = state => ({
    authRole: state.app.authRole,
    currentItemId: state.app.currentItemId,
})



function ItemViewAnimations(props) {
    const [animations, setAnimations] = useState([])
    const [fileNames, setFileNames] = useState([])
    const [itemData, setItemData] = useState(null)


    const getResourcesItem = () => {
        sendResponse('get-item-data', { id: props.currentItemId }, res => {
            setItemData(res.item)
            setFileNames(res.item.files)
            showDragonSpr(res.item, animations => {
                setFileNames(res.item.files)
                setAnimations(null)
                setAnimations(animations)
            })
        })
    }

    useEffect(() => {
        if (itemData === null) {
            getResourcesItem()
        }
    })


    /** load files */
    const onLoadMultFiles = (inputKey, files) => prepareDragonFilesToSend(props.currentItemId, files, getResourcesItem)
    const onLoadStaticImage = (inputKey, files) => sendFileData(props.currentItemId, inputKey, files, getResourcesItem)



    return (
    <div>

        <div className='offset-top' />
        <hr />

        {(props.authRole === 'user' || props.authRole === 'animator') && (
            <div>

                <AppButton
                    val='dragonBones-view'
                    callBackClick={() => {console.log('dragonBones-view')}}/>

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



                {/** DREAGON_BONES EDIT ********************************************/}

                {props.authRole === 'animator' &&
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

                        <AppLoadMultFiles
                            val='upload DragonBones files'
                            inputKey='dragon-bones-files'
                            callback={onLoadMultFiles}
                        />

                    </div>
                }


                {/** IMAGES EDIT **************************************************/}


                <div className='offset-top' />
                <hr />


                {itemData && itemData['image-static'] && (
                    <div>
                        <AppButton
                            val='image-static'
                            callBackClick={() => {console.log('image-static')}}/>

                        {props.authRole === 'animator' &&
                            <div
                                className='content-stroke'>
                                {itemData['image-static'].name}
                                <a className='AppButton' href={`/${itemData['image-static'].path}/${itemData['image-static'].name}`} download={itemData['image-static'].name}>download</a>
                            </div>}

                    </div>)
                }


                {props.authRole === 'animator' &&
                    <AppLoadMultFiles
                        val='upload static image file'
                        inputKey='image-static'
                        callback={onLoadStaticImage}
                    />
                }



                <div className='offset-top' />
                <hr />

                {itemData && itemData['image-blur'] && (
                    <div>
                        <AppButton
                            val='image-blur'
                            callBackClick={() => {console.log('image-blur')}}/>


                        {props.authRole === 'animator' &&
                        <div
                            className='content-stroke'>
                            {itemData['image-blur'].name}
                            <a className='AppButton' href={`/${itemData['image-blur'].path}/${itemData['image-blur'].name}`} download={itemData['image-blur'].name}>download</a>
                        </div>}
                    </div>)
                }

                {props.authRole === 'animator' &&
                    <AppLoadMultFiles
                        val='upload blur image file'
                        inputKey='image-blur'
                        callback={onLoadStaticImage}
                    />
                }
            </div>)
        }
    </div>)
}

export default connect(mapStateToProps)(ItemViewAnimations)

