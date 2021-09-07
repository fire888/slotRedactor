import * as StateMachine from 'javascript-state-machine'
import { showWinLines } from './actions'


let saveServerResponseBeforeFreeSpins = null


const transitions = [
    { name: 'startPlay', from: ['nothing', 'autoPlay', 'showTotalWin', 'showWinLines'],  to: 'placeBet' },
    { name: 'clickSpinBalanceOk', from: ['placeBet', /*'showWinLines',*/ 'showTotalWinWithoutAnim'],  to: 'wheelsRotation'},
    { name: 'clickBetBalanceOk', from: ['placeBet', 'showWinLines', 'showTotalWin', 'betMoreBalanceBlockSpin', 'betSlider', 'freeGame'],  to: 'placeBet' },
    { name: 'clickBalanceNone', from: ['placeBet', 'showTotalWinWithoutAnim','showWinLines', 'showTotalWin', 'betMoreBalanceBlockSpin', 'betSlider'],  to: 'betMoreBalanceBlockSpin'},
    { name: 'clickSkipAnim', from: ['showTotalWin'],  to: 'showTotalWinWithoutAnim'},
    { name: 'openBlockWindow', from: 'betMoreBalanceBlockSpin', to: 'blockWindow'},
    { name: 'closeBlockWindow', from: 'blockWindow', to: 'betMoreBalanceBlockSpin'},
    { name: 'spinUnblockBalanceDone', from: 'betMoreBalanceBlockSpin',  to: 'placeBet' },

    { name: 'next', from: 'wheelsRotation', to: 'checkGiftSpins' },
    { name: 'next', from: 'checkGiftSpins', to: 'stoppingWheels' },

    { name: 'next', from: 'stoppingWheels', to: 'effectsAfterRotation' },
    { name: 'next', from: 'effectsAfterRotation', to: 'checkWin' },
    { name: 'noWin', from: 'checkWin', to: 'placeBet' },
    { name: 'showEffectsAfterRotation', from: 'checkWin', to: 'effectsAfterRotation' },
    { name: 'win', from: ['checkWin', 'effectsAfterRotation'], to: 'showTotalWin' },
    { name: 'superWin', from: ['checkWin', 'effectsAfterRotation'], to: 'superPrizeEffect' },
    { name: 'next', from: ['showTotalWin', 'superPrizeEffect'], to: 'miniGame' },
    { name: 'toPlaceBet', from: 'miniGame', to: 'placeBet'},
    { name: 'next', from: ['miniGame', 'freeGame'], to: 'showWinLines' },
    { name: 'startFree', from: ['checkWin', 'autoPlay', 'placeBet', ], to: 'freeGame' },
    { name: 'clickBet', from: ['showTotalWin', 'showWinLines', 'freeGame'], to: 'placeBet' },
    { name: 'openBetSlider', from: ['placeBet', 'betMoreBalanceBlockSpin'], to: 'betSlider' },
    { name: 'closeBetSlider', from: 'betSlider', to: 'placeBet' },
    { name: 'toAutoPlay', from: ['showWinLines', 'showTotalWin', 'placeBet'], to: 'autoPlay'},
]


const ChangerMessages = (ui, locale) => {
    const mess = ["Spin the wheels!", "Hold SPIN for Auto Play!"]
    let indexMess = 1
    let timer = null

    const tick = () => {
        indexMess = mess[indexMess + 1] ? indexMess + 1 : 0
        ui.setBigMes(locale.getPhrase(mess[indexMess]))

        timer = setTimeout(tick, 3000)
    }

    return {
        start: () => {
            timer && clearTimeout(timer)
            tick()
        },
        stop: () => {
            timer && clearTimeout(timer)
            timer = null
        },
    }
}


