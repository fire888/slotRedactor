import * as StateMachine from 'javascript-state-machine'


// const checkerGiftSpin = resp => {
//     if (!resp.gift) return false;
//     return resp.gift.current_giftspin !== 0
// }


export class FreeStates {

    /**
     * @param {Object} gameContext
     */
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._config = config


        this._sm = new StateMachine({
            init: 'nothing',
            transitions: [{
                name: 'startIntro',
                from: ['nothing', 'checkWin', 'showWinLines', 'animationBonus'],
                to: 'introAnimation'

            }, {
                name: 'checkGiftSpinsEnd',
                from: ['showWinLines', 'checkWin'],
                to: 'checkerGiftSpinsEnd',
            }, {

                name: 'startPlay',
                from: ['nothing', 'introAnimation'],
                to:   'preparePlay'
            }, {
                name: 'next',
                from: ['showWinLines', 'animationBonus', 'introAnimation', 'preparePlay'],
                to:   'checkerGiftSpinsEnd',
            }, {
                name: 'next',
                from: 'checkerGiftSpinsEnd',
                to:   'pauseBeforeRotation',
            }, {
                name: 'next',
                from: ['pauseBeforeRotation'],
                to: 'wheelsRotation'
            }, {
                name: 'next',
                from: 'wheelsRotation',
                to: 'checkGiftSpins',
            }, {
                name: 'next',
                from: 'checkGiftSpins',
                to:   'stoppingWheels'
            }, {
                name: 'next',
                from: 'stoppingWheels',
                to:   'effectsAfterRotation'
            }, {
                name: 'next',
                from: 'effectsAfterRotation',
                to:   'checkWin'
            }, {
                name: 'noWin',
                from: 'checkWin',
                to:   'pauseBeforeRotation'
            }, {
                name: 'win',
                from: 'checkWin',
                to:   'superPrizeEffect'
            }, {
                name: 'next',
                from: 'superPrizeEffect',
                to:   'showWinLines'
            }, {
                name: 'winBonus',
                from: ['showWinLines', 'checkWin', 'checkEffects'],
                to:   'animationBonus'
            }, {
                name: 'startFinish',
                from: ['pauseBeforeRotation', 'preparePlay'],
                to:   'finishAnimation'
            }, {
                name: 'exit',
                from: 'finishAnimation',
                to:   'nothing'
            },],
            methods: {
                onEnterIntroAnimation:       this._onEnterIntroAnimation.bind(this),
                onEnterPreparePlay:          this._onEnterPreparePlay.bind(this),
                onEnterCheckerGiftSpinsEnd:  this._onEnterCheckerGiftSpinsEnd.bind(this),
                onEnterPauseBeforeRotation:  this._onEnterPauseBeforeRotation.bind(this),
                onEnterWheelsRotation:       this._onEnterWheelsRotation.bind(this),
                onEnterCheckGiftSpins:       this._onEnterCheckGiftSpins.bind(this),
                onEnterStoppingWheels:       this._onEnterStoppingWheels.bind(this),
                onEnterCheckWin:             this._onEnterCheckWin.bind(this),
                onEnterEffectsAfterRotation: this._onEnterEffectsAfterRotation.bind(this),
                onEnterSuperPrizeEffect:     this._onEnterSuperPrizeEffect.bind(this),
                onEnterShowWinLines:         this._onEnterShowWinLines.bind(this),
                onLeaveShowWinLines:         this._onLeaveShowWinLines.bind(this),
                onEnterAnimationBonus:       this._onEnterAnimationBonus.bind(this),
                onLeaveAnimationBonus:       this._onLeaveAnimationBonus.bind(this),
                onEnterFinishAnimation:      this._onEnterFinishAnimation.bind(this),
            }
        })

        this._introView = this._gameContext.components['freeIntroContainer']

        this._saveTotalSpinNum = 0
        this._callback = null
        this._timeStartedRotationMachine = null
        this._timers = {}

