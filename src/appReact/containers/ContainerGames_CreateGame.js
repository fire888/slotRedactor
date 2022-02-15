import React, { useState, } from 'react'
import { AppInput } from "../components/AppInput";
import { sendResponse } from "../../toServerApi/requests";
import { AppButton } from "../components/AppButton";
import { connect } from "react-redux";





function ContainerGames_CreateGame(props) {
    const [isClosed, toggleClosed] = useState(true)

    const sendDataToServer = data => {
        sendResponse(
             'add-game-tag',
             { tag: data.val },
            res => {
                    toggleClosed(true)
                    sendResponse('get-games-tags', {}, res => {
                    props.dispatch({ type: 'ADD_GAMES_TAGS', arrTags: res.list })
                })
            },
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
                val={isClosed ? "create game" : 'cancel create game'}
                callBackClick={() => toggleClosed(!isClosed)}/>
        </div>
    )
}


export default connect()(ContainerGames_CreateGame)