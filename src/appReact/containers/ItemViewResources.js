import React, { useState, useEffect, useRef } from 'react'
import { AppButton } from "../components/AppButton"
import * as AppPixi from '../../appPixi/AppPixi'
import { sendFilesToServer } from '../helpers/prepareFilesToSend'
import { AppLoadMultFiles } from "../components/AppLoadMultFiles";
import { sendResponse } from "../../toServerApi/requests";
import { connect } from 'react-redux'
import { FilesList } from '../components/FilesList'
import { AppDropDown } from "../components/AppDropDown";



let id = null


const startAnimate = (animationName, count) => AppPixi.playAnimation({animationName, count})


const getMode = (arr, name) => {
    for (let i = 0; i < arr.length; ++i) {
        if (arr[i].animationName && arr[i].animationName === name) {
            return arr[i].key
        }
    }
    return 'none'
}


const mapStateToProps = state => {
    let item = null
    if (state.app.currentList) {
        item = state.app.currentList.filter(item => item.id === state.app.currentItemId)
    }
    return ({
        authRole: state.app.authRole,
        currentItemResources: state.app.currentItemResources,
        item: (item && item[0]) || null,
        currentItemViewMode: state.app.currentItemViewMode,
        currentAnimations: state.app.currentAnimations,
        currentAnimationPlay: state.app.currentAnimationPlay,
        animationLock: state.app.animationLock,
    })
}


