import * as StateMachine from 'javascript-state-machine'
// import * as String from '../helpers/string'
import { showWinLines } from './actions'

export class AutoPlayStatesDrop {
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
                name: 'spinResponseAUTO',
                from: 'wheelsRotation',
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
                from: ['checkWin', 'effectsAfterRotation', 'superPrizeEffect'],
                to: 'showWinLines'
            }, {
                name: 'winSuperAUTO',
                from: ['checkWin', 'effectsAfterRotation'],
                to: 'superPrizeEffect'
            },{
                name: 'exitPlayAUTO',
                from: ['showWinLines', 'checkBalance', 'checkWin'],
                to: 'nothing'
            },],
            methods: {
                onEnterCheckBalance: this._onEnterCheckBalance.bind(this),
                onEnterWheelsRotation: this._onEnterWheelsRotation.bind(this),
                onEnterCheckGiftSpins: this._onEnterCheckGiftSpins.bind(this),
                onEnterStoppingWheels: this._onEnterStoppingWheels.bind(this),
                onEnterCheckWin: this._onEnterCheckWin.bind(this),
                onEnterEffectsAfterRotation: this._onEnterEffectsAfterRotation.bind(this),
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
                    !serverResponse.gift && changerBalance.setNewHidden(serverResponse.currentBalance)
                    this._gameContext.data.serverResponse = serverResponse
                    this._gameContext.components.eventEmitter.emit('globalDataAfterSpinFromSever', serverResponse)
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

        const finisCombination = helperSortData.prepareFinishSymbolsNotRan(this._gameContext.data.serverResponse)
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
            const {serverResponse} = this._gameContext.data

            if ( serverResponse.gameState === 'BONUS_GAME_INTRO' ) {
                return this._stopPlay()
            }


            if (serverResponse.winLines && serverResponse.winLines.length > 0) {
                this._sm['winAUTO']()
            } else {
                this._sm['noWinAUTO']()
            }
        }, 0)
    }



    /** ****************************************
     * WIN ANIMATION
     ******************************************/


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
                !serverResponse.gift && ui.setWinValue(serverResponse.totalWin)
                ui.setBigMes(null)
                !serverResponse.gift && changerBalance.switchOldToNew()
                this._checkerNextAfterTotalAnimation()
            })
    }


    /**
     * Check next state after shoe total win.
     * @private
     */
    _checkerNextAfterTotalAnimation () {
        if (this._gameContext.components.autoPlayModeMustExit === true) {
            this._stopPlay()
        } else {
            this._sm['winAUTO']()
        }
    }


    /**
     * Show win animation per line.
     * @private
     */
    _onEnterShowWinLines() {
        showWinLines.call(this, () =>
                this._gameContext.data.autoPlayModeMustExit
                    ? this._stopPlay()
                    : this._sm['delayBeforeWheelsRotationAUTO']())
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

        const { eventEmitter } = this._gameContext.components
        eventEmitter.emit('onLeaveShowWinLines', null)
    }
}
