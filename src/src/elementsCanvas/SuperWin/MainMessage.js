import { createAuto } from '../../helpers/tween'

export class MainMessage {
    constructor(gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this.container = new this._PIXI.Container()

        this._popupContainer = new this._PIXI.Container()
        this.container.addChild(this._popupContainer)

        this._config = config

        this._currentSprite = null


        const keys = ['BIG_WIN', 'SUPER_WIN', 'MEGA_WIN', 'JACKPOT']
        this._spr = {}

        for (let i = 0; i < keys.length; ++i) {
            const { keyImg, anchor } = config.config.popups[keys[i]]
            const sp = new this._PIXI.Sprite.from(keyImg)
            sp.anchor.set(anchor[0], anchor[1])
            this._spr[keys[i]] = sp
        }


        this._textNum = new this._PIXI.BitmapText('555', { fontName: 'WinNumbers'},)
        this._textNum.scale.set(1)
        this._textNum.anchor.set(.5, -0.45)
        this.container.addChild(this._textNum)

        this._finalNums = null
        this._isMoveAnim = false
    }



    startAnimate(winTitle, winVal, time) {
        this._gameContext.components['audioManager'].play(winTitle)

        this._finalNums = winVal
        this._startAnimateWin(this._finalNums, time)
        this._startAnimateMovie(winTitle, time)
        this.container.renderable = true
        return new Promise(resolve => { resolve() })
    }


    showFinalVal () {
        const winType = this._gameContext.components['changerBalance'].checkSuperWinByVal(this._finalNums)
        this._changeCurrentSprite(winType)

        this._updater.stop()
        this._isMoveAnim = false
        this._textNum.text = this._finalNums.toFixed(2)
    }


    hide() {
        this.container.renderable = false
    }


    _startAnimateWin (winVal, time) {
        let prevType = 'BIG_WIN'

        this._updater = createAuto({
            actionWithValue: val => {
                const newType = this._gameContext.components['changerBalance'].checkSuperWinByVal(val)
                if (newType && newType !== prevType) {
                    prevType = newType
                    this._changeCurrentSprite(newType)
                }
                this._textNum.text = val.toFixed(2)
            },
            tweenType: 'simpleTween',
            fromValue: 0,
            toValue: winVal,
            duration: time,
        })
        this._updater.start()
    }


    _changeCurrentSprite(type) {
        for (let key in this._spr) {
            this._popupContainer.removeChild(this._spr[key])
        }
        this._popupContainer.addChild(this._spr[type])
        this._currentSprite = this._spr[type]


        const tween = createAuto({
            tweenType: 'autoUpdateColumnTwoVals',
            fromValue: 0,
            middleValueOne: 3,
            middleValueTwo: .1,
            toValue: 1,
            duration: 400,
            actionWithValue: val => {
                this._currentSprite.scale.set(val)
            }
        })
        tween.start()
    }


    _startAnimateMovie (winType, time) {
        this._changeCurrentSprite('BIG_WIN')

        const t = 50
        const offset = 3
        let isTop = true
        this._isMoveAnim = true
        let tween = null


        const moveTexts = isTop => {
            tween = createAuto({
                actionWithValue: val => {
                    this._popupContainer.y = val - 100
                    this._textNum.y = -val + 130
                },
                tweenType: 'simpleTween',
                fromValue: isTop ? offset : -offset,
                toValue: isTop ? -offset : offset,
                duration: t,
            })
            tween.start()
                .then(() => this._isMoveAnim && moveTexts(!isTop))
        }
        setTimeout(() => this._isMoveAnim = false, time)

        moveTexts(isTop)

        this._gameContext.components['ui'].setBigMes(
            this._gameContext.components.locale.getPhrase(this._config.config.text.titles[winType])
        )
    }
}