export class WidgetFreeBottomValues {
    constructor (gameContext) {
        this.gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this._locale = gameContext.components.locale

        this._ui = gameContext.components.ui

        // this.win = {
        //     val: 0,
        //     winCurrentSpin: 0,
        // }

        // TODO: REMOVE MISTAKE WORD
        this.setForseWin = this.setForceWin
    }


    setCountSpins (num, numFull) {
        this._ui.setBigMes(`${ this._locale.getPhrase('Free spin') } ${ num } ${ this._locale.getPhrase('of') } ${ numFull }`)
    }

    // TODO: REMOVE METHOD
    animateWinTo (val, duration = null) {
        this._ui.setWinValue(val)
        //this.win.val += val
        //this._ui.setWinValue(this.win.val)
        //if (!this.gameContext.data.serverResponse.gift)
    }

    setForceWin (val) {
        this._ui.setWinValue(val)
        //this.win.val = +val
        //this._ui.setWinValue(this.win.val)
        //if (!this.gameContext.data.serverResponse.gift) this._ui.setWinValue(this.win.val)
    }
}