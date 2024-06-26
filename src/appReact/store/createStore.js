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
    currentItemViewMode: null,
    currentAnimations: [],
    currentAnimationPlay: null,
    animationLock: null,

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
        const tags = action.arrTags.reverse()
        const tagsWithNone = ['none', ...tags]
        return ({
            ...state,
            gameTags: tagsWithNone,
        })
    } 


    if (action.type === 'CHANGE_CURRENT_GAME_TAG') {
        const currentList = [...action.currentList]
        const currentItemProperties = (currentList && currentList.filter(item => item.id === state.currentItemId)[0]) || null

        return ({
            ...state,
            currentGameTag: action.gameTag,
            currentItemProperties,
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
            animationLock: null,
        })
    }

    if (action.type === 'CHANGE_CURRENT_ITEM_PROPERTIES') {
        return ({
            ...state,
            currentItemProperties: action.currentItemProperties,
        })
    }

    if (action.type === 'CHANGE_CURRENT_ITEM_RESOURCES') {
        return ({
            ...state,
            currentItemResources: action.currentItemResources,
        })
    }

    if (action.type === 'CURRENT_ITEM_VIEW_MODE') {
        return ({
            ...state,
            currentItemViewMode: action.currentItemViewMode,
        })
    }

    if (action.type === 'CURRENT_ANIMATIONS_LIST') {
        return ({
            ...state,
            currentAnimations: action.currentAnimations,
        })
    }

    if (action.type === 'CURRENT_ANIMATION') {
        return ({
            ...state,
            currentAnimationPlay: action.currentAnimationPlay,
        })
    }

    if (action.type === 'LOCK_ANIMATION') {
        return ({
            ...state,
            animationLock: action.animationLock,
            currentAnimationPlay: null,
        })
    }


    return state
}



const rootReducer = combineReducers({ app })
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
