import {createAuto} from '../../helpers/tween'
import { MoneyContainer } from './Money'
import { MainMessage } from './MainMessage'
import { FlashContainer } from './Flash'


export class SuperPrizeEffectToggle {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this._config = config

        this.container = new this._PIXI.Container()
        this.container.renderable = false

        this._gameContext.components.deviceResizer.setElementToResize({
            container: this.container,
            config: config.showModes,
        })

        if (this._config.config.dark) {
            const { color, alpha, blend } = this._config.config.dark
            this._dark = new gameContext.PIXI.Graphics()
            this._dark.beginFill(color, alpha)
            this._dark.drawRect(-4000, -4000, 8000, 8000)
            this._dark.endFill()
            this._dark.alpha = 0
            this.container.addChild(this._dark)
            this._dark.interactive = false
            this._dark.buttonMode = false

            this._dark.on('pointerdown', () => {
                if (!this.container.renderable) return;
                this._complete()
            })
        }

        this._money = new MoneyContainer(gameContext, config)
        this.container.addChild(this._money.container)

        this._containerFlash = new this._PIXI.Container()
        this._containerFlash.alpha = 0
        this.container.addChild(this._containerFlash)

        this._flash = new FlashContainer(this._gameContext, config)
        this._containerFlash.addChild(this._flash.container)

        this._text = new MainMessage(gameContext, config)
        this._containerFlash.addChild(this._text.container)

        this._timeShowStatic = 1000
        this._timer = null
        this._resolveSkipOrPause = null


        this._funcClick = () => { this._complete() }

        this._gameContext.components.eventEmitter.subscribe('toggleAutoPlay', val => {
            if (val) return;

            if (!this.container.renderable) return;
            this._complete()
        })
    }


    async start (winType, winVal) {
        this._money.container.renderable = false
        this._money.reset()


        const currentBet = this._gameContext.data.bet.currentBet
        const time = (winVal / currentBet) * this._config.config.speedMoneyBetsInSec
        const { toggleShowTime, toggleHideTime } = this._config.config


        this.container.renderable = true


        await this._flash.startAnimation()


        this._toggleAlpha(0, 1, toggleShowTime)


        await this._text.startAnimate(winType, winVal, time - 1000)
        await this._pause(500)
        await this._money.start({ time: time + toggleShowTime })


        this._initSkipping()


        await this._waitClickSkipOrPause(time)
        await this._pause(this._timeShowStatic)


        this._toggleAlpha(1, 0, toggleHideTime)


        await this._pause(600)


        this._flash.stopAnimation()
        this._text.hide()
        this.container.renderable = false
    }


    _initSkipping () {
        const { ui } = this._gameContext.components
        ui.enableButtons()
        ui.disableBet()
        ui.disableRules()

        this._dark.interactive = true
        this._dark.buttonMode = true

        if (this._gameContext.data.windowData.deviceMode !== 'desktop') {
            const butSpin = document.querySelector('.butt-spin')
            butSpin.addEventListener('touchstart', this._funcClick)
        }
    }


    _waitClickSkipOrPause (t) {
        return new Promise(resolve => {
            this._resolveSkipOrPause = resolve
            this._timer = setTimeout(this._complete.bind(this), t)
        })
    }


    _complete () {
        const { ui } = this._gameContext.components
        ui.disableButtons()

        if (this._gameContext.data.windowData.deviceMode !== 'desktop') {
            const butSpin = document.querySelector('.butt-spin')
            butSpin.removeEventListener('touchstart', this._funcClick)
        }

        this._dark.interactive = false
        this._dark.buttonMode = false

        this._money.stop()
        clearTimeout(this._timer)
        this._text.showFinalVal()
        this._resolveSkipOrPause && this._resolveSkipOrPause()
    }



    _toggleAlpha(fromValue, toValue, duration) {
        const actionWithValue = val => {
            this._dark && (this._dark.alpha = val)
            this._containerFlash.alpha = val
        }

        const tweenAlpha = createAuto({
            tweenType: 'simpleTween',
            fromValue,
            toValue,
            duration,
            actionWithValue,
        })
        tweenAlpha.start()
    }


    _pause (t) {
        return new Promise(resolve => setTimeout(resolve, t))
    }
}












