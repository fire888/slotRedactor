import * as STRING from '../helpers/string'

export default class CanvasWigets {
    constructor (gameContext, config) {
        this._PIXI = gameContext.PIXI
        this._locale = gameContext.components.locale
        this._eventEmitter = gameContext.components.eventEmitter
        this._configTitles = config.config.UI_CANVAS_WIDGETS_CONFIG.titles
        this._configValues = config.config.UI_CANVAS_WIDGETS_CONFIG.values
        this._colors = gameContext.CONSTANTS.TEXT_STYLES.colors
        this._gameData = gameContext.data
        this._locale = gameContext.components.locale

        const backgroundValuesStyle = gameContext.CONSTANTS.TEXT_STYLES.backWidgets

        this._eventEmitter.subscribe('globalDataAfterSpinFromSever', response => {
            if (!response) return;
            this.setCurrency(response.currency)
        })

        this.container = new this._PIXI.Container()

        const titlesWidgets = new this._PIXI.TextStyle(gameContext.CONSTANTS.TEXT_STYLES.titlesWidgets)
        const textStyleBetValues = new this._PIXI.TextStyle(gameContext.CONSTANTS.TEXT_STYLES.valuesWidgets)
        const valuesWidgets = new this._PIXI.TextStyle(gameContext.CONSTANTS.TEXT_STYLES.valuesWidgets)
        this.styles = { titlesWidgets,  valuesWidgets, textStyleBetValues }

        this.titles = {}
        for (let i = 0; i < this._configTitles.length; i ++) {
            const data = this._configTitles[i]

            this.titles[data.key] = createText(data, this.styles[data.style], this._PIXI, this._locale)
            this.container.addChild(this.titles[data.key])
            this.titles[data.key].conf = data 

            var graphics = createRoundedRect(data, backgroundValuesStyle, this._PIXI)
            graphics.y = this._configValues[0].y
            this.container.addChild(graphics)
        }


        this.values = {}
        for (let i = 0; i < this._configValues.length; i ++) {
            const data = this._configValues[i]

            this.values[data.key] = createText(data, this.styles[data.style], this._PIXI, this._locale)
            this.container.addChild(this.values[data.key])
        }


        this._eventEmitter.subscribe('updateTotalBalance', () => {
            this.setTotalBalance(this._gameData.balance.value)
        })

        this._eventEmitter.subscribe('betValueChanged', () => {
            this.setBetValue(this._gameData.bet.currentBet)
            this.setLineValue(this._gameData.bet.lineValue)
        })
        this._eventEmitter.subscribe('toggleAlertSpin', is =>
            this.styles.textStyleBetValues.fill = is ? this._colors.alertColor : this._colors.baseColor)


        this.setCurrency(gameContext.data.currency)

        this._eventEmitter.subscribe('changeLanguage', () => {
            this.setCurrency(gameContext.data.currency)
        })
    }

    setWinValue (val) {
        this.values['win'].text = STRING.numberWithSpaces(val) 
    }

    setTotalBalance (val) {
        this.values['balance'].text = STRING.numberWithSpaces(val) 
    }

    setBetValue (val) {
        this.values['bet'].text = STRING.numberWithSpaces(val)
    } 

    setLineValue (val) {
        this.values['lines'].text = STRING.numberWithSpaces(val)
    }

    setCurrency (val) {
        this.titles['win'].text = this._locale.getPhrase('WIN') + '(' + val + ')'
        this.titles['balance'].text = this._locale.getPhrase('BALANCE') + '(' + val + ')'
        this.titles['bet'].text = this._locale.getPhrase('LINE BET / TOTAL BET') + '(' + val + ')'
    }
}

const createText = (data, style, PIXI, locale) => {
    const text = new PIXI.Text(locale.getPhrase(data['label']), style)
    text.roundPixels = true
    text.anchor.set(0.5)
    text.x = data.x
    text.y = data.y
    return text
}

const createRoundedRect = (data, { color, alpha, radius }, PIXI) => {
    const graphics = new PIXI.Graphics()
    graphics.beginFill(color, alpha)
    graphics.drawRoundedRect(-(data.widthBack / 2), -radius, data.widthBack, radius * 2, radius)
    graphics.endFill()
    graphics.x = data.x
    graphics.cacheAsBitmap = true
    return graphics
}