        this._addListeners()
    }


    _checkerGiftSpin (resp) {
        if (!resp.gift) return false;
        return resp.gift.current_giftspin !== 0
    }


    /**
     * Add Listeners from ui.
     * @private
     */
    _addListeners () {
        this._gameContext.components.eventEmitter.subscribe('clickSpin', () => {
            if (this._gameContext.data.currentStates !== 'freeStates') return;
            if (this._sm.state !== 'showWinLines') return;

            this._checkerNextStateAfterShowWinLines()
        })
    }


    _onEnterCheckerGiftSpinsEnd () {
        const { messageGiftSpins } = this._gameContext.components

        if (messageGiftSpins) {
            messageGiftSpins.checkIsEndGiftSpins()
                .then(this._sm['next'].bind(this._sm))
        } else {
            setTimeout(this._sm['next'].bind(this._sm), 0)
        }
    }



    /** ***********************************************
     *  ENTER / EXIT STATES
     **************************************************/

    /**
     * Enter to states.
     * @returns {Promise}
     */
    start () {
        const { serverResponse } = this._gameContext.data

        !this._checkerGiftSpin(serverResponse) && this._gameContext.components.ui.setWinValue('0.00')

        serverResponse.gameState === 'FREE_SPINS' || serverResponse.gameState === 'BONUS_GAME_END'
            ? this._sm['startPlay']()
            : this._sm['startIntro']()

        return new Promise(resolve => {
            this._callback = resolve
        })
    }


    /**
     * Exit from states.
     * @private
     */
    _exit () {
        this._saveTotalSpinNum = 0

        this._gameContext.components.eventEmitter.emit('freePlay', 'stop')

        this._sm['exit']()
        this._gameContext.data.serverResponse.gameState = null
        this._callback()
    }


    /**
     * Show intro.
     * @private
     */
    _onEnterIntroAnimation () {
        this._gameContext.components.ui.disableButtons()
        const { audioManager, helperSortData } = this._gameContext.components
        audioManager.loopAmbientStart('freeStates')


        const { isCustomAnimateSymbols } = this._config.config
        let hideBoxes = null
        if (isCustomAnimateSymbols) {
            const arr = this._gameContext.data.serverResponse.winLines.filter(item => item.lineType === 'SCATTER_LINE')
            hideBoxes = helperSortData.createWinsArrs(this._gameContext.data.serverResponse.wheels, arr, 0.8, 0)
            this._gameContext.components.slotMachine.renderSlots(hideBoxes[0])
        }

        this._introView.container.renderable = true
        this._gameContext.components.ui.setBigMes(this._gameContext.components.locale.getPhrase('Congratulations!'))

        if (this._gameContext.data.serverResponse.gameState === 'BONUS_IN_BONUS') this._introView.IN_BONUS = true

        this._introView.startScattersAnimation(this._gameContext.data.serverResponse, hideBoxes && hideBoxes[0])
            .then(() => {
                this._introView.container.renderable = false
                this._gameContext.components.slotMachine.renderSlots(helperSortData.createFilled(1))
                this._sm['startPlay']()
            })
    }


    /**
     * Show free states end message.
     * @private
     */
    _onEnterFinishAnimation () {
        const { audioManager, slotMachine, changerBalance, freeWidgets, gameScene, ui } = this._gameContext.components
        const { serverResponse } = this._gameContext.data
        audioManager.loopAmbientStop('freeStates')

        this._introView.container.renderable = true

        this._introView.startBackAnimation({
            totalFreeWin: serverResponse.additionalInfo.total_free_game_win,
            totalSpins: serverResponse.additionalInfo.total_free_spins,
        })
            .then(() => {

                ui.enableButtons()
                slotMachine.setLevelSymbols([
                    ['norm','norm', 'norm', 'norm'],
                    ['norm','norm', 'norm', 'norm'],
                    ['norm','norm', 'norm', 'norm'],
                    ['norm','norm', 'norm', 'norm'],
                    ['norm','norm', 'norm', 'norm']
                ])
                gameScene.removeChild(freeWidgets.container)

                freeWidgets.setCountSpins(0, 0)
                if (!this._checkerGiftSpin(serverResponse)) {
                    changerBalance.setBalance(serverResponse.currentBalance)
                    freeWidgets.setForceWin(0)
                }

                this._introView.IN_BONUS = false

                this._exit()
            })
    }


    /**
     * Prepare ui to loop rotations.
     * @private
     */
    _onEnterPreparePlay () {
        const { ui, eventEmitter, freeWidgets } = this._gameContext.components
        const { serverResponse } = this._gameContext.data

        this._introView.IN_BONUS = true

        ui.setBigMes()
        ui.disableButtons()
        eventEmitter.emit('freePlay', 'start')


        !this._checkerGiftSpin(serverResponse) && freeWidgets.setForceWin(serverResponse.additionalInfo.total_free_game_win)
        freeWidgets.container && gameScene.addChild(freeWidgets.container)

        setTimeout(this._sm['next'].bind(this._sm), 0)
    }


    /** ********************************************
     * ROTATION FUNCTIONS
     ***********************************************/

    /**
     * Check is next rotate or exit
     * @private
     */
    _onEnterPauseBeforeRotation () {
        if (this._gameContext.data.serverResponse.gameState === "BONUS_GAME_END") {
            setTimeout(this._sm['startFinish'].bind(this._sm), 250)
            return;
        }
        setTimeout(this._sm['next'].bind(this._sm), 250)
    }


    /**
     * Start rotation, send request to server.
     * @private
     */
    _onEnterWheelsRotation () {
        const { slotMachine, client, audioManager, eventEmitter, changerBet, } = this._gameContext.components

        this._gameContext.components.slotMachine.setLevelSymbols([
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm'],
        ])
        setTimeout(() => audioManager.play('reelsRotation'), 200)
        slotMachine.rotateSimple()
        //this.timeStartedRotationMachine = Date.now()
        this._saveTotalSpinNum = this._gameContext.data.serverResponse.additionalInfo.total_free_spins
        eventEmitter.emit('onEnterWheelsRotation', null)

        client.sendResponseWinCombination(changerBet.getDataToSend())
            .then(serverResponse =>  {
                this._gameContext.data.serverResponse = serverResponse
                eventEmitter.emit('globalDataAfterSpinFromSever', serverResponse)
                this._sm['next']()
            })
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
     * Rotate after response from server.
     * @private
     */
    _onEnterStoppingWheels () {
        const { slotMachine, eventEmitter, ui, helperSortData, freeWidgets } = this._gameContext.components
        const { serverResponse } = this._gameContext.data

        const { free_spins_count, total_free_spins } = serverResponse.additionalInfo

        this._gameContext.data.serverResponse.gameState !== 'BONUS_IN_BONUS'
            ? freeWidgets.setCountSpins(free_spins_count, total_free_spins)
            : freeWidgets.setCountSpins(free_spins_count, this._saveTotalSpinNum)

        const finisCombination = helperSortData.prepareFinishSymbols(serverResponse)
        slotMachine.setFinishCombinationsData(finisCombination)

        const { machineRotData, isEffect, columnsEffectData } = helperSortData.getTimesRotations(serverResponse)

        setTimeout(() => ui.toggleForceStopButton(true), 500)

        if (isEffect) eventEmitter.emit('onEnterStoppingWheels', columnsEffectData)
        slotMachine.startStopping(machineRotData)
            .then(() => {
                const { ui } = this._gameContext.components
                ui.toggleForceStopButton(false)

                this._sm['next']()
            })
    }


    /**
     * Must override if effects after rotation exists.
     * @private
     */
    _onEnterEffectsAfterRotation () {
        setTimeout(() => this._sm['next'](), 0)
    }


    /**
     * Check next state after rotation complete.
     * @private
     */
    _onEnterCheckWin () {
        setTimeout(() => {
            const { serverResponse } = this._gameContext.data
            if (serverResponse.gameState === 'BONUS_IN_BONUS') {
                if (serverResponse.winLines && serverResponse.winLines.length > 0) {
                    return this._sm['startIntro']()
                }
            }

            if (serverResponse.winLines && serverResponse.winLines.length === 0) {
                return this._sm['noWin']()
            }

            const arrSimpleWinLines = this._gameContext.data.serverResponse.winLines.filter(item =>
                item.lineType === "SIMPLE_LINE"
                || item.lineType === "SCATTER_LINE"
                || item.lineType === "WILD_X2_LINE"
                || item.lineType === "SIMPLE_WILD_LINE"
            )

            if (arrSimpleWinLines.length > 0) {
                // TODO: CHECK WIN SCATTER LINES
                return this._sm['win']()
            }

            const arrBonusWinLines = this._gameContext.data.serverResponse.winLines.filter(item => item.lineType === "BONUS_LINE")
            if (arrBonusWinLines.length > 0) {
                return this._sm['winBonus']()
            }
        }, 10)
    }


    /** ****************************************************
     *  WIN ANIMATION FUNCTIONS
     *******************************************************/


    _onEnterSuperPrizeEffect () {
        const { ui, superPrizeEffect, changerBalance } = this._gameContext.components
        const { serverResponse } = this._gameContext.data

        const superWinAnimationData = changerBalance.checkSuperWin()

        if (!superWinAnimationData) {
            setTimeout(this._sm['next'].bind(this._sm), 0)
        } else {
            superPrizeEffect.start(superWinAnimationData, serverResponse.totalWin)
                .then(() => {
                    ui.setBigMes(null)
                    if (!this._gameContext.data.serverResponse.gift) changerBalance.switchOldToNew()

                    this._sm['next']()
                })
        }
    }


    /**
     * Show win lines.
     * @private
     */
    _onEnterShowWinLines () {
        const { slotMachine, winLines, eventEmitter, audioManager, helperSortData, freeWidgets } = this._gameContext.components
        const { serverResponse } = this._gameContext.data

        const { fullTime, timesToStart, animationSymbolsByLine, levelSymbolsArrs, arrSimpleWinLines } =
            helperSortData.prepareFreeWinPerLinesData(this._gameContext)

        const checkWinScatters = helperSortData.checkScatterLine(serverResponse)
        checkWinScatters ? audioManager.play('scattersTrigger') : audioManager.play('winLine')

        let win = !this._checkerGiftSpin(serverResponse)
            ? serverResponse.additionalInfo.total_free_game_win - serverResponse.totalWin
            : serverResponse.gift.total_win - serverResponse.totalWin

        for (let i = 0; i < timesToStart.length; i ++) {
            this._timers[i] = setTimeout(() => {
                eventEmitter.emit('startAnimateLine', i)
                helperSortData.checkWildInLine(arrSimpleWinLines[i], this._gameContext.data.serverResponse.wheels) && audioManager.play('winLineWild')
                winLines.showLine(arrSimpleWinLines[i])

                win += arrSimpleWinLines[i].win
                freeWidgets.setForseWin(win)

                slotMachine.startWinAnimate(animationSymbolsByLine[i])
                slotMachine.setLevelSymbols(levelSymbolsArrs[i])
            }, timesToStart[i])
        }

        eventEmitter.emit('onEnterShowWinLines', null)

        this._timer = setTimeout(this._checkerNextStateAfterShowWinLines.bind(this), fullTime)

        this._afterEnterShowWinLines()
    }

    /**
     * Can be override.
     * @private
     */
    _afterEnterShowWinLines () {
        const { ui } = this._gameContext.components
        ui.enableButtons()
        ui.disableBet()
        ui.disableRules()
    }


    /**
     * Exit from show win lines.
     * @private
     */
    _onLeaveShowWinLines () {
        const { eventEmitter, slotMachine, winLines, ui, helperSortData, freeWidgets } = this._gameContext.components
        const { serverResponse } = this._gameContext.data

        clearTimeout(this._timer)
        for (let key in this._timers) {
            clearTimeout(this._timers[key])
        }

        const resultWin = !this._checkerGiftSpin(serverResponse)
            ? serverResponse.additionalInfo.total_free_game_win
            : serverResponse.gift.total_win

        freeWidgets.setForceWin(resultWin)

        ui.disableButtons()
        winLines.clearAll()
        slotMachine.startWinAnimate(helperSortData.createFilled(0))
        slotMachine.setLevelSymbols(helperSortData.createFilled('norm'))
        eventEmitter.emit('onLeaveShowWinLines', null)
    }


    /**
     * Checker next state after all wins.
     * @private
     */
    _checkerNextStateAfterShowWinLines () {
        const arrBonusWinLines = this._gameContext.data.serverResponse.winLines.filter(item => item.lineType === "BONUS_LINE")
        if (arrBonusWinLines.length > 0) {
            this._sm['winBonus']()
        } else {
            this._gameContext.data.serverResponse.gameState === 'BONUS_IN_BONUS' ? this._sm['startIntro']() : this._sm['next']()
        }
    }


    /**
     * Show bonuses.
     * @private
     */
    _onEnterAnimationBonus () {
        const { slotMachine, winLines, helperSortData } = this._gameContext.components
        const { SLOT_MACHINE_CONFIG } = this._gameContext.CONSTANTS
        const time = SLOT_MACHINE_CONFIG.ANIMATION_SYMBOLS['freeStates'].timeAnimationBonus
        const pause = SLOT_MACHINE_CONFIG.ANIMATION_SYMBOLS['freeStates'].pauseAfterLastBonusItem

        const arrBonusLines = this._gameContext.data.serverResponse.winLines.filter(item => item.lineType === "BONUS_LINE")
        const finisCombinationData = helperSortData.prepareFinishSymbols(this._gameContext.data.serverResponse)
        const arrMachineViews = helperSortData.createArrBonuses(finisCombinationData, arrBonusLines[0])


        const countSymbolsAnim = arrMachineViews.symbols.length

        slotMachine.setLevelSymbols(helperSortData.createFilled('bott'))
        for (let i = 0; i < countSymbolsAnim; i++) {
            setTimeout(() => {
                slotMachine.setLevelSymbolsSingle(arrMachineViews.arrCoordsInd[i][0], arrMachineViews.arrCoordsInd[i][1], 'top')
                slotMachine.setSymbolBackground(arrMachineViews.arrCoordsInd[i][0], arrMachineViews.arrCoordsInd[i][1], true)
                slotMachine.forceSetCombinationsData(arrMachineViews.symbols[i])
            }, time * i)
        }


        setTimeout(() => {
            slotMachine.startWinAnimate(arrMachineViews.animation)
            for (let i = 1; i < 11; i++) {
                setTimeout(() => {
                    winLines.showLine({ lineNumber: i, length: 5 })
                }, time * i / 2)
            }
        }, time * countSymbolsAnim)


        setTimeout(() => {
            winLines.clearAll()
            slotMachine.startWinAnimate(helperSortData.createFilled(0))
            this._gameContext.data.serverResponse.gameState === 'BONUS_IN_BONUS' ? this._sm['startIntro']() : this._sm['next']()
        }, time * countSymbolsAnim +  pause)
    }


    /**
     * Exit from show bonuses.
     * @private
     */
    _onLeaveAnimationBonus () {
        const { slotMachine, winLines, helperSortData, freeWidgets } = this._gameContext.components
        const { serverResponse } = this._gameContext.data

        const resultWin = !this._checkerGiftSpin(serverResponse)
            ? serverResponse.additionalInfo.total_free_game_win
            : serverResponse.gift.total_win

        freeWidgets.setForceWin(resultWin)

        setTimeout(slotMachine.removeSymbolsBackground.bind(slotMachine), 100)
        winLines.clearAll()
        slotMachine.startWinAnimate(helperSortData.createFilled(0))
    }
}

