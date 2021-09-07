import * as StateMachine from 'javascript-state-machine'
import * as String from '../helpers/string'


export class AutoPlayStates {
    /**
     * @param {Object} gameContext
     */
    constructor(gameContext) {
        this._gameContext = gameContext
        this._resolveStates = null
        this._timeStartedRotationMachine = null
        this._timer = null
        this._timers = {}

        this._sm = new StateMachine({
            init: 'nothing',
            transitions: [{
                    name: 'delayBeforeWheelsRotationAUTO',
                    from: ['nothing', 'checkWin', 'showWinLines', 'showTotalWin'],
                    to: 'checkBalance'
                }, {
                    name: 'balanceOkAUTO',
                    from: 'checkBalance',
                    to: 'wheelsRotation'
                }, {
                    name: 'next',
                    from: 'wheelsRotation',
                    to: 'checkGiftSpins'
                }, {
                    name: 'next',
                    from: 'checkGiftSpins',
                    to: 'stoppingWheels'
                }, {
                    name: 'nextAUTO',
                    from: 'stoppingWheels',
                    to: 'effectsAfterRotation'
                }, {
                    name: 'nextAUTO',
                    from: 'effectsAfterRotation',
                    to: 'checkWin'
                },
                {   name: 'noWinAUTO',
                    from: 'checkWin',
                    to: 'checkBalance'
                },
                {   name: 'showEffectsAfterRotationAUTO',
                    from: 'checkWin',
                    to: 'effectsAfterRotation'
                }, {
                    name: 'winAUTO',
                    from: ['checkWin', 'effectsAfterRotation'],
                    to: 'showTotalWin'
                }, {
                    name: 'winSuperAUTO',
                    from: ['checkWin', 'effectsAfterRotation'],
                    to: 'superPrizeEffect'
                }, {
                    name: 'completeShowTotalWinAUTO',
                    from: ['showTotalWin', 'superPrizeEffect'],
                    to: 'showWinLines',
                }, {
                    name: 'exitPlayAUTO',
                    from: ['showWinLines', 'showTotalWin', 'checkBalance'],
                    to: 'nothing'
            },],
            methods: {
                onEnterCheckBalance: this._onEnterCheckBalance.bind(this),
                onEnterWheelsRotation: this._onEnterWheelsRotation.bind(this),
                onEnterCheckGiftSpins: this._onEnterCheckGiftSpins.bind(this),
                onEnterStoppingWheels: this._onEnterStoppingWheels.bind(this),
                onEnterCheckWin: this._onEnterCheckWin.bind(this),
                onEnterEffectsAfterRotation: this._onEnterEffectsAfterRotation.bind(this),
                onEnterShowTotalWin: this._onEnterShowTotalWin.bind(this),
                onLeaveShowTotalWin: this._onLeaveShowTotalWin.bind(this),
                onEnterSuperPrizeEffect: this._onEnterSuperPrizeEffect.bind(this),
                onEnterShowWinLines: this._onEnterShowWinLines.bind(this),
                onLeaveShowWinLines: this._onLeaveShowWinLines.bind(this),
            }
        });

        this._createListeners()
    }


    /**
     * Create listeners.
     * @private
     */
    _createListeners() {
        const { eventEmitter } = this._gameContext.components

        eventEmitter.subscribe('toggleAutoPlay',
            is => !is && (this._gameContext.data.autoPlayModeMustExit = true))
    }


    /** *****************************************************
     *  ENTER/EXIT STATES
     *******************************************************/

    /**
     * Start states.
     * @returns {Promise}
     */
    startPlay() {
        return new Promise(resolve => {
            this._resolveStates = resolve
            this._sm['delayBeforeWheelsRotationAUTO']()
        })
    }


    /**
     * Exit from states, reset param 'mustExit'.
     * @private
     */
    _stopPlay() {
        setTimeout(() => {
            this._gameContext.data.autoPlayModeMustExit = false
            this._sm['exitPlayAUTO']()
            setTimeout(() => {
                this._gameContext.components.eventEmitter.emit('hideButtonAutoPlay', null)
                this._resolveStates()
            }, 5)
        }, 0)
    }


    /** *************************************
     * ROTATE FUNCTIONS
     ***************************************/

