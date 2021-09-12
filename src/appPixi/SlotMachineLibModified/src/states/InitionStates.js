import * as StateMachine from 'javascript-state-machine'


import { updateTweens } from '../helpers/tween'


export class InitionStates {
    constructor (gameContext) {
        this._gameContext = gameContext

        this._isAllAssetsLoaded = false
        this._unsubscriberStartButton = null
        this._resolveState = null

        this._sm = new StateMachine({
            init: 'nothing',
            transitions: [{
                name: 'next',
                from: 'nothing',
                to: 'loadingPreLoaderAssets',
            }, {
                name: 'next',
                from: 'loadingPreLoaderAssets',
                to: 'waitForInitializationData',
            }, {
                name: 'next',
                from: 'waitForInitializationData',
                to: 'loadingIntroAssets',
            }, {
                name: 'startLoadGameAssets',
                from: ['waitForInitializationData', 'loadingIntroAssets'],
                to: 'loadingGameAssets',
            }, {
                name: 'next',
                from: 'loadingGameAssets',
                to: 'gameInitialization',
            }, {
                name: 'next',
                from: 'gameInitialization',
                to: 'checkGiftSpins',
            }, {
                name: 'next',
                from: 'checkGiftSpins',
                to: 'resolveFromInitStates',
            }],
            methods: {
                onEnterLoadingPreLoaderAssets: this._onEnterLoadingPreloaderAssets.bind(this),
                onEnterLoadingIntroAssets: this._onEnterLoadingIntroAssets.bind(this),
                onEnterLoadingGameAssets: this._onEnterLoadingGameAssets.bind(this),
                onEnterWaitForInitializationData: this._onEnterWaitForInitializationData.bind(this),
                onEnterGameInitialization: this._onEnterGameInitialization.bind(this),
                onEnterCheckGiftSpins: this._onEnterCheckGiftSpins.bind(this),
                onEnterResolveFromInitStates: this._onEnterResolveFromInitStates.bind(this),
            }
        })

    }

    start () {
        return new Promise(resolve => {
            this._resolveState = resolve
            this._sm['next']()
        })
    }


    /** **************************************************
     * START SCREENS
     *****************************************************/


    /**
     * Prepare app, load assets for start screen and on load go to next state.
     * @private
     */
    _onEnterLoadingPreloaderAssets () {
        this._gameContext.components = {}
        this._gameContext.data.currentStates = 'initionStates'
        this._gameContext.data.view = 'startScreen'

        this._initConstructors('preStartScreen')
        this._gameContext.components.gameScene = this._gameContext.components.app.gameScene


        const layersAssets = getAssetsFromGameContext('startScreen', 'textures', this._gameContext)
        this._gameContext.components['loaderAssets'].load(layersAssets, this._showStartScreen.bind(this), 'fast')
    }


    /**
     * Show start screen.
     * @private
     */
    _showStartScreen () {
        this._initLayers('startScreen')
        this._initConstructors('startScreen')

        /** clear preStartScreen */
        const preLoaderEl = document.getElementById('preloader')
        const preLoaderBack = document.getElementById('pre-back')
        preLoaderEl.parentNode.removeChild(preLoaderEl)
        preLoaderBack.parentNode.removeChild(preLoaderBack)

        this._gameContext.components.deviceResizer.resize()

        setTimeout(() => this._sm['next'](), 0)
    }


    /**
     * Send to server start request and after response go to next state.
     * @private
     */
    _onEnterWaitForInitializationData () {
        const { client, changerBalance, changerBet } = this._gameContext.components


        client.getInitialData()
            .then(data => {

                let currentBalance
                if (data.gift && data.gift.current_giftspin !== 0) {
                    currentBalance = data.currentBalance - data.gift.total_win
                } else {
                    if (data.gameState === 'FREE_SPINS' || data.gameState === 'BONUS_IN_BONUS' || data.gameState === 'BONUS_GAME_END') {
                        currentBalance = data.currentBalance - data.additionalInfo.total_free_game_win
                    } else {
                        currentBalance = data.currentBalance
                    }
                }
                changerBalance.setBalance(currentBalance)
                changerBet.setBets(data)

                this._gameContext.data.serverResponse = data

                checkIsIntroInLayers(this._gameContext.layers)
                    ? this._sm['next']()
                    : this._sm['startLoadGameAssets']()
            })
    }


    /**
     * Load Intro assets and after response go to next state.
     * @private
     */
    _onEnterLoadingIntroAssets () {
        const { loaderAssets, widgetProgressBar } = this._gameContext.components

        widgetProgressBar && widgetProgressBar.setPointsBetween && widgetProgressBar.setPointsBetween(0, 0.2)

        const layersAssets = getAssetsFromGameContext('introScreen', 'textures', this._gameContext)
        loaderAssets.load(layersAssets, () => {
            this._gameContext.data.windowData.deviceMode === 'desktop' || this._gameContext.data.windowData.isIphone
                ? this._changeScreenToIntro()
                : this._addContinueButtonSwitchToIntro()
            this._sm['startLoadGameAssets']()
        })
    }



