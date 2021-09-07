import * as TWEEN from '../helpers/tween'
import * as STRING from '../helpers/string'


export default class CentralMessage {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._locale = gameContext.components.locale
        this._PIXI = gameContext.PIXI
        this._eventEmitter = gameContext.components.eventEmitter
        this._config = config
        this.container = new gameContext.PIXI.Container()
        this.container.y = this._config.config.UI_CANVAS_WIDGETS_CONFIG.mainMessage.offsetY


        const { background } = this._config.config.UI_CANVAS_WIDGETS_CONFIG.mainMessage
        if (background) {
            const { scale, keyImg, offsetY, anchorX, anchorY } = background
            this._backImgMessage = new this._PIXI.Sprite.from(keyImg)
            anchorX && anchorY
                ? this._backImgMessage.anchor.set(anchorX, anchorY)
                : this._backImgMessage.anchor.set(0.5, 0.54)
            this._backImgMessage.scale.set(scale)
            this._backImgMessage.y = offsetY
            this.container.addChild(this._backImgMessage)
        }

        this._textContainer = new gameContext.PIXI.Container()
        this.container.addChild(this._textContainer)

        const { centralText, numbersCentralText } = gameContext.CONSTANTS.TEXT_STYLES

        const textStyle = new this._PIXI.TextStyle(centralText)
        //const numbersTextStyle = new this._PIXI.TextStyle(numbersCentralText)


        this.field1 = new this._PIXI.Text('', textStyle)
        this.field1.rountPixels = true
        this.field1.anchor.set(1.2, 1)
        this._textContainer.addChild(this.field1)


        //this._PIXI.BitmapFont.from('numbersStyleText', numbersTextStyle, { chars: [['0', '9'], '.'] })
        this._PIXI.BitmapFont.from('numbersStyleText', numbersCentralText, { chars: [['0', '9'], '.'] })
        this.fieldNumber1 = new this._PIXI.BitmapText("", { fontName: "numbersStyleText" });
        this.fieldNumber1.anchor.set(0, 1.05)
        this.fieldNumber1.text = ''
        this.fieldNumber1.position.set(0, 0)
        this._textContainer.addChild(this.fieldNumber1)


        this.field2 = new this._PIXI.Text('', textStyle)
        this.field2.rountPixels = true
        this.field2.anchor.set(1.2, 1)
        this.field2.text = ''
        this._textContainer.addChild(this.field2)


        this.fieldNumber2 = new this._PIXI.BitmapText("", { fontName: "numbersStyleText" });
        this.fieldNumber2.anchor.set(-0.2, 1.05)
        this.fieldNumber2.text = ''
        this.fieldNumber2.position.set(0, 0)
        this._textContainer.addChild(this.fieldNumber2)


        this._eventEmitter.subscribe('changeLanguage', () => this.field1.text = this._locale.getPhrase(this.field1.text))
    }


    setText (text, duration) {
        this._textContainer.x = 0

        this.field1.anchor.set(0.5, 1)
        this.field1.text = ''

        if (this.tween) {
            this._tween.stop()
        }
        this.fieldNumber1.text = ''
        this.fieldNumber1.alpha = 0

        this.field2.text = null
        this.fieldNumber2.text = ''

        if (!text) {
            return
        }


        if (typeof text === 'object') {
            this.field1.text = this._locale.getPhrase('Win') + ': ' 
            this.fieldNumber1.text = text[0]
            this.fieldNumber1.alpha = 1

            text[1] !== 0 && (this.fieldNumber2.text = text[1])
            if (text[1] !== 'Scatters' && text[1] !== 0) {
                this.field2.text = ' ' + this._locale.getPhrase('Line') + ': '
            }
            
            this.field1.anchor.set(0, 1)
            this.field1.position.x = 0

            this.fieldNumber1.position.x = getWidth(this.field1)

            if (this.field2.text) {
                this.field2.anchor.set(-.05, 1)
                this.field2.position.x = this.fieldNumber1.position.x + getWidth(this.fieldNumber1) + 5
                this.fieldNumber2.position.x = this.fieldNumber1.position.x +  getWidth(this.field2) + getWidth(this.fieldNumber1) + 5
            } else {
                this.fieldNumber2.position.x = this.fieldNumber1.position.x +  getWidth(this.fieldNumber1) + 7
            }          

            const fullWidth = getWidth(this._textContainer)
            this._textContainer.x = -fullWidth / 2
        }

        if (typeof text === 'string' || typeof text === 'number' && !duration) {
            this.field1.text = text
        }

        if (typeof text === 'number' && duration) {
            this._gameContext.components.audioManager.loopMoneyMore(duration)

            this.field1.text = this._locale.getPhrase('Total win') + ': '
            this.field1.anchor.set(1.01, 1)
            this.fieldNumber1.anchor.set(-0.01, 1.1)
            this.fieldNumber1.position.x = 0
            this.fieldNumber1.alpha = 1

            this._tween = TWEEN.createAuto({
                duration,
                fromValue: 0,
                toValue: text,
                tweenType: 'linear',
                actionWithValue: val => this.fieldNumber1.text = STRING.numberWithSpaces(val.toFixed(2)),
            })
            this._tween.start()

            this._gameContext.components.audioManager.loopMoneyMore(duration)
        }
    }
}

const getWidth = container => container.getLocalBounds().width