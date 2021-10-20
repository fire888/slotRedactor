import React, { useState, useEffect, useRef } from 'react'
import { AppButton } from "../components/AppButton"
import {
    showDragonSpr,
    playAnimation,
    removeSpr,
} from '../../appPixi/AppPixi'
import { prepareDragonFilesToSend } from '../helpers/prepareFilesToSend'
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

    const [imagesNames, setImagesNames] = useState([])

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
    const onLoadMultFiles = files => prepareDragonFilesToSend(props.currentItemId, files, getResourcesItem)
    const onLoadMultImages = files => {
        console.log(files)
        //prepareImagesToSend()
    }


    return (
    <div>
        {(props.authRole === 'user' || props.authRole === 'animator') && (
            <div>
                <div>
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
                </div>


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
                        <hr/>

                        <div>upload DragonBones files</div>
                        <AppLoadMultFiles
                            val='upload DragonBones files'
                            callback={onLoadMultFiles}
                        />

                    </div>
                }


                {/** IMAGES EDIT **************************************************/}

                {props.authRole === 'animator' &&
                <div>
                    {createArrFromObj(imagesNames).map((n, i) =>
                        <div
                            key={i}
                            className='content-stroke'>
                            <span>{n.name}</span>
                            <span>
                                <a className='AppButton' href={`/${n.path}/${n.name}`} download={n.name}>download</a>
                            </span>
                        </div>)}
                    <hr/>

                    <div>upload image static</div>
                    <AppLoadMultFiles
                        val='upload static image file'
                        callback={onLoadMultImages}
                    />
                    <div>upload image blure</div>
                    <AppLoadMultFiles
                        val='upload blur image file'
                        callback={onLoadMultImages}
                    />

                </div>
                }
            </div>)
        }
    </div>)
}

export default connect(mapStateToProps)(ItemViewAnimations)

