import { sendResponse } from '../../toServerApi/requests'
import * as AppPixi from "../../appPixi/AppPixi";

/** http://localhost:9000/?game=spells&id=ku3spy0p&view=dragon-bones-files&animation=pfs_cycle_once */

let isRestored = false

export const restoreParamsFromPath = (dispatch) => {
    if (isRestored) {
        return;
    }
    isRestored = true

    const queryParams = new URLSearchParams(window.location.search);
    const game = queryParams.get('game');
    const id = queryParams.get('id');
    const view = queryParams.get('view');
    const animation = queryParams.get('animation')
    console.log(game, id, view, animation); // 55 test null

    window.history.replaceState(null, null, window.location.pathname);

    if (!game || !id) {
        return;
    }

    sendResponse('get-list', { gameTag: game }, data => {
        dispatch({ type: 'CHANGE_CURRENT_GAME_TAG', gameTag: game, currentList: data.list })

        setTimeout(() => {
            dispatch({ type: 'SET_CURRENT_ITEM_ID', id })


            dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: true }))


            sendResponse('get-item-data', { id }, res => {
                dispatch(({ type: 'TOGGLE_WAIT_LOADING', is: false }))
                dispatch({ type: 'CHANGE_CURRENT_ITEM_RESOURCES', currentItemResources: res.item })

                if (!view) {
                    return;
                }

                AppPixi.createItemViewByResources(view, id, res.item, animationsData => {
                    dispatch({ type: 'CURRENT_ITEM_VIEW_MODE', currentItemViewMode: view })
                    console.log(animationsData)
                    if (!animationsData) {
                        return;
                    }
                    dispatch({ type: 'CURRENT_ANIMATIONS_LIST', currentAnimations: animationsData })

                    if (!animation || animation === 'null') {
                        return;
                    }

                    console.log(animation)
                    const n = getAnimationName(animation)

                    dispatch({ type: 'CURRENT_ANIMATION', currentAnimationPlay: n + '_repeat' })
                    AppPixi.playAnimation({ animationName: n, count: 1000 })
                })
            })
        }, 5)
    })
}

export const getLink = (store) => {
    const host = window.location.origin

    const game = store.currentGameTag
    const id = store.currentItemId
    const view = store.currentItemViewMode
    const animationName = store.currentAnimationPlay

    return `${ host }/?game=${game}&id=${id}&view=${view}&animation=${animationName}`
}

const ANIMATIONS_PLAY_MODES = ['_once', '_repeat', '_stop']
const getAnimationName = str => {
    for (let i = 0; i < ANIMATIONS_PLAY_MODES.length; ++i) {
        if (str.includes(ANIMATIONS_PLAY_MODES[i])) {
            return str.split(ANIMATIONS_PLAY_MODES[i])[0]
        }
    }
}