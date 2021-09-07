import * as Cache from './SpritesCache'
import * as TWEEN from '../../helpers/tween'

export class SlotItem {
    constructor (gameContext, symbolsConfig, num, column) {
        this._PIXI = gameContext.PIXI
        this._column = column
        this._id = 'slot_' + num;
        this._gameContext = gameContext
        this._symbolsConfig = symbolsConfig

        this.container = new gameContext.PIXI.Container()

        this._tweenScale = null
        this._cacheSprites = {}
        Cache.prepare(this._cacheSprites)

        this.currentSprite = null
        this.currentType = null
        this.currentMode = '2'
        this.flagIsFinishSymbol = false
    }


    setNormalView (type) {
        if (type !== undefined) this.currentType = type
        this.currentMode = '2'
        this._changeCurrentSprite()
    }


    setBlurView (type) {
        if (type !== undefined) this.currentType = type
        this.currentMode = '1'
        this._changeCurrentSprite()
    }


    setWinAnimationView (type = null) {
        if (type !== null) this.currentType = type
        this.currentMode = this._symbolsConfig[this.currentType].modeWinAnimation || '0'
        this._changeCurrentSprite()
    }


    setTransparency (value = 1) {
        this.container.alpha = value
    }


    _changeCurrentSprite () {
        if (this.currentSprite) {
            if (this.currentSprite.stop) this.currentSprite.stop()
            if (this._tweenScale) {
                this._tweenScale = null
                clearTimeout(this._transformTick)
                this._transformSprite(0)
            }
            const spr = this.currentSprite
            this.container.removeChild(this.currentSprite)
            if (spr.spineData) spr.destroy()
        }

        const imgToShow = this.currentMode === '3' ? '2' : this.currentMode
        if (this.currentMode !== 'spineWin') {
            this.currentSprite = this._cacheSprites[this.currentType][imgToShow]
        } else {
            const type = this.currentType < 10 ? '0' + this.currentType : this.currentType
            this.currentSprite = new this._PIXI.spine.Spine(this._gameContext.resources[`item${ type }_00_Json`].spineData);
            // console.log(this.currentSprite)
            const animation = this.currentSprite.state.setAnimation(0, this._symbolsConfig[this.currentType].spineWinAnimationName, true)
        }

        this.container.addChild(this.currentSprite)

        if (this.currentMode === '0') {
            this._animateFrames()
        }

        if (this.currentMode === '3') {
            this._animateScale()
        }
    }


    _animateFrames () {
        this.currentSprite.gotoAndPlay(0)
    }


    _animateScale () {
        if (!this._tweenScale) {
            this._tweenScale = TWEEN.createLinear(0, Math.PI * 2, 1500) // TODO: set time from config
        }

        const value = this._tweenScale.update(Date.now())

        this._transformSprite(value)

        if (value < Math.PI * 2)
            this._transformTick = setTimeout(this._animateScale.bind(this), 30)
    }


    _transformSprite (value = 0) {
        const v = Math.sin(value)
        const vRotate = Math.sin(value * 3)

        this.currentSprite.scale.set(v * 0.03 + 1)
        this.currentSprite.rotation = vRotate * 0.015
    }
}

