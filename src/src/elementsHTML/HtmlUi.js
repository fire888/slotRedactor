import '../stylesheets/htmlUi.css'
import { HtmlUiControls } from './HtmlUiControls'
import { HtmlUiWidgets } from './Widgets'
import { BetSlot } from './BetSlot'


export default class HtmlUi {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._eventEmitter = gameContext.components.eventEmitter

        this.controls = new HtmlUiControls(gameContext, config)
        this.wigets = new HtmlUiWidgets(gameContext)
        this.betSlot = new BetSlot(gameContext)
    }

    /** controls method ****************************/

    hideControls () {
        this.controls.hide()
    }

    showControls () {
        this.controls.show()
    }

    disable() {
        this.controls.disable()
    }

    enable() {
        this.controls.enable()
    }

    disableAutoplay () {
        this.controls.disableAutoplay()
    }

    enableAutoplay () {
        this.controls.enableAutoplay()
    }

    disableBet () {
        this.controls.disableBet()
    }

    disableRules () {
        this.controls.disableRules()
    }

    hideButtons (arr) {
        this.controls.hide(arr)
    }

    showButtons (arr) {
        this.controls.show(arr)
    }

    showBetSlot () {
        this.betSlot.show()
    }

    hideBetSlot () {
        this.betSlot.hide()
    }

    toggleForceStopButton (val) {
        this.controls.toggleForceStopButton(val)
    }


    /** new **************************************/

    disableAllControls () {
        this.controls.disableAllControls()
    }

    disableControls(arr) {
        this.controls.disableControls(arr)
    }

    enableAllControls () {
        this.controls.enableAllControls()
    }


    enableControls(arr) {
        this.controls.enableControls(arr)
    }



    /** widgets ************************************/

    setTotalBalance (newBalance) {
        this.wigets.setTotalBalance(newBalance)
    }

    setWinValue (val) {
        this.wigets.setWinValue(val)
    }

    setBetValue (val) {
        this.wigets.setBetValue(val)
    }



    redraw () {
        this.wigets.redraw()
    }
}