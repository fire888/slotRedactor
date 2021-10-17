import React, { useState, useEffect, } from 'react'
import { AppInput } from "../components/AppInput";
import uniqid from 'uniqid'
import { sendResponse } from "../../toServerApi/requests";
import {AppButton} from "../components/AppButton";
import { connect } from "react-redux";


const prepareInitSpriteData = () => ({
    'id': uniqid(),
    'name': '',
    'typeView': 'slot-item',
    'gameTag': 'none',
})


const mapStateToProps = state => ({
    currentGameTag: state.app.currentGameTag
})


function ItemViewCreate(props) {
    const [isClosed, toggleClosed] = useState(true)

    const sendDataToServer = data => {
        const newItem = prepareInitSpriteData()

        sendResponse(
            'add-item',
            Object.assign(newItem, { name: data.val, gameTag: props.currentGameTag }),
            () => { sendResponse('get-list', { gameTag: props.currentGameTag }, res => {
                    toggleClosed(true)
                    props.dispatch({type:  'CHANGE_CURRENT_GAME_TAG', gameTag: props.currentGameTag, currentList: res.list, })
            })}
        )
    } 

    return (
        <div>
            <div className='offset-top' />
            {!isClosed && <AppInput
                val=''
                type="name"
                buttonVal="create"
                callback={sendDataToServer}/>}

            <AppButton
                val={isClosed ? "create item" : 'cancel create item'}
                callBackClick={() => toggleClosed(!isClosed)}/>
        </div>
    )
}


export default connect(mapStateToProps)(ItemViewCreate)