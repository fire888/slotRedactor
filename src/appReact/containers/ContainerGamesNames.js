import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { AppButton } from '../components/AppButton'
import '../stylesheets/ContainerGamesNames.css'
import { sendResponse } from '../../toServerApi/requests'



const mapStateToProps = state => {
    return ({
        gameTags: state.app.gameTags,
        currentGameTag: state.app.currentGameTag,
        authRole: state.app.authRole,
    })
}



function ContainerGamesNames (props) {

    useEffect(() => {
        if (!props.gameTags) {
            sendResponse('get-games-tags', {}, res => {
                props.dispatch({ type: 'ADD_GAMES_TAGS', arrTags: res.list })
            })                
        }
    })

    return (
        <div className={'games-names offset-top'}>
            {props.gameTags && props.gameTags.map(item =>
                <AppButton
                    key = {item}
                    val = {item}
                    classNameCustom = {props.currentGameTag === item && "current"}
                    callBackClick = {() => {
                        sendResponse('get-list', { gameTag: item }, data => {
                            props.dispatch({ type: 'CHANGE_CURRENT_GAME_TAG', gameTag: item, currentList: data.list })
                        })
                    }}
                />)}

        </div>)
}

export default connect(mapStateToProps)(ContainerGamesNames)

