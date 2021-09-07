import * as TWEEN from '../helpers/tween'

export class Intro {
    constructor (gameContext) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this._eventEmitter = gameContext.components.eventEmitter

        this.container = new this._PIXI.Container()

        this.slider = new RulesSlider(gameContext)
        this.container.addChild(this.slider.container)

        gameContext.components.deviceResizer.setElementToResize({
            key: 'IntroSlider',
            container: this.container,
            config: {
                introScreen: gameContext.CONSTANTS.INTRO_SCREEN_CONFIG.introRules
            }
        })
    }

    dispose() {
        this.slider.dispose()
        this._gameContext.components.deviceResizer.removeElementFromResize('IntroSlider')
        this.container.destroy()
        this._eventEmitter = null
        this._PIXI = null
        this._gameContext = null
    }
}

class RulesSlider {
    constructor (gameContext) {
        this._PIXI = gameContext.PIXI
 
        this.container = new this._PIXI.Container()

        const { introSliderTextStyle } = gameContext.textStyles
        const stl = new this._PIXI.TextStyle(introSliderTextStyle)

        const { slides, textY, controlsY, keyImgTextBack, slidesImgsScale, textScale } = gameContext.CONSTANTS.INTRO_RULES_CONFIG

        if (keyImgTextBack) {
            const backText = this._PIXI.Sprite.from(keyImgTextBack)
            backText.anchor.set(0.5)
            backText.y = textY
            this.container.addChild(backText)
        }

        this.slides = []
        for (let i = 0; i < slides.length; i++) {
            const slide = new Slide(
                slides[i], 
                stl, 
                textY, 
                this._PIXI, 
                gameContext.components.locale,
                gameContext.components.eventEmitter,
                slidesImgsScale || 1,
                textScale || 1,
            )

            this.slides.push(slide)
            this.container.addChild(slide.container)
        }
        this.slides[0].show('right')

        this.timeOut = null

        const callback = (i, moveTo) => {
            for (let i = 0; i < this.slides.length; i++) {
                this.slides[i].hide(moveTo)
            }

            clearTimeout(this.timeOut)
            this.timeOut = setTimeout(() => {
                this.slides[i].show(moveTo)
            }, TIME)
        }

        this.picker = new Picker(
            gameContext.CONSTANTS.INTRO_RULES_CONFIG, 
            callback, 
            this._PIXI, 
        )

        this.picker.container.y = controlsY
        this.container.addChild(this.picker.container)
    }

    dispose() {
        clearTimeout(this.timeOut)
        this.picker.dispose()
        this.picker = null
        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].dispose()
        }
        this.slides = null
        this._PIXI = null
        this.container.destroy()
        this.container = null
    }
}


const TIME = 200
const TIME_NUMS = 30
const DIST = 200

class Slide {
    constructor (data, textStyle, textY, _PIXI, locale, eventEmitter, slidesImgsScale, textScale) {
        this._locale = locale

        this.container = new _PIXI.Container()
        this.container.alpha = 0

        const texture  = _PIXI.Texture.from(data.img)
        const slide = new _PIXI.Sprite(texture)
        slidesImgsScale && slide.scale.set(slidesImgsScale)
        slide.anchor.set(0.5, 1)
        this.container.addChild(slide)

        this._textValue = data.text

        const text = new _PIXI.Text(this._locale.getPhrase(this._textValue), textStyle)
        text.scale.set(textScale)
        text.y = textY
        text.anchor.set(0.5)
        this.container.addChild(text)

        this._unsubscribeEmitter = eventEmitter.subscribe('changeLanguage', () => {
            text.text = this._locale.getPhrase(this._textValue)
        })

        this.timeOut = null
        this.tween = null
    }

    hide (moveTo) {
        if (this.container.alpha < 1) {
            clearTimeout(this.timeOut)
            this.tween = null
            this.container.alpha = 0
            this.container.x = 0
            return;
        }

        this.tween = TWEEN.create({
            fromValue: 1,
            toValue: 0,
            duration: TIME,
        })

        const to = moveTo === 'right' ? 1 : -1

        const draw = () => {
            this.timeOut = setTimeout(() => {
                if (!this.tween) return;

                const { value, isDone} = this.tween.update(Date.now())
                this.container.alpha = value
                this.container.x = (1 - value) * to * DIST

                if (isDone) {
                    this.container.alpha = 0
                    return;
                }

                draw()

            }, TIME / TIME_NUMS)
        }

        draw()
    }

