import React, { useState } from 'react'
import { connect } from 'react-redux'

import { AppButton } from "../components/AppButton"
import { AppInput } from "../components/AppInput";
import { AppDropDown } from "../components/AppDropDown";
import { AppButtonAlertDoneOrNot } from "../components/AppButtonAlertDoneOrNot";
import ItemViewResources from './ItemViewResources'

import { removeSpr } from '../../appPixi/AppPixi'
import { sendResponse } from "../../toServerApi/requests";



const mapStateToProps = state => ({
    authRole: state.app.authRole,
    currentGameTag: state.app.currentGameTag,
    gameTags: state.app.gameTags,
    currentItemId: state.app.currentItemId,
})


function ItemPreView(props) {

    const changeMainParams = inputData => {
        const objToSend = {
            'id': props.item.id,
            'gameTag': inputData.type === 'gameTag' ? inputData.val : props.item.gameTag,
            'name': inputData.type === 'name' ? inputData.val : props.item.name,
            'typeView': inputData.type === 'typeView' ? inputData.val : props.item.typeView,
        }
        sendResponse('edit-item', objToSend, respData => {
            props.dispatch({ type:  'CHANGE_CURRENT_GAME_TAG', gameTag: '------', currentList: [], })
            sendResponse('get-list', { gameTag: props.currentGameTag }, res => {
                props.dispatch({ type:  'CHANGE_CURRENT_GAME_TAG', gameTag: props.currentGameTag, currentList: res.list, })
            })
        })
    }


    return (
        <div>

            <div className='content-stroke'>
                <AppButton
                    classNameCustom={`w-long ${props.item.id === props.currentItemId && 'current'}`}
                    val={props.item.name}
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
                            val={props.item.name}
                            type="name"
                            buttonVal='save'
                            callback = {changeMainParams}
                        />
                    )}
                    {props.authRole === "animator" && (
                        <AppDropDown
                            val={props.item.gameTag}
                            type="gameTag"
                            buttonVal='save'
                            arrOptions={props.gameTags}
                            callback={changeMainParams}
                        />
                    )}
                    {props.authRole === "animator" && (
                        <AppDropDown
                            val={props.item.typeView}
                            type="typeView"
                            buttonVal='save'
                            arrOptions={['slot-item', 'background', 'element', 'none']}
                            callback={changeMainParams}
                        />
                    )}
                    gameTag: {props.item.gameTag}, typeView: {props.item.typeView}

                    <ItemViewResources />
                </div>
            )}
        </div>)
}


export default connect(mapStateToProps)(ItemPreView)