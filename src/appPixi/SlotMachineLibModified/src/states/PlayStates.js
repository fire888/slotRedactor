import * as StateMachine from 'javascript-state-machine'
import * as String from '../helpers/string'




const transitions = [
    { name: 'startPlay', from: ['nothing', 'autoPlay', 'showTotalWin'],  to: 'placeBet' },
    { name: 'clickSpinBalanceOk', from: ['placeBet', 'showWinLines','showTotalWinWithoutAnim'],  to: 'wheelsRotation'},
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
    { name: 'superWin', from: 'showTotalWin', to: 'superPrizeEffect' },
    { name: 'next', from: ['showTotalWin', 'superPrizeEffect'], to: 'miniGame' },
    { name: 'toPlaceBet', from: 'miniGame', to: 'placeBet'},
    { name: 'next', from: 'miniGame', to: 'showWinLines' },
    { name: 'startFree', from: ['showTotalWin', 'autoPlay', 'placeBet', 'superPrizeEffect'], to: 'freeGame' },
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



export class PlayStates {
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
                onEnterShowTotalWinWithoutAnim: this._onEnterShowTotalWinWithoutAnim.bind(this),
                onLeaveShowTotalWinWithoutAnim: this._onLeaveShowTotalWinWithoutAnim.bind(this),
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
                onLeaveShowTotalWin: this._onLeaveShowTotalWin.bind(this),
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
            if (this._sm.state === 'showTotalWin') {
                this._sm['clickSkipAnim']()
                return;
            }
            if (!changerBalance.checkIsBetMoreBalance()) {
                this._sm['clickSpinBalanceOk']()
            }
        })
        eventEmitter.subscribe('closeWindowBetMoreBalance', () => {
            this._sm['closeBlockWindow']()
        })
        eventEmitter.subscribe('clickForceStop', () => {
            const {ui, slotMachine} = this._gameContext.components

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
        eventEmitter.subscribe('clickBetMobile', () => {
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
            setTimeout(() => {
                this._sm['closeBetSlider']()
            }, 50)
        })
        eventEmitter.subscribe('closeRules', () => {
            const {ui} = this._gameContext.components
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
            const { ui, changerBalance } = this._gameContext.components
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

            if (!this._gameContext.data.serverResponse.gift) changerBalance.substractBet()
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
                    this._gameContext.components.eventEmitter.emit('globalDataAfterSpinFromSever', serverResponse)
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
        const { slotMachine, eventEmitter, ui, helperSortData } = this._gameContext.components

        const finishCombination = helperSortData.prepareFinishSymbols(this._gameContext.data.serverResponse)
        slotMachine.setFinishCombinationsData(finishCombination)

        setTimeout(() => ui.toggleForceStopButton(true), this._gameContext.CONSTANTS.SLOT_MACHINE_CONFIG.ANIMATION_SLOTS.beginTween.duration)

        const { machineRotData, isEffect, columnsEffectData } = helperSortData.getTimesRotations(
            this._gameContext.data.serverResponse,
            Date.now() - this._timeStartedRotationMachine,
        )

        if (isEffect) eventEmitter.emit('onEnterStoppingWheels', columnsEffectData)

        slotMachine.startStopping(machineRotData)
            .then(() => {
                const { ui } = this._gameContext.components
                ui.toggleForceStopButton(false)

                this._sm['next']()
            })
    }


    /**
     * On rotation complete.
     * @private
     */
    _onLeaveStoppingWheels() {
        const { audioManager } = this._gameContext.components
        audioManager && audioManager.stop(['reelsRotation', 'longRotation'])
    }


    /**
     * Show effects after rotation and after complete it go to next state.
     * @private
     */
    _onEnterEffectsAfterRotation() {
        setTimeout(() => this._sm['next'](), 0)
    }


    /**
     * Check go to  win animation or start state.
     * @private
     */
    _onEnterCheckWin() {
        setTimeout(() => {
            const { serverResponse } = this._gameContext.data

            if (serverResponse.winLines && serverResponse.winLines.length > 0) {
                this._sm['win']()
            } else {
                this._sm['noWin']()
            }
        }, 10)
    }



    /** ************************************************
     *  WIN ANIMATION FUNCTIONS
     ************************************************* */

    /**
     * Total win animation.
     * @private
     */
    _onEnterShowTotalWin() {
        const { eventEmitter, slotMachine, winLines, ui, audioManager, helperSortData, changerBalance } = this._gameContext.components

        const strengthWin = changerBalance.getStrengthWin()
        let time = helperSortData.getTimeTotalWin(this._gameContext)
        strengthWin === 6 && (time = 4000)
        this._gameContext.data.showTotalWin.time = time
        const serverResponse = this._gameContext.data.serverResponse
        const winResponseData = {
            animationSymbolsAll: helperSortData.createAllWins(serverResponse.wheels, serverResponse.winLines, 0, 1),
            levelSymbols: helperSortData.createLevelSymbols(serverResponse.wheels, serverResponse.winLines),
            arrLines: serverResponse.winLines,
        }
        this._gameContext.data.winResponseData = winResponseData

        /** sound */
        audioManager && setTimeout(() => {
            helperSortData.checkWild(serverResponse.wheels, serverResponse.winLines) && audioManager.play('winLineWild')
            audioManager.play('winLine', strengthWin)
        }, 100)


        /** startAnimation */
        slotMachine.startWinAnimate(winResponseData.animationSymbolsAll)
        slotMachine.setLevelSymbols(winResponseData.levelSymbols)
        for (let i = 0; i < winResponseData.arrLines.length; i++) {
            winLines.showLine(winResponseData.arrLines[i])
        }

        /** show animation balance if no SuperWin */
        if (!changerBalance.checkSuperWin()) {
            ui.setBigMes(serverResponse.totalWin, changerBalance.getShowWinDurationByValue(serverResponse.totalWin, time) - 250)
        }


        eventEmitter.emit('startTotalWinAnimation', null)
        this._timer = setTimeout(() => this._checkerNextAfterTotalAnimation(), time)

        this._afterEnterShowTotalWin()
    }



    _afterEnterShowTotalWin () {
        const {  changerBalance, freeStates, ui } = this._gameContext.components

        /** check enable buttons */
        if (!changerBalance.checkSuperWin()) {
            if (freeStates) {
                this._gameContext.data.serverResponse.gameState !== 'BONUS_GAME_INTRO' && ui.enableButtons()
            }
        }
    }



    /**
     * On complete total win animation.
     * @private
     */
    _onLeaveShowTotalWin() {
        if (this._timer) clearTimeout(this._timer)

        const { slotMachine, ui, eventEmitter, winLines, audioManager, helperSortData, changerBalance } = this._gameContext.components
        const { serverResponse } = this._gameContext.data

        if (serverResponse.gift) {
            ui.setWinValue(serverResponse.gift.total_win)
        } else {
            changerBalance.switchOldToNew()
            ui.setWinValue(serverResponse.totalWin)
        }

        eventEmitter.emit('stopTotalWinAnimation', null)
        audioManager && audioManager.stopWin()
        winLines.clearAll()
        ui.setBigMes(null)
        slotMachine.startWinAnimate(helperSortData.createFilled(0))
        slotMachine.setLevelSymbols(helperSortData.createFilled('norm'))
    }


    /**
     * Pause after break total win animation to show full balance and start new rotation.
     * @private
     */
    _onEnterShowTotalWinWithoutAnim() {
        const { ui, eventEmitter, winLines, audioManager, changerBalance } = this._gameContext.components

        eventEmitter.emit('stopTotalWinAnimation', null)
        audioManager && audioManager.stopWin()
        winLines.clearAll()
        ui.disableButtons()
        const serverResponse = this._gameContext.data.serverResponse

        ui.setBigMes(serverResponse.totalWin, changerBalance.getShowWinDurationByValue(serverResponse.totalWin, 1))

        setTimeout(() => {
            !changerBalance.checkIsBetMoreBalance()
                ? this._sm['clickSpinBalanceOk']()
                : this._sm['clickBalanceNone']()
        }, 700)
    }


    /**
     * Exit from break pause.
     * @private
     */
    _onLeaveShowTotalWinWithoutAnim() {
        const { ui, slotMachine, helperSortData, freeStates } = this._gameContext.components

        slotMachine.setLevelSymbols(helperSortData.createFilled('norm'))
        freeStates && this._gameContext.data.serverResponse.gameState !== 'BONUS_GAME_INTRO' && ui.enableButtons()
    }


    /**
     * Check start miniGame or start FreeStates or show win per lines.
     * @private
     */
    _checkerNextAfterTotalAnimation () {
        const { changerBalance } = this._gameContext.components

        if (changerBalance.checkSuperWin()) {
            this._sm['superWin']()
        } else {
            this._checkerFreeStates()
        }
    }


    /**
     * Show super prize effect.
     * @private
     */
    _onEnterSuperPrizeEffect () {
        const { ui, superPrizeEffect, changerBalance } = this._gameContext.components
        const { serverResponse } = this._gameContext.data
        const superWinAnimationData = changerBalance.checkSuperWin()
        superPrizeEffect.start(superWinAnimationData, serverResponse.totalWin)
            .then(() => {
                if (!serverResponse.gift) {
                    ui.setWinValue(serverResponse.totalWin)
                    changerBalance.switchOldToNew()
                }
                ui.setBigMes(null)
                this._checkerFreeStates()
            })
    }



    _checkerFreeStates () {
        const { freeStates } = this._gameContext.components
        const serverResponse = this._gameContext.data.serverResponse

        if (freeStates && serverResponse.gameState === 'BONUS_GAME_INTRO') {
            this._sm['startFree']()
            return;
        }

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
        const { slotMachine, winLines, ui, eventEmitter, helperSortData } = this._gameContext.components


        const { fullTime, timesToStart } = helperSortData.getTimesWinLines(this._gameContext)
        this._gameContext.data.showWinLines.fullTime = fullTime
        this._gameContext.data.showWinLines.timesToStart = timesToStart

        const { serverResponse, winResponseData } = this._gameContext.data

        winResponseData.animationSymbolsByLine = helperSortData.createWinsArrs(serverResponse.wheels, serverResponse.winLines, 0, 1)
        winResponseData.levelSymbols = helperSortData.createLevelSymbolsArrs(serverResponse.wheels, serverResponse.winLines)


        const startAnimate = () => {
            for (let i = 0; i < serverResponse.winLines.length; i++) {
                this._timers[i] = setTimeout(() => {
                    eventEmitter.emit('startAnimateLine', i)
                    winLines.showLine(serverResponse.winLines[i])
                    ui.setBigMes(String.getWinText(serverResponse.winLines[i], serverResponse.totalWin));
                    slotMachine.startWinAnimate(winResponseData.animationSymbolsByLine[i])
                    slotMachine.setLevelSymbols(winResponseData.levelSymbols[i])
                }, timesToStart[i])
            }
            this._timer = setTimeout(startAnimate, fullTime)
        }

        startAnimate()

        ui.enableButtons()

        eventEmitter.emit('onEnterShowWinLines', null)

        this._gameContext.data.state = 'showWinLines'
    }


    /**
     * Exit from per lines win animation.
     * @private
     */
    _onLeaveShowWinLines() {
        const { eventEmitter, slotMachine, winLines, helperSortData } = this._gameContext.components

        if (this._timer) clearTimeout(this._timer)
        for (let key in this._timers) {
            clearTimeout(this._timers[key])
        }

        winLines.clearAll()
        slotMachine.startWinAnimate(helperSortData.createFilled(0))
        slotMachine.setLevelSymbols(helperSortData.createFilled('norm'))

        eventEmitter.emit('onLeaveShowWinLines', null)
        this._gameContext.data.state = null
    }



    /** **********************************************
     *  TO ANOTHER SETS STATES
     *************************************************/

    /**
     * Free game state.
     * @private
     */
    _onEnterFreeGame() {
        const { audioManager } = this._gameContext.components
        audioManager && audioManager.loopAmbientStop('playStates', 'noEnd')
        this._gameContext.data.currentStates = 'freeStates'
        this._gameContext.components.ui.disableAutoplay()
        this._gameContext.components.ui.disableButtons()


        //const { messageGiftSpins } = this._gameContext.components
        // messageGiftSpins && messageGiftSpins.changeWidgetsToFree(true)

        this._gameContext.components.freeStates.start()
            .then(() => {
                // messageGiftSpins && messageGiftSpins.changeWidgetsToFree(false)

                this._gameContext.data.currentStates = 'playStates'
                audioManager && audioManager.loopAmbientStart('playStates', 'noStart')
                this._gameContext.components.ui.enableAutoplay()
                this._sm['clickBet']()
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