    /**
     * Check game to next auto rotation or exit.
     * @private
     */
    _onEnterCheckBalance() {
        const newBalance = this._gameContext.data.balance.newHiddenValue
        !this._gameContext.data.serverResponse.gift && !!newBalance && this._gameContext.components.changerBalance.switchOldToNew()

        this._gameContext.components.freeStates
        && this._gameContext.data.serverResponse
        && this._gameContext.data.serverResponse.gameState === 'BONUS_GAME_INTRO'
        && (this._gameContext.data.autoPlayModeMustExit = true)

        if (this._gameContext.data.autoPlayModeMustExit) {
            this._stopPlay()
            return;
        }

        if (this._gameContext.components.changerBalance.checkIsBetMoreBalance()) {
            this._stopPlay()
            return
        }

        setTimeout(this._sm['balanceOkAUTO'].bind(this._sm), 5)
    }


    /**
     * Start rotation, send request to server.
     * @private
     */
    _onEnterWheelsRotation() {
        const wheelsRot = () => {

            const {slotMachine, client, ui, audioManager, locale, eventEmitter, changerBalance, changerBet} = this._gameContext.components

            setTimeout(() => audioManager.play('reelsRotation'), 200)

            !this._gameContext.data.serverResponse.gift && changerBalance.substractBet()
            ui.hideButtons(['menu-info', 'menu-rules'])
            !this._gameContext.data.serverResponse.gift && ui.setWinValue('0.00')
            ui.setBigMes(locale.getPhrase(`Good luck!`))
            ui.disableButtons()
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
        if (messageGiftSpins) {
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
     * Rotation after server response.
     * @private
     */
    _onEnterStoppingWheels() {
        const {slotMachine, eventEmitter, helperSortData} = this._gameContext.components

        const finisCombination = helperSortData.prepareFinishSymbols(this._gameContext.data.serverResponse)
        slotMachine.setFinishCombinationsData(finisCombination)

        const {machineRotData, isEffect, columnsEffectData} = helperSortData.getTimesRotations(
            this._gameContext.data.serverResponse,
            Date.now() - this._timeStartedRotationMachine,
        )

        if (isEffect) eventEmitter.emit('onEnterStoppingWheels', columnsEffectData)
        slotMachine.startStopping(machineRotData)
            .then(this._sm['nextAUTO'].bind(this._sm))
    }


    /**
     * Show effects after rotation.
     * @private
     */
    _onEnterEffectsAfterRotation() {
        setTimeout(() => this._sm['nextAUTO'](), 0)
    }


    /**
     * Check win and chow win animation or go to start.
     * @private
     */
    _onEnterCheckWin() {
        setTimeout(() => {
            const { serverResponse } = this._gameContext.data

            if (serverResponse.winLines && serverResponse.winLines.length > 0) {
                this._gameContext.components['changerBalance'].checkSuperWin()
                    ? this._sm['winSuperAUTO']()
                    : this._sm['winAUTO']()
            } else {
                this._sm['noWinAUTO']()
            }
        }, 0)
    }



    /** ****************************************
     * WIN ANIMATION
     ******************************************/

    /**
     * Show total win animation.
     * @private
     */
    _onEnterShowTotalWin() {
        const {serverResponse} = this._gameContext.data
        const {slotMachine, winLines, ui, audioManager, eventEmitter, helperSortData, changerBalance} = this._gameContext.components

        if (serverResponse.gameState === 'BONUS_GAME_INTRO') {
            this._gameContext.components.ui.disableButtons()
        }

        const winResponseData = {
            animationSymbolsAll: helperSortData.createAllWins(serverResponse.wheels, serverResponse.winLines, 0, 1),
            levelSymbols: helperSortData.createLevelSymbols(serverResponse.wheels, serverResponse.winLines),
            arrLines: serverResponse.winLines,
        }

        this._gameContext.data.winResponseData = winResponseData


        const strengthWin = changerBalance.getStrengthWin()

        let time = helperSortData.getTimeTotalWin(this._gameContext)
        strengthWin === 6 && (time = 6000)
        this._gameContext.data.showTotalWin.time = time

        eventEmitter.emit('startTotalWinAnimation', null)

        setTimeout(() => {
            if (strengthWin === 6) {
                audioManager.play('scattersTrigger', time - 1300)
            } else {
                audioManager.play('winLine', strengthWin)
            }
        }, 100)

        slotMachine.startWinAnimate(winResponseData.animationSymbolsAll)
        slotMachine.setLevelSymbols(winResponseData.levelSymbols)
        for (let i = 0; i < winResponseData.arrLines.length; i++) {
            winLines.showLine(winResponseData.arrLines[i])
        }
        !this._gameContext.data.serverResponse.gift && changerBalance.switchOldToNew()
        !this._gameContext.data.serverResponse.gift && ui.setWinValue(serverResponse.totalWin)
        ui.setBigMes(serverResponse.totalWin, changerBalance.getShowWinDurationByValue(serverResponse.totalWin, time) - 250)

        this._timer = setTimeout(() => {  this._checkerNextAfterTotalAnimation() }, time)
    }



    /**
     * Check next state after shoe total win.
     * @private
     */
    _checkerNextAfterTotalAnimation () {
        if (this._gameContext.components.autoPlayModeMustExit === true) {
            this._stopPlay()
        } else {
            this._sm['completeShowTotalWinAUTO']()
        }
    }


    /**
     * Exit from total win animation.
     * @private
     */
    _onLeaveShowTotalWin() {
        if (this._timer) clearTimeout(this._timer)

        const { slotMachine, winLines, ui, eventEmitter, helperSortData , changerBalance} = this._gameContext.components
        const { serverResponse } = this._gameContext.data

        if (serverResponse.gift) {
            ui.setWinValue(serverResponse.gift.total_win)
        } else {
            changerBalance.switchOldToNew()
            ui.setWinValue(serverResponse.totalWin)
        }

        eventEmitter.emit('stopTotalWinAnimation', null)

        winLines.clearAll()
        ui.setBigMes(null)
        slotMachine.startWinAnimate(helperSortData.createFilled(0))
        slotMachine.setLevelSymbols(helperSortData.createFilled('norm'))
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
                this._checkerNextAfterTotalAnimation()
            })
    }


    /**
     * Show win animation per line.
     * @private
     */
    _onEnterShowWinLines() {
        const {slotMachine, winLines, ui, eventEmitter, audioManager, helperSortData} = this._gameContext.components
        const { winResponseData, serverResponse } = this._gameContext.data

        serverResponse.gift && ui.setWinValue(serverResponse.gift.total_win)

        const {fullTime, timesToStart} = helperSortData.getTimesWinLines(this._gameContext)
        this._gameContext.data.showWinLines.fullTime = fullTime
        this._gameContext.data.showWinLines.timesToStart = timesToStart


        winResponseData.animationSymbolsByLine = helperSortData.createWinsArrs(serverResponse.wheels, serverResponse.winLines, 0, 1)
        winResponseData.levelSymbols = helperSortData.createLevelSymbolsArrs(serverResponse.wheels, serverResponse.winLines)


        const startAnimate = () => {
            for (let i = 0; i < serverResponse.winLines.length; i++) {
                this._timers[i] = setTimeout(() => {
                    helperSortData.checkWildInLine(serverResponse.winLines[i], this._gameContext.data.serverResponse.wheels) && audioManager.play('winLineWild')
                    eventEmitter.emit('startAnimateLine', i)
                    winLines.showLine(serverResponse.winLines[i])
                    ui.setBigMes(String.getWinText(serverResponse.winLines[i], serverResponse.totalWin))
                    slotMachine.startWinAnimate(winResponseData.animationSymbolsByLine[i])
                    slotMachine.setLevelSymbols(winResponseData.levelSymbols[i])
                }, timesToStart[i])
            }
            this._timer = setTimeout(
                () => {
                    if (this._gameContext.data.autoPlayModeMustExit === true) {
                        this._stopPlay()
                        return;
                    } else {
                        this._sm['delayBeforeWheelsRotationAUTO']()
                    }
                },
                fullTime + 5
            )
        }

        startAnimate()
        eventEmitter.emit('onEnterShowWinLines', null)
    }


    /**
     * Exit from win animation per line.
     * @private
     */
    _onLeaveShowWinLines() {
        if (this._timer) clearTimeout(this._timer)
        for (let key in this._timers) {
            clearTimeout(this._timers[key])
        }

        const {slotMachine, winLines, eventEmitter, helperSortData} = this._gameContext.components
        eventEmitter.emit('onLeaveShowWinLines', null)

        winLines.clearAll()
        slotMachine.startWinAnimate(helperSortData.createFilled(0))
        slotMachine.setLevelSymbols([
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm']
        ])
    }
}
