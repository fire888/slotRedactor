import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { AppButton } from '../components/AppButton'
import '../stylesheets/ContainerGamesNames.css'
import { sendResponse } from '../../toServerApi/requests'
import ContainerGames_CreateGame from './ContainerGames_CreateGame'



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
            <div className='games-names offset-top'>
                <div className='content-column'>
                    {props.gameTags && props.gameTags.map(item =>
                        <AppButton
                            key = {item + Math.random()}
                            val = {item}
                            classNameCustom = {props.currentGameTag === item && "current"}
                            callBackClick = {() => {
                                sendResponse('get-list', { gameTag: item }, data => {
                                    props.dispatch({ type: 'CHANGE_CURRENT_GAME_TAG', gameTag: item, currentList: data.list })
                                })
                            }}
                        />)}
                </div>

                {props.authRole === 'animator' && <ContainerGames_CreateGame />}
            </div>
    )
}

export default connect(mapStateToProps)(ContainerGamesNames)

