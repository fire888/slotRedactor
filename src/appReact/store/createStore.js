import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import thunk from 'redux-thunk';





const appData = {
    authRole: null,
    currentGameTag: null,
    gameTags: null, //['spells', 'cleo', 'eagles', 'none'],
    listTypes: ['slot-item', 'background', 'element', 'none'],
    currentList: null,
    currentItemId: null,
    currentItemProperties: null,
    currentItemResources: null,
    isShowLoadingSpinner: false,
}


const app = function (state = appData, action) {
    if (action.type === 'TOGGLE_WAIT_LOADING') {
        return ({
            ...state,
            isShowLoadingSpinner: action.is,
        })
    }


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
        const currentList = [...action.currentList]
        const currentItemProperties = (currentList && currentList.filter(item => item.id === state.currentItemId)[0]) || null

        return ({
            ...state,
            currentGameTag: action.gameTag,
            currentItemProperties,
            //currentItemProperties,
            currentList,
            currentItemId: null,
        })
    }

    if (action.type === 'SET_CURRENT_ITEM_ID') {
        const currentItemProperties = (state.currentList && state.currentList.filter(item => item.id === action.id)[0]) || null

        return ({
            ...state,
            currentItemId: action.id,
            currentItemProperties,
        })
    }

    if (action.type === 'CHANGE_CURRENT_ITEM_PROPERTIES') {
        //const currentItemProperties = (state.currentList && state.currentList.filter(item => item.id === action.id)[0]) || null

        return ({
            ...state,
            currentItemProperties: action.currentItemProperties,
        })
    }

    return state
}



const rootReducer = combineReducers({app})
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))