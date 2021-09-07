import * as TWEEN from '../helpers/tween'

export class CanvasIntro {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this._eventEmitter = gameContext.components.eventEmitter
        this._config = config

        this.container = new this._PIXI.Container()

        this.slider = new RulesSlider(gameContext, this._config.config)
        this.container.addChild(this.slider.container)

        gameContext.components.deviceResizer.setElementToResize({
            key: 'IntroSlider',
            container: this.container,
            config: this._config.showModes,
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
    constructor (gameContext, config) {
        this._PIXI = gameContext.PIXI
        this._config = config

        this.container = new this._PIXI.Container()

        const { introSliderTextStyle } = gameContext.CONSTANTS.TEXT_STYLES
        const stl = new this._PIXI.TextStyle(introSliderTextStyle)
        const {
            slides,
            textY,
            controlsY,
            controlsX,
            keyImgTextBack,
            backTextureScale,
            backTextureY,
            slidesImgsScale,
            slidesImgsX,
            slidesImgsY,
            textScale
        } = config

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
                slidesImgsX || 0,
                slidesImgsY || 25,
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

        if (keyImgTextBack) {
            const backTexture = this._PIXI.Sprite.from(keyImgTextBack)
            backTexture.anchor.set(0.5)
            backTexture.y = backTextureY
            backTexture.scale.set(backTextureScale)
            this.container.addChild(backTexture)
        }


        this.picker = new Picker(config, callback, this._PIXI)

        this.picker.container.y = controlsY
        this.picker.container.x = controlsX || 0
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
    constructor (data, textStyle, textY, _PIXI, locale, eventEmitter, slidesImgsScale, slidesImgsX, slidesImgsY, textScale) {
        this._locale = locale

        this.container = new _PIXI.Container()
        this.container.alpha = 0

        const texture  = _PIXI.Texture.from(data.img)
        const slide = new _PIXI.Sprite(texture)
        slide.scale.set(0.55)
        slide.anchor.set(0.5, 1)
        slide.x = slidesImgsX
        slidesImgsY && (slide.y = slidesImgsY)
        ///slide.y = 25
        this.container.addChild(slide)

        this._textValue = data.text

        const text = new _PIXI.Text(this._locale.getPhrase(this._textValue), textStyle)
        text.scale.set(textScale)
        text.y = -120
        text.x = slidesImgsX
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


const TIME_AFTER_CLICK = 10000
const TIME_SLIDE = 3000



class Picker {
    constructor (data, linkCallback, _PIXI) {
        let index = 0
        const callback = linkCallback

        this.timer = null
        this.container = new _PIXI.Container()

        const { controlCurrentKeyImg, controlEmptyKeyImg, controlLeftKeyImg, controlsScale, offsetArrowX, offsetArrowY } = data
        const currentPicTexture = _PIXI.Texture.from(controlCurrentKeyImg)
        const emptyPicTexture = _PIXI.Texture.from(controlEmptyKeyImg)

        const lPick = new _PIXI.Sprite(_PIXI.Texture.from(controlLeftKeyImg))
        lPick.anchor.set(0.5)

        offsetArrowX
            ? lPick.x = -offsetArrowX
            : lPick.x = -500
        offsetArrowY
            ? lPick.y = offsetArrowY
            : lPick.y = -120

        lPick.buttonMode = true
        lPick.interactive = true
        lPick.scale.x = 0.5
        lPick.scale.y = 0.5
        controlsScale && lPick.scale.set(controlsScale)
        lPick.on('pointerup', () => {
            index = index > 0 ? index - 1 : data.slides.length - 1
            startSetTimeOut(TIME_AFTER_CLICK)
            updatePicks(index, 'left')
        })
        this.container.addChild(lPick)

        const rPick = new _PIXI.Sprite(_PIXI.Texture.from(controlLeftKeyImg))
        rPick.anchor.set(0.5)

        offsetArrowX
            ? rPick.x = offsetArrowX
            : rPick.x = 500
        offsetArrowY
            ? rPick.y = offsetArrowY
            : rPick.y = -120

        rPick.scale.x = -0.5
        rPick.scale.y = 0.5
        if (controlsScale) {
            rPick.scale.set(-controlsScale, controlsScale)
        }
        rPick.buttonMode = true
        rPick.interactive = true
        rPick.on('pointerup', () => {
            index = index < data.slides.length - 1 ? index + 1 : 0
            startSetTimeOut(TIME_AFTER_CLICK)
            updatePicks(index, 'right')
        })
        this.container.addChild(rPick)

        const arrPicks = []
        for (let i = 0; i < data.slides.length; i ++) {
            const pick = new _PIXI.Sprite(emptyPicTexture)
            pick.anchor.set(0.5)
            pick.x = (-(data.slides.length / 2) + i) * data.shortOffsetControl + data.shortOffsetControl / 2
            pick.y = 55
            pick.scale.set(0.5)
            controlsScale && pick.scale.set(controlsScale)
            pick.buttonMode = true
            pick.interactive = true
            pick.userId = i
            pick.on('pointerup', e => {
                index = e.target.userId
                startSetTimeOut(TIME_AFTER_CLICK)
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
                startSetTimeOut(TIME_SLIDE)
            }, pause)
        }

        updatePicks(0, 'right')
        startSetTimeOut(TIME_SLIDE)
    }

    dispose() {
        clearTimeout(this.timer)
        this.container.destroy()
    }
}