    /**
     * In phones add 'continue' button for click show Intro and open full screen.
     * @private
     */
    _addContinueButtonSwitchToIntro () {
        const { widgetProgressBar, eventEmitter, startButton } = this._gameContext.components
        widgetProgressBar.container.renderable = false
        startButton.enable()
        this._unsubscriberStartButton = eventEmitter.subscribe('clickStartButton', () => {
            this._unsubscriberStartButton()
            widgetProgressBar.container.renderable = true
            startButton.disable()
            this._changeScreenToIntro()
            this._isAllAssetsLoaded && this._addContinueButtonToStartPlay()
        })
    }


    /**
     * Show Intro
     * @private
     */
    _changeScreenToIntro () {
        this._destroyLayers('introScreen')
        this._initLayers('introScreen')
        this._initConstructors('introScreen')

        this._gameContext.data.view = 'introScreen'
        this._gameContext.components.deviceResizer.resize()
    }


    /** ******************************************************
    * LOAD GAME ASSETS
    ********************************************************/

    /**
     * Load full game assets.
     * @private
     */
    _onEnterLoadingGameAssets () {
        const { eventEmitter } = this._gameContext.components
        eventEmitter.emit('initionsStatesChanged', 'onEnterLoadGameAssets')

        this._loadGameAssets()
            .then(this._loadAudioAssets.bind(this))
            .then(this._loadDragonAssets.bind(this))
            .then(this._loadSpineAssets.bind(this))
            .then(this._sm['next'].bind(this._sm))
    }


    /**
     * Load static images and audio.
     * @returns {Promise}
     * @private
     */
    _loadGameAssets () {
        return new Promise(resolve => {
            const { loaderAssets, widgetProgressBar } = this._gameContext.components

            widgetProgressBar && widgetProgressBar.setPointsBetween(0.2, 0.5)

            const assets = getAssetsFromGameContext('playScreen', 'textures', this._gameContext)
            loaderAssets.load(assets, resolve, 'fast', 'textures')
        })
    }


    /**
     * Load audio
     * @returns {Promise}
     * @private
     */
    _loadAudioAssets () {
        return new Promise(resolve => {
            const { loaderAssets, widgetProgressBar } = this._gameContext.components
            widgetProgressBar && widgetProgressBar.setPointsBetween(0.5, 0.65)

            const assets = getAssetsFromGameContext('playScreen', 'audio', this._gameContext)

            loaderAssets.load(assets, resourses => {
                this._gameContext.data.audioList = resourses
                resolve()
            }, 'fast', 'audio')
        })
    }


    /**
     * Load animation of dragonFly plugin.
     * @returns {Promise}
     * @private
     */
    _loadDragonAssets () {
        return new Promise(resolve => {
            const { loaderAssets, widgetProgressBar } = this._gameContext.components
            widgetProgressBar && widgetProgressBar.setPointsBetween(0.65, 0.75)

            const assets = getAssetsFromGameContext('playScreen', 'dragonAnimations', this._gameContext)

            if (isObjectEmpty(assets)) {
                return resolve()
            }

            loaderAssets.loadAnimated(assets, res => {
                this._gameContext.resourcesDragoneBones = res
                resolve()
            })
        })
    }


    /**
     * Load animation for spine plugin.
     * @returns {Promise}
     * @private
     */
    _loadSpineAssets () {
        return new Promise(resolve => {
            const assets = getAssetsFromGameContext('playScreen', 'spineAnimations', this._gameContext)

            const { loaderAssets, widgetProgressBar } = this._gameContext.components
            widgetProgressBar && widgetProgressBar.setPointsBetween(0.75, 0.95)

            if (isObjectEmpty(assets)) {
                return resolve()
            }

            loaderAssets.loadAnimatedSpine(assets, res => {
                this._gameContext.resources = res
                resolve()
            })
        })
    }



    /*****************************************************************
     * INITIALIZATION
     *****************************************************************/

    /**
     * Init all game modules.
     * @private
     */
    _onEnterGameInitialization () {
        const { eventEmitter, app } = this._gameContext.components

        app.app.ticker.add(data => {
            updateTweens()
            eventEmitter.emit('drawNewFrame', data)
        })

        document.fonts.ready.then(() => {
            this._isAllAssetsLoaded = true
            this._checkIsShowContineButtonToPlay()
        })
    }


    /**
     * Check show button 'continue' after all loading complete or not.
     * @private
     */
    _checkIsShowContineButtonToPlay () {
        // Если стадии Интро в сценарии нет то показать кнопку старта игры.
        const checkIntro = checkIsIntroInLayers(this._gameContext.layers)
        !checkIntro && this._addContinueButtonToStartPlay()

        // Если пользователь уже посмотрел Интро то показать кнопку старта игры.
        this._gameContext.data.view === 'introScreen' && this._addContinueButtonToStartPlay()
    }


    /**
     * Add button 'continue' for start game.
     * @private
     */
    _addContinueButtonToStartPlay () {
        const { widgetProgressBar, eventEmitter, startButton } = this._gameContext.components

        startButton.enable()
        widgetProgressBar && (widgetProgressBar.container.renderable = false)
        this._unsubscriberStartButton = eventEmitter.subscribe('clickStartButton', this._startGame.bind(this))
    }


