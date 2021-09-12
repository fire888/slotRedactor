import HtmlUi from '../elementsHTML/HtmlUi'
import BottomWidgets from '../elementsCanvas/WidgetsBottom'
import CanvasControls from '../elementsCanvas/Controls'
import CentralMessage from '../elementsCanvas/WidgetCentralMessage'



export class Ui {
    constructor(gameContext, config) {
        this._gameContext = gameContext
        this._eventEmitter = gameContext.components.eventEmitter
        this.isDesktop = gameContext.data.windowData.deviceMode === 'desktop'

        this.canvasContainer = new gameContext.PIXI.Container()
        this.container = this.canvasContainer

        this.centralMessage = new CentralMessage(gameContext, config)
        this.canvasContainer.addChild(this.centralMessage.container)

        if (!this.isDesktop) {
            this.htmlUi = new HtmlUi(gameContext, config)
        } else {
            this.wigetsCanvas = new BottomWidgets(gameContext, config)
            this.canvasContainer.addChild(this.wigetsCanvas.container)

            this.controlsCanvas = new CanvasControls(gameContext, config)
            this.canvasContainer.addChild(this.controlsCanvas.container)
        }

        this.setTotalBalance(gameContext.data.balance.value)
        this.setBetValue(gameContext.data.bet.lineValue, gameContext.data.bet.currentBet)

        gameContext.components.deviceResizer.setElementToResize({
            key: 'ui',
            container: this.canvasContainer,
            config: config.showModes
        })
    }

    showAllUi(is) {
        if (this.htmlUi) {
            if (is) {
                this.htmlUi.showControls()
                this._gameContext.components.deviceResizer.resize()
            } else {
                this.htmlUi.hideControls()
            }
        }
        this.canvasContainer.renderable = is
    }

    setBigMes(text, duration, isNoPlayAudio) {
        this.centralMessage.setText(text, duration, isNoPlayAudio)
    }

    setWinValue(val) {
        if (this.isDesktop) {
            this.wigetsCanvas.setWinValue(val)
        } else {
            this.htmlUi.setWinValue(val)
        }
    }

    setTotalBalance(val) {
        this._totalBalance = val
        if (this.isDesktop) {
            this.wigetsCanvas.setTotalBalance(this._totalBalance)
        } else {
            this.htmlUi.setTotalBalance(this._totalBalance)
        }
    }

    setBetValue (valLine, valBet) {
        if (this.isDesktop) {
            this.wigetsCanvas.setLineValue(valLine)
            this.wigetsCanvas.setBetValue(valBet)
        } else {
            this.htmlUi.setBetValue(valBet)
        }
    }


    redraw () {
        this.htmlUi.redraw()
    }

    //////////////////////

    enableButtons () {
        if (this.isDesktop) {
            this.controlsCanvas.enable()
            this._gameContext.components['keyboard'] && this._gameContext.components['keyboard'].toggleEnableAll(true)
        } else {
            this.htmlUi.enable()
        }
    }

    disableButtons () {
        if (this.isDesktop) {
            this.controlsCanvas.disable()
            this._gameContext.components['keyboard'] && this._gameContext.components['keyboard'].toggleEnableAll(false)
        } else {
            this.htmlUi.disable()
        }
    }


    disableBet () {
        if (this.isDesktop) {
            this.controlsCanvas.disableBet()
        } else {
            this.htmlUi.disableBet()
        }
    }


    disableRules () {
        if (this.isDesktop) {
            this.controlsCanvas.disableRules()
        } else {
            this.htmlUi.disableRules()
        }
    }


    disableAutoplay () {
        if (this.isDesktop) {
            this.controlsCanvas.disableAutoplay()
            this._gameContext.components['keyboard'] &&
                this._gameContext.components['keyboard'].toggleAutoPlay(false)
        } else {
            this.htmlUi.disableAutoplay()
        }
    }


    enableAutoplay () {
        if (this.isDesktop) {
            this.controlsCanvas.enableAutoplay()
            this._gameContext.components['keyboard'] &&
                this._gameContext.components['keyboard'].toggleAutoPlay(true)
        } else {
            this.htmlUi.enableAutoplay()
        }
    }


    showButtons(arr) {
        if (this.isDesktop) {
        } else {
            this.htmlUi.showButtons(arr)
        }
    }

    hideButtons(arr) {
        if (this.isDesktop) {
        } else {
            this.htmlUi.hideButtons(arr)
        }
    }

    showBetSlot () {
        if (this.isDesktop) {
        } else {
            this.htmlUi.showBetSlot()
        }
    }

    closeBetSlot () {
        if (this.isDesktop) {
        } else {
            this.htmlUi.hideBetSlot()
        }
    }

    toggleForceStopButton (val) {
        if (this.isDesktop) {
            this.controlsCanvas.toggleForceStopButton(val)
            this._gameContext.components['keyboard'] &&
                this._gameContext.components['keyboard'].toggleEnableByKey('stopForce', val)
        } else {
            this.htmlUi.toggleForceStopButton(val)
        }
    }

    /** new **************************************/

    disableAllControls () {
        if (this.isDesktop) {
            this.controlsCanvas.disable()
            this._gameContext.components['keyboard'] && this._gameContext.components['keyboard'].toggleEnableAll(false)
        } else {
            this.htmlUi.disableAllControls()
        }
    }

    disableControls(arr) {
        this.htmlUi && this.htmlUi.disableControls(arr)
    }

    enableAllControls () {
        if (this.isDesktop) {
            this.controlsCanvas.enable()
            this._gameContext.components['keyboard'] && this._gameContext.components['keyboard'].toggleEnableAll(true)
        } else {
            this.htmlUi.enableAllControls()
        }
    }


    enableControls(arr) {
        if (this.isDesktop) {
            for (let i = 0; i < arr.length; ++i) {
                if (arr[i] === 'spin') {
                    this.enableButtons()
                    this.controlsCanvas.disableBet()
                }
            }
        } else {
            this.htmlUi.enableControls(arr)
        }
    }
}