function ItemViewResources(props) {
    id = props.currentItemId


    const [dragonArmature, setDragonArmature] = useState(null)
    const [spineAnimations, setSpineAnimations] = useState([])
    //const [currentAnimationPlay, changeCurrentAnimationPlay] = useState(null)

    const [fileNames, setFileNames] = useState([])



    const getResourcesItem = (inputKey) => {
        props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: true }))
        sendResponse('get-item-data', { id }, res => {
            props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: false }))

            props.dispatch({ type: 'CHANGE_CURRENT_ITEM_RESOURCES', currentItemResources: res.item })
            setFileNames(res.item.files)

            AppPixi.createItemViewByResources(inputKey, props.currentItemId, res.item, animationsData => {
                if (inputKey === 'spines-files') {
                    setSpineAnimations(animationsData)
                }
                if (inputKey === 'dragon-bone-files') {
                    props.dispatch({ type: 'CURRENT_ANIMATIONS_LIST', currentAnimations: animationsData })
                }

                props.dispatch({ type: 'CURRENT_ITEM_VIEW_MODE', currentItemViewMode: inputKey})
            })
        })
    }

    useEffect(() => {
        getResourcesItem()
        return () => {
            props.dispatch({ type: 'CURRENT_ANIMATIONS_LIST', currentAnimations: [] })
            setSpineAnimations([])
            setFileNames([])
            props.dispatch({ type: 'CHANGE_CURRENT_ITEM_RESOURCES', currentItemResources: null })
            props.dispatch({ type: 'CURRENT_ITEM_VIEW_MODE', currentItemViewMode: null })
            props.dispatch({ type: 'CURRENT_ANIMATION', currentAnimationPlay: null })
            //changeCurrentAnimationPlay(null)
        }
    }, [props.currentItemId])


    /** send files */
    const onLoadMultFiles = (inputKey, itemData, files) => {
        sendFilesToServer(inputKey, id, props.currentItemResources, files, () => getResourcesItem(inputKey))
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
                    {props.currentItemResources && props.currentItemResources['files'] && props.currentItemResources['files']['dragon-ske'] &&
                        <AppButton
                            val='dragon bones view'
                            classNameCustom={props.currentItemViewMode === 'dragon-bones-files' && 'current'}
                            callBackClick={() => {
                                props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: true }))
                                AppPixi.createItemViewByResources('dragon-bones-files', props.currentItemId, props.currentItemResources, (animationsNames, armatureName) => {
                                    props.dispatch({ type: 'CURRENT_ITEM_VIEW_MODE', currentItemViewMode: 'dragon-bones-files' })
                                    props.dispatch({ type: 'CURRENT_ANIMATIONS_LIST', currentAnimations: animationsNames })
                                    setDragonArmature(armatureName)
                                    props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: false }))
                            })}}/>
                    }

                    {props.currentItemViewMode === 'dragon-bones-files' && dragonArmature && <span>armature: <b>{dragonArmature}</b></span>}
                </div>

                {props.currentItemViewMode === 'dragon-bones-files' && props.currentAnimations && props.currentAnimations.map((n, i) => n &&
                    <div
                        key={i}>
                        <div className="content-stroke">
                            <span>{n.name}</span>
                            <div className="contrnt-right">
                                <span className="m-r-5">{n.duration.toFixed(2)} s</span>
                                <AppButton
                                    val='once'
                                    classNameCustom={props.currentAnimationPlay === n.name + '_once' && 'current'}
                                    callBackClick={() => {
                                        AppPixi.playAnimation({ animationName: n.name, count: 1, isAdditional: !!props.animationLock })
                                        props.dispatch({ type: 'CURRENT_ANIMATION', currentAnimationPlay: n.name + '_once' })
                                    }}/>
                                <AppButton
                                    val='repeat'
                                    classNameCustom={props.currentAnimationPlay === n.name + '_repeat' && 'current'}
                                    callBackClick={() => {
                                        props.dispatch({ type: 'CURRENT_ANIMATION', currentAnimationPlay: n.name + '_repeat' })
                                        AppPixi.playAnimation({ animationName: n.name, count: 1000, isAdditional: !!props.animationLock })
                                    }}/>
                                <AppButton
                                    val='stop'
                                    classNameCustom={props.currentAnimationPlay === n.name + '_stop' && 'current'}
                                    callBackClick={() => {
                                        props.dispatch({ type: 'CURRENT_ANIMATION', currentAnimationPlay: n.name + '_stop' })
                                        AppPixi.playAnimation({ animationName: n.name, count: false, isAdditional: !!props.animationLock })
                                    }}/>
                                <div className='w-15' />
                                <AppButton
                                    val='lock'
                                    classNameCustom={props.animationLock === n.name && 'current'}
                                    callBackClick={() => {
                                        const isUnLock = props.animationLock === n.name
                                        props.dispatch({ type: 'LOCK_ANIMATION', animationLock: isUnLock ? null : n.name })
                                        AppPixi.playAnimation({ animationName: n.name, count: isUnLock ? false : 1000, isAdditional: false })
                                    }}/>
                            </div>
                        </div>



                        {/** add mode to animation */}
                        {props.currentItemResources &&
                        props.currentItemResources['sounds-animations'] &&
                        props.currentItemResources['sounds-animations'].length &&
                        props.currentItemResources['sounds-animations'].length > 0 &&
                            <AppDropDown
                                val={getMode(props.currentItemResources['sounds-animations'], n.name)}
                                buttonVal={"save"}
                                arrOptions={['none', ...props.currentItemResources['sounds-animations'].map(item => item.key)]}
                                callback={data => {

                                    for (let i = 0; i < props.currentItemResources['sounds-animations'].length; ++i) {
                                        if (data.val === props.currentItemResources['sounds-animations'][i].key) {
                                            const { animationsNames } = props.currentItemResources['sounds-animations'][i]
                                            let animationsNamesNew = null
                                            if (data.val === 'none') {
                                                animationsNamesNew = animationsNames.filter(item => item !== n.name)
                                            } else {
                                                const filtered = animationsNames.filter(item => item === n.name)
                                                if (filtered.length === 0) {
                                                    animationsNamesNew = [...animationsNames, n.name]
                                                }
                                            }
                                            props.currentItemResources['sounds-animations'][i]['animationsNames'] = animationsNamesNew
                                        }
                                    }

                                    sendResponse(
                                        'change-item-data',
                                        {...props.currentItemResources, 'sounds-animations': props.currentItemResources['sounds-animations'], id: props.currentItemId },
                                        getResourcesItem)
                                }}
                            />}
                    </div>
                )}



                {props.authRole === 'animator' && props.currentAnimations &&
                    <div>
                        <AppLoadMultFiles
                            val='upload DragonBones files'
                            inputKey='dragon-bones-files'
                            callback={(inputKey, files) => {
                                onLoadMultFiles(inputKey, props.currentItemResources, files)
                            }}
                        />
                    </div>
                }

                {/** SPINE VIEW ********************************************/}

                <div className='offset-top' />
                <hr />

                {props.currentItemResources && props.currentItemResources['files'] && props.currentItemResources['files']['spine-ske'] &&
                <AppButton
                    val='spine view'
                    //classNameCustom={currentFilesView === 'spines-files' && 'current'}
                    classNameCustom={props.currentItemViewMode === 'spines-files' && 'current'}
                    callBackClick={() => {
                        props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: true }))
                        AppPixi.createItemViewByResources('spines-files', props.currentItemId, props.currentItemResources, (animationsNames) => {
                            props.dispatch({ type: 'CURRENT_ITEM_VIEW_MODE', currentItemViewMode: 'spines-files' })
                            setSpineAnimations(animationsNames)
                            props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: false }))
                    })}}/>
                }

                {props.currentItemViewMode === 'spines-files' && spineAnimations && spineAnimations.map((n, i) => n &&
                    <div
                        className="content-stroke"
                        key={i}>
                        <span>{n.name}</span>
                        <div className="contrnt-right">
                            <span className="m-r-5">{n.duration.toFixed(2)} s</span>
                            <AppButton
                                val='once'
                                classNameCustom={props.currentAnimationPlay === n.name + '_once' && 'current'}
                                callBackClick={() => {
                                    props.dispatch({ type: 'CURRENT_ANIMATION', currentAnimationPlay: n.name + '_once' })
                                    //changeCurrentAnimationPlay(n.name + '_once')
                                    startAnimate(n.name, 1)
                                }}/>
                            <AppButton
                                val='repeat'
                                classNameCustom={props.currentAnimationPlay === n.name + '_repeat' && 'current'}
                                callBackClick={() => {
                                    props.dispatch({ type: 'CURRENT_ANIMATION', currentAnimationPlay: n.name + '_repeat' })
                                    //changeCurrentAnimationPlay(n.name + '_repeat')
                                    startAnimate(n.name, 1000)
                                }}/>
                            <AppButton
                                val='stop'
                                classNameCustom={props.currentAnimationPlay === n.name + '_stop' && 'current'}
                                callBackClick={() => {
                                    props.dispatch({ type: 'CURRENT_ANIMATION', currentAnimationPlay: n.name + '_stop' })
                                    //changeCurrentAnimationPlay(n.name + '_stop')
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
                            callback={(inputKey, files) => onLoadMultFiles(inputKey, props.currentItemResources, files)}
                        />
                    </div>
                }


                {/** IMAGE STATIC **************************************************/}


                <div className='offset-top' />
                <hr />


                {props.currentItemResources && props.currentItemResources['files'] && props.currentItemResources['files']['image-static'] && (
                    <div>
                        <AppButton
                            val='image static view'
                            classNameCustom={props.currentItemViewMode === 'image-static' && 'current'}
                            callBackClick={() => {
                                props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: true }))
                                AppPixi.createItemViewByResources('image-static', props.currentItemId, props.currentItemResources, () => {
                                    props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: false }))
                                })
                                props.dispatch({ type: 'CURRENT_ITEM_VIEW_MODE', currentItemViewMode: 'image-static' })
                                //changeCurrentFilesView('image-static')
                            }}/>
                    </div>)
                }


                {props.authRole === 'animator' && props.currentAnimations &&
                    <AppLoadMultFiles
                        val='upload static image file(.png)'
                        inputKey='image-static'
                        callback={(inputKey, files) => {
                            onLoadMultFiles(inputKey, props.currentItemResources, files)
                            }
                        }
                    />
                }


                {/** IMAGE BLUR **************************************************/}

                <div className='offset-top' />
                <hr />

                {props.currentItemResources && props.currentItemResources['files'] && props.currentItemResources['files']['image-blur'] && (
                    <div>
                        <AppButton
                            val='image blur view'
                            classNameCustom={props.currentItemViewMode === 'image-blur' && 'current'}
                            callBackClick={() => {
                                props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: true }))
                                AppPixi.createItemViewByResources('image-blur', props.currentItemId, props.currentItemResources, () => {
                                    props.dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: false }))
                                })
                                props.dispatch({ type: 'CURRENT_ITEM_VIEW_MODE', currentItemViewMode: 'image-blur' })
                            }}/>

                    </div>)
                }

                {props.authRole === 'animator' &&
                    <AppLoadMultFiles
                        val='upload blur image file(.png)'
                        inputKey='image-blur'
                        callback={(inputKey, files) => onLoadMultFiles(inputKey, props.currentItemResources, files)}
                    />
                }


                {/** DOWNLOAD FILES *****************************/}
                {props.authRole === 'animator' && <FilesList fileNames={fileNames}/>}

                {/** ANIMATIONS MODES ***************************/}
                {/*{props.authRole === 'animator' && props.currentItemResources &&*/}
                {/*    <WordsList*/}
                {/*        title="animations-sounds modes"*/}
                {/*        list={*/}
                {/*            (props.currentItemResources && props.currentItemResources['sounds-animations'].length && props.currentItemResources['sounds-animations'].length > 0)*/}
                {/*                ? props.currentItemResources['sounds-animations']*/}
                {/*                : []*/}
                {/*        }*/}
                {/*        callBackClick={newData => {*/}
                {/*            const withAnimatonsArr = newData.map(item => {*/}
                {/*                delete item.animationName*/}
                {/*                !item['animationsNames'] && (item['animationsNames'] = [])*/}
                {/*                return item;*/}
                {/*            })*/}
                {/*            sendResponse(*/}
                {/*                'change-item-data',*/}
                {/*                {...props.currentItemResources, 'sounds-animations': withAnimatonsArr, id: props.currentItemId },*/}
                {/*                getResourcesItem)*/}
                {/*        }}*/}
                {/*    />}*/}

            </div>)
        }
    </div>)
}

export default connect(mapStateToProps)(ItemViewResources)