export class PlayStatesDrop {
    constructor(gameContext) {
        this._gameContext = gameContext
        this._timeStartedRotationMachine = null
        this._timers = {}
        this._timer = null

        const { app, ui, locale } = gameContext.components
        this._messagerPlaceBet = ChangerMessages(ui, locale, app)

        this._sm = new StateMachine({
            init: 'nothing',
            transitions,
            methods: {
                onEnterBlockWindow: this._onEnterBlockWindow.bind(this),
                onLeaveBlockWindow: this._onLeaveBlockWindow.bind(this),
                onEnterBetMoreBalanceBlockSpin: this._onEnterBetMoreBalanceBlockSpin.bind(this),
                onLeaveBetMoreBalanceBlockSpin: this._onLeaveBetMoreBalanceBlockSpin.bind(this),
                onEnterWheelsRotation: this._onEnterWheelsRotation.bind(this),
                onEnterCheckGiftSpins: this._onEnterCheckGiftSpins.bind(this),
                onEnterStoppingWheels: this._onEnterStoppingWheels.bind(this),
                onLeaveStoppingWheels: this._onLeaveStoppingWheels.bind(this),
                onEnterEffectsAfterRotation: this._onEnterEffectsAfterRotation.bind(this),
                onEnterCheckWin: this._onEnterCheckWin.bind(this),
                onEnterPlaceBet: this._onEnterPlaceBet.bind(this),
                onLeavePlaceBet: this._onLeavePlaceBet.bind(this),
                onEnterShowTotalWin: this._onEnterShowTotalWin.bind(this),
                onEnterSuperPrizeEffect: this._onEnterSuperPrizeEffect.bind(this),
                onEnterMiniGame: this._onEnterMiniGame.bind(this),
                onEnterShowWinLines: this._onEnterShowWinLines.bind(this),
                onLeaveShowWinLines: this._onLeaveShowWinLines.bind(this),
                onEnterBetSlider: this._onEnterBetSlider.bind(this),
                onLeaveBetSlider: this._onLeaveBetSlider.bind(this),
                onEnterFreeGame: this._onEnterFreeGame.bind(this),
                onEnterAutoPlay: this._onEnterAutoPlay.bind(this),
            }
        })

        this._createListeners()
    }

    start() {
        this._sm['startPlay']()
    }


    /**
     * Add listeners of clicks on ui.
     * @private
     */
    _createListeners() {
        const { eventEmitter, changerBalance } = this._gameContext.components
        eventEmitter.subscribe('clickSpin', () => {
            if (
                this._sm.state !== 'placeBet'
                && this._sm.state !== 'showTotalWin'
                && this._sm.state !== 'showWinLines'
                && this._sm.state !== 'betMoreBalanceBlockSpin'
            ) return;

            if (this._sm.state === 'betMoreBalanceBlockSpin') {
                this._sm['openBlockWindow']()
            }
            if (this._sm.state === 'showWinLines') {
                return;
            }
            if (changerBalance.checkIsBetMoreBalance()) {
                return;
            }

            this._sm['clickSpinBalanceOk']()
        })


        eventEmitter.subscribe('closeWindowBetMoreBalance', () => {
            this._sm['closeBlockWindow']()
        })


        eventEmitter.subscribe('clickForceStop', () => {
            if (this._sm.state !== 'stoppingWheels') return;

            const { ui, slotMachine } = this._gameContext.components

            ui.toggleForceStopButton(false)
            slotMachine.forceStopping()
        })


        eventEmitter.subscribe('betValueChanged', () => {
            !changerBalance.checkIsBetMoreBalance()
                ? this._sm['clickBetBalanceOk']()
                : this._sm['clickBalanceNone']()
        })
        eventEmitter.subscribe('clickMenu', mode => {
            const {rules} = this._gameContext.components
            rules.show(mode)
        })
        eventEmitter.subscribe('clickBetMobile', val => {
            if (this._gameContext.data.serverResponse.gift) return;

            if (this._sm.state === 'showTotalWin' || this._sm.state === 'showWinLines') {
                this._sm['clickBet']()
            }
            if (this._sm.state === 'betSlider') {
                return;
            }
            setTimeout(() => this._sm['openBetSlider'](), 50)
        })
        eventEmitter.subscribe('closeBetChoiseMobile', () => {
            if (this._sm.state !== 'betSlider') {
                return;
            }
            setTimeout(() => this._sm['closeBetSlider'](), 50)
        })
        eventEmitter.subscribe('closeRules', () => {
            const { ui } = this._gameContext.components
            ui.hideButtons(['menu-info', 'menu-rules', 'menu-settings'])
        })
        eventEmitter.subscribe('toggleAutoPlay', is => {
            if (!is || this._sm.state === 'autoPlay') {
                return;
            }
            if (!changerBalance.checkIsBetMoreBalance()) {
                this._sm.toAutoPlay()
            } else {
                eventEmitter.emit('hideButtonAutoPlay', null)
            }
        })
    }




