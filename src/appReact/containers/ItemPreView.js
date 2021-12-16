import React from 'react'
import { connect } from 'react-redux'


import { AppButton } from "../components/AppButton"
import { AppButtonAlertDoneOrNot } from "../components/AppButtonAlertDoneOrNot";
import { removeSpr } from '../../appPixi/AppPixi'
import { sendResponse } from "../../toServerApi/requests";



const mapStateToProps = state => ({
    authRole: state.app.authRole,
    currentGameTag: state.app.currentGameTag,
    gameTags: state.app.gameTags,
    currentItemId: state.app.currentItemId,
})


function ItemPreView(props) {
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
        </div>)
}


export default connect(mapStateToProps)(ItemPreView)