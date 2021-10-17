import React from 'react'
import { connect } from 'react-redux'
import { AppButton } from '../components/AppButton'
import '../stylesheets/ContainerGamesNames.css'
import { sendResponse } from '../../toServerApi/requests'


const LISTS = {
    "spells": {
        request: 'get-list',
        requestParams: { gameTag: 'spells' },
    },
    "eagles": {
        request: 'get-list',
        requestParams: { gameTag: 'eagles' },
    },
    "cleo": {
        request: 'get-list',
        requestParams: { gameTag: 'cleo' },
    },
    // "all": {
    //     request: 'get-list',
    //     requestParams: {},
    // },
    "none": {
        request: 'get-list',
        requestParams: { gameTag: 'none' },
    },
}



const mapStateToProps = state => {
    return ({
        gameTags: state.app.gameTags,
        currentGameTag: state.app.currentGameTag,
        authRole: state.app.authRole,
    })
}


function ContainerGamesNames (props) {

    return (
        <div className={'left-panel offset-top'}>
            {props.gameTags.map(item =>
                <AppButton
                    val = {item}
                    classNameCustom = {props.currentGameTag === item && "current"}
                    callBackClick = {() => {
                        sendResponse(LISTS[item].request, LISTS[item].requestParams, data => {
                            console.log(data)
                            props.dispatch({ type: 'CHANGE_CURRENT_GAME_TAG', gameTag: item, currentList: data.list })
                        })
                    }}
                />)}

        </div>)
}

export default connect(mapStateToProps)(ContainerGamesNames)