    /** *************************************************
     *  POPUPS ( BLOCK WINDOWS, BET )
     ****************************************************/


    _onEnterBetSlider() {
        const { ui, eventEmitter, locale, changerBalance } = this._gameContext.components

        if (changerBalance.checkIsBetMoreBalance()) {
            eventEmitter.emit('toggleAlertSpin', true)
        }

        ui.showBetSlot()
        ui.hideButtons(['home', 'spin', 'bet', 'sound', 'menu', 'menu-info', 'menu-rules', 'menu-settings', 'fullScreen'])
        ui.setBigMes(locale.getPhrase("Choose a bet!"))
    }


    _onLeaveBetSlider() {
        const { ui, eventEmitter, locale, changerBalance } = this._gameContext.components

        if (!changerBalance.checkIsBetMoreBalance()) {
            eventEmitter.emit('toggleAlertSpin', false)
        }

        ui.closeBetSlot()
        ui.showButtons(['home', 'spin', 'bet', 'sound', 'menu', 'fullScreen'])
        ui.setBigMes(locale.getPhrase("Spin the wheels!"))
    }


    _onEnterBetMoreBalanceBlockSpin() {
        const { eventEmitter, ui } = this._gameContext.components

        ui.setBigMes(`Check balance!`)
        eventEmitter.emit('toggleAlertSpin', true)
    }


    _onLeaveBetMoreBalanceBlockSpin() {
        const { eventEmitter } = this._gameContext.components
        eventEmitter.emit('toggleAlertSpin', false)
    }

    _onEnterBlockWindow() {
        const { ui, changerBet } = this._gameContext.components

        ui.hideButtons(['menu-info', 'menu-rules', 'menu-settings'])
        ui.disableButtons()
        changerBet.showMessageLowBalance(this._gameContext)
    }


    _onLeaveBlockWindow() {
        const { ui } = this._gameContext.components

        ui.enableButtons()
    }





    /** *********************************************
     * ROTATION FUNCTIONS
     ************************************************/

    /**
     * Prepare standard screen before click rotation.
     * @private
     */
    _onEnterPlaceBet() {
        const funcPlaceBet = () => {
            const { ui, locale, changerBalance, eventEmitter } = this._gameContext.components
            const { gameState } = this._gameContext.data.serverResponse


            /** check by init state */
            if (
                gameState === 'FREE_SPINS' ||
                gameState === 'BONUS_GAME_END' ||
                gameState === 'BONUS_IN_BONUS' ||
                gameState === 'BONUS_GAME_INTRO'
            ) {
                return void setTimeout(() => this._sm['startFree']())
            }


            ui.enableButtons()


            if (!this._gameContext.data.serverResponse.gift) changerBalance.switchOldToNew()
            if (changerBalance.checkIsBetMoreBalance()) {
                setTimeout(this._sm['clickBalanceNone'].bind(this._sm), 0)
                return;
            }

            this._messagerPlaceBet.start()
            if (!this._gameContext.data.serverResponse.gift) ui.setWinValue('0.00')


            eventEmitter.emit('onEnterPlaceBet', null)
            this._gameContext.data.state = 'placeBet'
        }


        const { messageGiftSpins } = this._gameContext.components
        if (messageGiftSpins) {
            messageGiftSpins.checkIsEndGiftSpins()
                .then(funcPlaceBet)
        } else {
            setTimeout(funcPlaceBet, 0)
        }
    }



    /**
     * Exit from standard screen.
     * @private
     */
    _onLeavePlaceBet() {
        this._gameContext.data.state = null
        this._messagerPlaceBet.stop()
    }