    /**
     * Remove start screens and add all game modules to canvas.
     * @private
     */
    _startGame () {
        this._gameContext.data.view = 'playScreen'

        this._destroyLayers('playScreen')
        this._initLayers('playScreen')
        this._initConstructors('playScreen')

        const { deviceResizer, locale, helperSortData, ui, slotMachine } = this._gameContext.components
        const { serverResponse, windowData } = this._gameContext.data

        deviceResizer.startIphone()

        const { wheels } = serverResponse
        const symbols = wheels && wheels.length > 0
            ? helperSortData.prepareFinishSymbols(serverResponse)
            : helperSortData.createFilled('random')
        slotMachine.forceSetCombinationsData(symbols)

        this._unsubscriberStartButton && this._unsubscriberStartButton()
        this._gameContext.data.currentStates = 'playStates'

        /** prepare ui */
        if (ui) {
            const { betPerLine, betIndex, currentBet } = this._gameContext.data.bet

            ui.setBetValue(betPerLine[betIndex], currentBet)
            ui.setBigMes(locale.getPhrase("Spin the wheels!"))

            if (serverResponse.gift && serverResponse.gift.current_giftspin !== 0) {
                ui.setWinValue(serverResponse.gift.total_win)
            }

            windowData.deviceMode !== 'desktop' && setTimeout(ui.redraw, 500)
        }

        /** inition done */
        deviceResizer.resize()
        setTimeout(this._sm['next'].bind(this._sm))
    }


    _onEnterCheckGiftSpins () {
        const { messageGiftSpins } = this._gameContext.components

        if (messageGiftSpins) {
            messageGiftSpins.checkRestoreGiftSpins()
                .then(this._sm['next'].bind(this._sm))
        } else {
            setTimeout(this._sm['next'].bind(this._sm), 0)
        }
    }


    _onEnterResolveFromInitStates () {
        this._resolveState(this._gameContext)
    }




    /** helpers  ***************************************************************/


    _destroyLayers (screenKey) {
        for (let i = 0; i < this._gameContext.layers.length; i++) {
            const layer = this._gameContext.layers[i]
            if (layer.data.destroyState === screenKey) {
                this._gameContext.components[layer.key].dispose()
                this._gameContext.components[layer.key] = null
            }
        }

    }


    _initLayers (screenKey) {
        const { gameScene } = this._gameContext.components

        for (let i = 0; i < this._gameContext.layers.length; i ++) {
            const layer = this._gameContext.layers[i]

            if (!this._gameContext.components[layer.key]) {
                if (layer.data.initState === screenKey) {
                    const item = new layer.data.constructor(this._gameContext, layer.data)
                    gameScene.addChild(item.container)
                    this._gameContext.components[layer.key] = item
                } else {
                    const item = { container: new this._gameContext.PIXI.Container() }
                    gameScene.addChild(item.container)
                    this._gameContext.components[layer.key] = item
                }
            } else {
                if (layer.data.initState === screenKey) {
                    const item = new layer.data.constructor(this._gameContext, layer.data)
                    const index = gameScene.getChildIndex(this._gameContext.components[layer.key].container)
                    gameScene.addChildAt(item.container, index)
                    this._gameContext.components[layer.key].container.destroy()
                    this._gameContext.components[layer.key] = item
                }
            }
        }
    }


    _initConstructors (screenKey) {
        for (let i = 0; i < this._gameContext.constructorsData.length; i ++) {
            const elem = this._gameContext.constructorsData[i]
            if (elem.data.initState === screenKey) {
                this._gameContext.components[elem.key] = new elem.data.constructor(this._gameContext, elem.data)
            }
        }
    }
}


/**
 * @param {string} keyScreen - 'playScreen' || 'introScreen' || 'startScreen'
 * @param {string} typeAssets - 'textures' || 'spineAnimations'
 * @param {object} gameContext
 * @returns {{}}
 */
const getAssetsFromGameContext = (keyScreen, typeAssets, gameContext) => {
    const accumulatorAssets = {}

    const addResToAccum = objAssets =>
        objAssets[keyScreen] && Object.assign(accumulatorAssets, objAssets[keyScreen][typeAssets])


    const iterate = key => {
        for (let i = 0; i < gameContext[key].length; ++i) {

            if (gameContext.data.windowData.isIOSLess14 &&
                gameContext[key][i].data['assetsToLoad_iOS'] &&
                (typeAssets !== 'dragonAnimations' || 'audio')
            ) {
                addResToAccum(gameContext[key][i].data['assetsToLoad_iOS'])
            } else if (gameContext[key][i].data['assetsToLoad']) {
                addResToAccum(gameContext[key][i].data['assetsToLoad'])
            }
        }
    }


    iterate('layers')
    iterate('constructorsData')

    return accumulatorAssets
}



const checkIsIntroInLayers = layers => {
    for (let i = 0; i < layers.length; i ++) {
        if (layers[i].data.initState === 'introScreen') {
            return true;
        }
    }
    return false;
}


const isObjectEmpty = obj => !Object.keys(obj).length
