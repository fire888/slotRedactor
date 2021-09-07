import { createAuto } from '../helpers/tween'

const PI = Math.PI
const halfPI = PI / 2
const PI2 = PI * 2


export class SuperPrizeEffect {
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

        this._text = new TextContainer(gameContext, config)
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
        //this._isActive = true
        //this._mustComplete = false


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




class MoneyContainer {
    constructor(gameContext, config) {
        this._PIXI = gameContext.PIXI
        this._gameContext = gameContext
        this._config = config

        this.container = new this._PIXI.Container()

        const { y, num, minHeight, maxHeight, width } = this._config.config.money

        this.container.y = y

        const practiceData = {
            position: true,
            scale: true,
            rotation: true,
            alpha: true,
        }

        this._containerM = new this._PIXI.ParticleContainer(num, practiceData)
        this._containerM.blendmode = this._PIXI.BLEND_MODES.ADD
        this.container.addChild(this._containerM)

        this._spritesM = []
        this._sDataM = []

        this._fullDist = 2 * PI2 // длина которую красиво проходит за 3 секунды

        for (let i = 0; i < 150; i ++) {
            const spr = new this._PIXI.Sprite.from('money.png')
            spr.anchor.set(0.5)
            spr.scale.set(Math.random() * 0.2 + 0.5)
            spr.alpha = 0
            this._containerM.addChild(spr)
            this._spritesM.push(spr)

            this._sDataM.push({
                h: Math.random() * (maxHeight - minHeight) + minHeight,
                w: (Math.random() * 2. - 1.) * width,
            })
        }

        this._updater = null
    }


    start ({ time }) {
        this.container.renderable = true
        this._gameContext.components.audioManager.loopMoneyMore(time)
        this._fullDist = Math.floor(time / 3000) * PI

        const tweenData = {
            tweenType: 'linear',
            fromValue: 0,
            toValue: this._fullDist,
            duration: time,
            actionWithValue: this._update.bind(this),
        }

        this._updater = createAuto(tweenData)
        this._updater.start()
        this.container.renderable = true

        return new Promise(resolve => resolve())
    }


    stop () {
        this._gameContext.components.audioManager.loopMoneyStop()
        this._updater.stop()
        this.container.renderable = false
    }


    reset() {
        this._update(0)
    }


    _update (distance) {
        // все спрайты будут расставлены от 0 до ПИ/2
        const step = halfPI / this._spritesM.length

        for (let i = 0; i < this._spritesM.length; i ++) {
            const sp = this._spritesM[i]
            const { h, w } = this._sDataM[i]

            // текущая фаза конкретного спрайта
            const dist = distance + (step * i)

            // движение влево каждое ПИ
            const phaseX = Math.sin(dist % halfPI)
            sp.x = w * phaseX

            // движение вверх низ каждое ПИ
            const phaseY = (dist * 2) % PI
            // -yPhase * 0.2 - опускает завершающюю часть
            sp.y = h * (Math.sin(phaseY) - (phaseY * 0.5))

            // рандом(w) + (повернуться 4 раза) пока проходится ПИ
            sp.rotation = w + (dist * 4)

            // масштаб х меняем пока проходим ПИ
            sp.scale.x = phaseX + 0.3
            // масштаб у меняем в семь раз быстрее пока проходим дистанцию
            sp.scale.y = sp.scale.x * Math.sin(dist * 7)

            // начинаем показ с последнего спрайта
            sp.alpha = dist > halfPI ? 1 : 0
            // заканчиваем показ c последнего спрайта прошедшего дистанцию
            if (sp.alpha === 1) sp.alpha = dist < this._fullDist ? 1 : 0
        }
    }
}




class FlashContainer {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = this._gameContext.PIXI

        this.container = new this._PIXI.Container()
        //this.container.y = 400
        this.container.y = -50
        this.container.scale.set(2.5)

        this._spL = new this._PIXI.Sprite.from('flash2.png')
        this._spL.blendmode = this._PIXI.BLEND_MODES.ADD
        this._spL.anchor.set(0.5)
        this.container.addChild(this._spL)

        this._lights = new LightsContainer(gameContext, config)
        this._lights.container.scale.set(0.3)
        this.container.addChild(this._lights.container)

        this._spR = new this._PIXI.Sprite.from('flash2.png')
        this._spR.blendmode = this._PIXI.BLEND_MODES.ADD
        this._spR.anchor.set(0.5)
        this.container.addChild(this._spR)

        this._unsubscriber = null
    }

    startAnimation () {
        let dist = 0
        const spd = 0.01
        let f = Math.random() * Math.PI

        this._unsubscriber = this._gameContext.components.eventEmitter.subscribe(
            'drawNewFrame',
            count => {
                this._spL.rotation += 0.01 * count
                this._spR.rotation -= 0.01 * count

                dist += spd * count
                this._lights.update(dist)
            })

        return new Promise(resolve => resolve())
    }

    stopAnimation () {
        this._unsubscriber()
    }
}



class LightsContainer {
    constructor(gameContext, config) {
        this._PIXI = gameContext.PIXI
        this._gameContext = gameContext

        const { num, keyTexture, blendMode, r } = config.config.lights

        this._r = r

        const practiceLData = {
            position: true,
            rotation: true,
            alpha: true,
        }

        this.container = new this._PIXI.ParticleContainer(num, practiceLData)
        this.container.blendmode = this._PIXI.BLEND_MODES[blendMode]

        this._sprites = []
        this._sData = []



        for (let i = 0; i < num; i ++) {
            const spr = new this._PIXI.Sprite.from(keyTexture)
            spr.anchor.set(0.5)
            spr.rotation = (Math.PI * 2 / num) * i
            this.container.addChild(spr)
            this._sprites.push(spr)

            this._sData.push({ f: Math.random() * PI2 })
        }
    }


    update (distance) {
        const step = PI2 / this._sprites.length

        for (let i = 0; i < this._sprites.length; i ++) {
            const phaseDist = Math.sin(((distance * 2 + this._sData[i].f)) % 0.5)

            // радиус
            const offset =  phaseDist * this._r
            // угол
            const rad = step * i

            this._sprites[i].x = Math.cos(rad) * offset
            this._sprites[i].y = Math.sin(rad) * offset
            this._sprites[i].alpha = 0.5 - phaseDist
        }
    }
}



class TextContainer {
    constructor(gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this.container = new this._PIXI.Container()
        this._config = config

        this._sprite = new this._PIXI.spine.Spine(this._gameContext.resources[`winJson`].spineData)
        this.container.addChild(this._sprite)



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
        this._updater.stop()
        this._isMoveAnim = false
        this._textNum.text = this._finalNums.toFixed(2)
    }


    hide() {
        this.container.renderable = false
    }


    _startAnimateWin (winVal, time) {

        this._updater = createAuto({
            actionWithValue: val => {
                this._textNum.text = val.toFixed(2)
            },
            tweenType: 'simpleTween',
            fromValue: 0,
            toValue: winVal,
            duration: time,
        })
        this._updater.start()
    }


    _startAnimateMovie (winType, time) {
        this._sprite.state.setAnimation(0, winType, false)

        const t = 50
        const offset = 3
        let isTop = true
        this._isMoveAnim = true
        let tween = null


        const moveTexts = isTop => {
            tween = createAuto({
                actionWithValue: val => {
                    this._sprite.y = val + 100
                    this._textNum.y = -val
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