    show (moveTo) {
        if (this.container.alpha !== 0 ) {
            this.tween = null
            clearTimeout(this.timeOut)
            this.container.alpha = 1
            this.container.x = 0
            return;
        }

        const to = moveTo === 'right' ? 1 : -1

        this.container.x = -DIST * to
        this.container.alpha = 0

        this.tween = TWEEN.create({
            fromValue: 0,
            toValue: 1,
            duration: TIME,
        })

        const draw = () => {
            this.timeOut = setTimeout(() => {
                if (!this.tween) return;

                const { value, isDone } = this.tween.update(Date.now())
                this.container.alpha = value
                this.container.x = (value - 1) * to * DIST

                if (isDone) {
                    this.container.alpha = 1
                    this.container.x = 0
                    return;
                }

                draw()
            }, TIME / TIME_NUMS)
        }

        draw()
    }

    dispose () {
        clearTimeout(this.timeOut)
        this.tween = null
        this.container.destroy()
    }
}



class Picker {
    constructor (data, linkCallback, _PIXI) {
        let index = 0
        const callback = linkCallback
        const pauseAfterClick = 20000;

        this.timer = null
        this.container = new _PIXI.Container()

        const { controlCurrentKeyImg, controlEmptyKeyImg, controlLeftKeyImg, controlsScale } = data
        const currentPicTexture = _PIXI.Texture.from(controlCurrentKeyImg)
        const emptyPicTexture = _PIXI.Texture.from(controlEmptyKeyImg)

        const lPick = new _PIXI.Sprite(_PIXI.Texture.from(controlLeftKeyImg))
        controlsScale && lPick.scale.set(controlsScale)
        lPick.anchor.set(0.5)
        lPick.x = -(data.slides.length / 2) * data.shortOffsetControl - data.shortOffsetControl / 2 - data.longOffsetControl
        lPick.buttonMode = true
        lPick.interactive = true
        lPick.on('pointerup', () => {
            index = index > 0 ? index - 1 : data.slides.length - 1
            startSetTimeOut(pauseAfterClick)
            updatePicks(index, 'left')
        })
        this.container.addChild(lPick)

        const rPick = new _PIXI.Sprite(_PIXI.Texture.from(controlLeftKeyImg))
        controlsScale && rPick.scale.set(controlsScale)
        rPick.anchor.set(0.5)
        rPick.x = (data.slides.length / 2) * data.shortOffsetControl + data.shortOffsetControl / 2 + data.longOffsetControl
        rPick.scale.x = -controlsScale || -1
        rPick.buttonMode = true
        rPick.interactive = true
        rPick.on('pointerup', () => {
            index = index < data.slides.length - 1 ? index + 1 : 0
            startSetTimeOut(pauseAfterClick)
            updatePicks(index, 'right')
        })
        this.container.addChild(rPick)

        const arrPicks = []
        for (let i = 0; i < data.slides.length; i ++) {
            const pick = new _PIXI.Sprite(emptyPicTexture)
            controlsScale && pick.scale.set(controlsScale)
            pick.anchor.set(0.5)
            pick.x = (-(data.slides.length / 2) + i) * data.shortOffsetControl + data.shortOffsetControl / 2
            pick.buttonMode = true
            pick.interactive = true
            pick.userId = i
            pick.on('pointerup', e => {
                index = e.target.userId
                startSetTimeOut(pauseAfterClick)
                updatePicks(index, 'right')
            })
            arrPicks.push(pick)
            this.container.addChild(pick)
        }

        const updatePicks = (k, moveTo) => {
            for (let i = 0; i < arrPicks.length; i++) {
                arrPicks[i].texture = arrPicks[i].userId === k ? currentPicTexture : emptyPicTexture
            }

            callback(index, moveTo)
        }

        const startSetTimeOut = pause => {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                index = index < data.slides.length - 1 ? index + 1 : 0
                updatePicks(index, 'right')
                startSetTimeOut(4000)
            }, pause)
        }

        updatePicks(0, 'right')
        startSetTimeOut(4000)
    }

    dispose() {
        clearTimeout(this.timer)
        this.container.destroy()
    }
}