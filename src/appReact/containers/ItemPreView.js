import React, { useState, useEffect, useRef } from 'react'
import { AppButton } from "../components/AppButton"
import {
    //showDragonSpr,
    //playAnimation,
    removeSpr,
} from '../../appPixi/AppPixi'
import { AppInput } from "../components/AppInput";
import { AppDropDown } from "../components/AppDropDown";
import { sendResponse } from "../../toServerApi/requests";
import { AppButtonAlertDoneOrNot } from "../components/AppButtonAlertDoneOrNot";
import { connect } from 'react-redux'
import ItemViewAnimations from './ItemViewAnimations'




const VIEW_MODES = {
    'none': 0,
    'preview': 1,
    'view': 2,
}


const mapStateToProps = state => ({
    authRole: state.app.authRole,
    currentGameTag: state.app.currentGameTag,
    gameTags: state.app.gameTags,
    currentItemId: state.app.currentItemId,
})


function ItemPreView(props) {
    const [name, changeName] = useState(props.item.name)
    const [typeView, changeTypeView] = useState(props.item.typeView)


    const changeMainParams = inputData => {
        const objToSend = {
            'id': props.item.id,
            'gameTag': inputData.val,
            'name': inputData.type === 'name' ? inputData.val : name,
            'typeView': inputData.type === 'typeView' ? inputData.val : typeView,
        }
        sendResponse('edit-item', objToSend, respData => {
            sendResponse('get-list', {gameTag: props.currentGameTag }, res => {
                props.dispatch({ type:  'CHANGE_CURRENT_GAME_TAG', gameTag: props.currentGameTag, currentList: res.list, })
            })
        })
    }


    return (
        <div>

            <div className='content-stroke'>
                <AppButton
                    classNameCustom={`w-long ${props.item.id === props.currentItemId && 'current'}`}
                    val={name}
                    callBackClick = {() => props.dispatch({ type: 'SET_CURRENT_ITEM_ID', id: props.item.id })}
                />
                {props.authRole === 'animator' &&
                <AppButtonAlertDoneOrNot
                    val='del'
                    classNameCustom='color-alert'
                    callBackClick = {() => {
                        sendResponse(
                            'remove-item',
                            { id: props.item.id },
                            res => {
                                    removeSpr()
                                    sendResponse('get-list', {gameTag: props.currentGameTag }, res => {
                                        props.dispatch({type:  'CHANGE_CURRENT_GAME_TAG', gameTag: props.currentGameTag, currentList: res.list, })
                                    })
                            })
                    }}
                />
                }
            </div>

            {/** EDIT MAIN PARAMS *****************************************/}

            {props.currentItemId === props.item.id && (
                <div className='content-tab'>
                    <div className="content-stroke">
                        <AppButton
                            val="close"
                            callBackClick={e => {
                                props.dispatch({ type: 'SET_CURRENT_ITEM_ID', id: null })
                                e.stopPropagation()
                                e.preventDefault()
                            }}/>
                        <div>id: {props.item.id}</div>
                    </div>
                </div>
            )}

            {props.currentItemId === props.item.id && (
                <div className='offset-bottom'>
                    {props.authRole === "animator" && (
                        <AppInput
                            val = {name}
                            type = "name"
                            buttonVal = 'save'
                            callback = {changeMainParams}
                        />
                    )}
                    {props.authRole === "animator" && (
                        <AppDropDown
                            val = {props.item.gameTag}
                            type = "gameTag"
                            buttonVal = 'save'
                            arrOptions = {props.gameTags}
                            callback = {changeMainParams}
                        />
                    )}
                    {props.authRole === "animator" && (
                        <AppDropDown
                            val = {typeView}
                            type = "typeView"
                            buttonVal = 'save'
                            arrOptions = {['slot-item', 'background', 'element', 'none']}
                            callback = {changeMainParams}
                        />
                    )}
                    gameTag: {props.item.gameTag}, typeView: {typeView}

                    <ItemViewAnimations />
                </div>
            )}
        </div>)
}


export default connect(mapStateToProps)(ItemPreView)