import React, { useState } from 'react'
import { connect } from 'react-redux'

import { AppButton } from "../components/AppButton"
import { AppInput } from "../components/AppInput";
import { AppDropDown } from "../components/AppDropDown";


import { sendResponse } from "../../toServerApi/requests";



const mapStateToProps = state => {
    return ({
        authRole: state.app.authRole,
        currentGameTag: state.app.currentGameTag,
        gameTags: state.app.gameTags,
        name: (state.app.currentItemProperties && state.app.currentItemProperties.name) || null,
        gameTag: (state.app.currentItemProperties && state.app.currentItemProperties.gameTag) || null,
        typeView: (state.app.currentItemProperties && state.app.currentItemProperties.typeView) || null,
    })
}


function ItemView(props) {
    const changeMainParams = inputData => {
        const objToSend = {
            'id': props.currentItemId,
            'gameTag': inputData.type === 'gameTag' ? inputData.val : props.gameTag,
            'name': inputData.type === 'name' ? inputData.val : props.name,
            'typeView': inputData.type === 'typeView' ? inputData.val : props.typeView,
        }
        sendResponse('edit-item', objToSend, respData => {
            props.dispatch({ type:  'CHANGE_CURRENT_GAME_TAG', gameTag: '------', currentList: [], })
            sendResponse('get-list', { gameTag: props.currentGameTag }, res => {
                props.dispatch({ type:  'CHANGE_CURRENT_GAME_TAG', gameTag: props.currentGameTag, currentList: res.list, })
            })
        })
    }


    if (!props.currentItemId) {
        return (<div></div>)
    }


    return (
        <div>
            <h2>{props.name}</h2>
            {/*/!** EDIT MAIN PARAMS *****************************************!/*/}

                <div className='content-tab'>
                    <div className="content-stroke">
                        <AppButton
                            val="close"
                            callBackClick={e => {
                                props.dispatch({ type: 'SET_CURRENT_ITEM_ID', id: null })
                                e.stopPropagation()
                                e.preventDefault()
                            }}/>
                        <div>id: {props.currentItemId}</div>
                    </div>
                </div>

                <div className='offset-bottom'>
                    {props.authRole === "animator" && props.name && (
                        <AppInput
                            val={props.name}
                            type="name"
                            buttonVal='save'
                            callback = {changeMainParams}
                        />
                    )}
                    {props.authRole === "animator" && props.gameTag && (
                        <AppDropDown
                            val={props.gameTag}
                            type="gameTag"
                            buttonVal='save'
                            arrOptions={props.gameTags}
                            callback={changeMainParams}
                        />
                    )}
                    {props.authRole === "animator" && props.typeView && (
                        <AppDropDown
                            val={props.typeView}
                            type="typeView"
                            buttonVal='save'
                            arrOptions={['slot-item', 'background', 'element', 'none']}
                            callback={changeMainParams}
                        />
                    )}
                    gameTag: {props.gameTag}, typeView: {props.typeView}
                </div>
        </div>)
}


export default connect(mapStateToProps)(ItemView)