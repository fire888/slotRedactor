import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import thunk from 'redux-thunk';





const appData = {
    authRole: null,
    currentGameTag: null,
    gameTags: null, //['spells', 'cleo', 'eagles', 'none'],
    listTypes: ['slot-item', 'background', 'element', 'none'],
    currentList: null,
    currentItemId: null,
}


const app = function (state = appData, action) {
    if (action.type === 'CHANGE_AUTH_ROLE') {

        return ({
            ...state,
            authRole: action.authRole,
        })
    }

    if (action.type === 'ADD_GAMES_TAGS') {
        return ({
            ...state,
            gameTags: action.arrTags,
        })
    } 


    if (action.type === 'CHANGE_CURRENT_GAME_TAG') {
        return ({
            ...state,
            currentGameTag: action.gameTag,
            currentList: [...action.currentList],
        })
    }

    if (action.type === 'SET_CURRENT_ITEM_ID') {
        return ({
            ...state,
            currentItemId: action.id
        })
    }

    return state
}



const rootReducer = combineReducers({app})
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))