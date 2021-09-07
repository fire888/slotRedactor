export class WidgetProgressBarItems {
    constructor(gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this._eventEmitter = gameContext.components.eventEmitter


        this.container = new this._PIXI.Container()


        gameContext.components.deviceResizer.setElementToResize({
            key: 'progressBar',
            container: this.container,
            config: config.showModes,
        })


        const {
            width, nums, keyImgEmpty, keyImgDone, maskOffsetLeft, maskOffsetRight
        } = config.config
        this._w = width
        this._quantity = nums
        this._start = 0
        this._end = 0


        const {
            progressContainer,
            progressMask
        } = createProgress(this._w, this._quantity, keyImgEmpty, keyImgDone, this._PIXI)

        this._progressContainer = progressContainer
        this.container.addChild(this._progressContainer)
        this._mask = progressMask
        this._mask.position.x += maskOffsetLeft
        this._unsubscribeProgress = this._eventEmitter.subscribe('updateProgressBar', val => {
            const percent = (this._end - this._start) * val * 0.01 + this._start
            const width =  (this._w + (this._w / this._quantity) + maskOffsetRight) * percent
            this._updateMask(width)
        })
    }


    hide() {
        this.progressContainer.renderable = false
    }

    dispose () {
        this._progressContainer.destroy()
        this._progressContainer = null
        this._mask.destroy()
        this._mask = null
        this._gameContext.components.deviceResizer.removeElementFromResize('progressBar')
        this._unsubscribeProgress()
        this.container.destroy()
        this.container = null
        this._gameContext = null
        this._PIXI = null
        this._eventEmitter = null
    }

    setPointsBetween (val1, val2) {
        this._start = val1
        this._end = val2
    }

    _updateMask(width) {
        this._mask.clear()
        this._mask.beginFill(0x000000, 1)
        this._mask.drawRect(0, -100, width, 200)
        this._mask.endFill()
    }
}



const createProgress = (w, quantity, keyImgEmpty, keyImgDone, PIXI) => {
    const mask = new PIXI.Graphics()
    mask.x = -w / 2

    const container = new PIXI.Container()

    for (let i = 0; i < quantity; i++) {
        const spEmpty = PIXI.Sprite.from(keyImgEmpty)
        spEmpty.anchor.set(0.5)
        //spEmpty.scale.set(0.6)
        spEmpty.x = -(w / 2) + i * w / (quantity - 1)
        container.addChild(spEmpty)

        const spDone = PIXI.Sprite.from(keyImgDone)
        spDone.x = spEmpty.x
        //spDone.scale.set(0.6)
        spDone.anchor.set(0.5)
        spDone.mask = mask
        container.addChild(spDone)
    }

    container.addChild(mask)

    return {
        progressContainer: container,
        progressMask: mask,
    }
}