    /**
     * Start wheels rotate, send request to server and after response go to next state.
     * @private
     */
    _onEnterWheelsRotation() {

        const wheelsRot = () => {
            const { slotMachine, client, ui, audioManager, locale, eventEmitter, changerBalance, changerBet } = this._gameContext.components

            !this._gameContext.data.serverResponse.gift && changerBalance.substractBet()
            ui.hideButtons(['menu-info', 'menu-rules', 'menu-settings'])


            if (!this._gameContext.data.serverResponse.gift) {
                ui.setWinValue('0.00')
            } else {
                ui.setWinValue(this._gameContext.data.serverResponse.gift.total_win)
            }

            ui.setBigMes(locale.getPhrase("Good luck!"))
            ui.disableButtons()
            audioManager && setTimeout(() => audioManager.play('reelsRotation'), 200)
            slotMachine.rotateSimple()
            this._timeStartedRotationMachine = Date.now()

            eventEmitter.emit('onEnterWheelsRotation', null)

            client.sendResponseWinCombination(changerBet.getDataToSend())
                .then(serverResponse => {
                    eventEmitter.emit('globalDataAfterSpinFromSever', serverResponse)
                    if (!this._gameContext.data.serverResponse.gift) changerBalance.setNewHidden(serverResponse.currentBalance)
                    this._gameContext.data.serverResponse = serverResponse
                    this._sm['next']()
                })
        }


        const { messageGiftSpins } = this._gameContext.components
        if (messageGiftSpins && this._gameContext.data.serverResponse.totalWin > 0) {
            messageGiftSpins.checkIsEndGiftSpins()
                .then(wheelsRot)
        } else {
            setTimeout(wheelsRot, 0)
        }
    }


    _onEnterCheckGiftSpins () {
        const { messageGiftSpins } = this._gameContext.components

        if (messageGiftSpins) {
            messageGiftSpins.checkIsStartGiftSpins()
                .then(this._sm['next'].bind(this._sm))
        } else {
            setTimeout(this._sm['next'].bind(this._sm), 0)
        }
    }



    /**
     * Allow slot machine rotation stopping after get request from server and after stopping go to next state.
     * @private
     */
    _onEnterStoppingWheels() {
        const { slotMachine, helperSortData, ui } = this._gameContext.components

        const finishCombination = helperSortData.prepareFinishSymbolsNotRan(this._gameContext.data.serverResponse)
        slotMachine.setFinishCombinationsData(finishCombination)

        ui.toggleForceStopButton(true)

        slotMachine.startStopping()
            .then(() => this._sm['next']())
    }



    /**
     * On rotation complete.
     * @private
     */
    _onLeaveStoppingWheels() {
        const { audioManager, ui } = this._gameContext.components

        ui.toggleForceStopButton(false)
        audioManager && audioManager.stop(['reelsRotation', 'longRotation'])
    }



    /**
     * Show effects after rotation and after complete it go to next state.
     * @private
     */
    _onEnterEffectsAfterRotation() {
        requestAnimationFrame(() => { setTimeout(() => this._sm['next'](), 0)})
    }



    /**
     * Check go to  win animation or start state.
     * @private
     */
    _onEnterCheckWin() {
        setTimeout(() => {
            const { serverResponse } = this._gameContext.data

            if ( serverResponse.gameState === 'BONUS_GAME_INTRO' ) {
                return this._sm['startFree']()
            }

            if (serverResponse.winLines && serverResponse.winLines.length > 0) {
                this._sm['win']()
            } else {
                this._sm['noWin']()
            }
        }, 0)
    }



    /** ************************************************
     *  WIN ANIMATION FUNCTIONS
     ************************************************* */

    /**
     * Total win animation.
     * @private
     */
    _onEnterShowTotalWin() {
        this._timer = setTimeout(() => this._checkerNextAfterTotalAnimation(), 0)
    }



    /**
     * Show super prize effect.
     * @private
     */
    _onEnterSuperPrizeEffect () {
        const { ui, superPrizeEffect, changerBalance } = this._gameContext.components
        const { serverResponse } = this._gameContext.data
        ui.enableButtons()
        const superWinAnimationData = changerBalance.checkSuperWin()
        superPrizeEffect.start(superWinAnimationData, serverResponse.totalWin)
            .then(() => {
                if (!serverResponse.gift) {
                    ui.setWinValue(serverResponse.totalWin)
                    changerBalance.switchOldToNew()
                }
                ui.setBigMes(null)
                this._checkerNextAfterTotalAnimation()
            })
    }


    /**
     * Check start miniGame or start FreeStates or show win per lines.
     * @private
     */
    _checkerNextAfterTotalAnimation () {
        this._sm['next']()
    }


    /**
     * Must be override if miniGame exist in project
     * @private
     */
    _onEnterMiniGame () {
        setTimeout(() => this._sm['next'](), 0)
    }



    /**
     * Show per lines win animation.
     * @private
     */
    _onEnterShowWinLines() {
        const { freeStates, ui } = this._gameContext.components
        ui.disableButtons()

        setTimeout(() => {
            showWinLines.call(this, () => {
                const serverResponse = this._gameContext.data.serverResponse

                if (freeStates && serverResponse.gameState === 'BONUS_GAME_INTRO') {
                    this._sm['startFree']()
                    return;
                }

                this._sm['startPlay']()
            })
        })
    }



    /**
     * Exit from per lines win animation.
     * @private
     */
    _onLeaveShowWinLines() {
        const { eventEmitter } = this._gameContext.components

        if (this._timer) clearTimeout(this._timer)
        for (let key in this._timers) {
            clearTimeout(this._timers[key])
        }
        eventEmitter.emit('onLeaveShowWinLines', null)
    }



    /** **********************************************
     *  TO ANOTHER SETS STATES
     *************************************************/

    /**
     * Free game state.
     * @private
     */
    _onEnterFreeGame() {
        const { audioManager, ui, freeStates, slotMachine } = this._gameContext.components
        const { serverResponse } = this._gameContext.data

        saveServerResponseBeforeFreeSpins = serverResponse
        audioManager.loopAmbientStop('playStates', 'noEnd')
        this._gameContext.data.currentStates = 'freeStates'
        ui.disableAutoplay()
        ui.disableButtons()
        freeStates.start()
            .then(() => {
                this._gameContext.data.currentStates = 'playStates'
                audioManager.loopAmbientStart('playStates', 'noStart')
                ui.enableAutoplay()

                if (saveServerResponseBeforeFreeSpins) {
                    const modifiedSaveResponse = modifyResponse(this._gameContext.data.serverResponse, saveServerResponseBeforeFreeSpins)
                    saveServerResponseBeforeFreeSpins = null
                    this._gameContext.data.serverResponse = modifiedSaveResponse
                    const finishCombination = prepareFinishSymbolsNotRan(this._gameContext.data.serverResponse)
                    slotMachine.forceSetCombinationsData(finishCombination)

                    this._sm['next']()
                } else {
                    this._sm['clickBet']()
                }
            })
    }

    /**
     * Set game in autoPlay states and resolve after complete.
     * @private
     */
    _onEnterAutoPlay() {
        this._gameContext.data.currentStates = 'autoPlayStates'

        this._gameContext.components.ui.disableButtons()
        this._gameContext.components.autoPlayStates.startPlay()
            .then(() => {
                if (this._gameContext.data.serverResponse.gameState === 'NORMAL_SPINS') {
                    this._gameContext.data.currentStates = 'playStates'
                    this._gameContext.components.ui.enableButtons()
                    this._sm['startPlay']()
                }

                if (this._gameContext.data.serverResponse.gameState === 'BONUS_GAME_INTRO') {
                    this._gameContext.data.currentStates = 'freeStates'
                    this._sm['startFree']()
                }
            })
    }
}


const modifyResponse = (currentResp, savedResp) => {
    savedResp.gameState = currentResp.gameState
    savedResp.currentBalance = currentResp.currentBalance
    savedResp.additionalInfo = currentResp.additionalInfo
    currentResp.gift && (savedResp.gift = currentResp.gift)
    return savedResp
}


export const prepareFinishSymbolsNotRan = resp => {
    let symbolsTypes = []
    for (let i = 0; i < resp.wheels.length; ++i) {
        const wheel = []
        for (let j = 0; j < 3; ++j) {
            wheel.push(resp.wheels[i][j])
        }
        symbolsTypes.push(wheel)
    }
    return symbolsTypes
}