export class WidgetProgressBar {
    constructor(gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this._eventEmitter = gameContext.components.eventEmitter
        this._config = config

        this.container = new this._PIXI.Container()

        this._back = new this._PIXI.Sprite.from(config.config.keyImgBack)
        this._back.anchor.set(0.5)
        this.container.addChild(this._back)

        this._progress = new this._PIXI.Sprite.from(config.config.keyImgTop)
        this._progress.anchor.set(1, .5)
        this.container.addChild(this._progress)
        this._progress.calculateBounds()
        const bounds = this._progress.getBounds(true)
        this._w = bounds.width
        this._h = bounds.height
        this._progress.x = -this._w / 2

        this._progressMask = new this._PIXI.Graphics()
        this._progressMask.beginFill(0)
        const startMaskOffset = config.config.startMaskOffset || this._h / 2.7
        this._progressMask.drawRect(-(this._w / 2) + startMaskOffset, -40, this._w, 80)
        this._progressMask.endFill()
        this.container.addChild(this._progressMask)
        this._progress.mask = this._progressMask

        this._start = 0
        this._end = 0.1


        gameContext.components.deviceResizer.setElementToResize({
            key: 'progressBar',
            container: this.container,
            config: this._config.showModes,
        })

        this._unsubscribeProgress = this._eventEmitter.subscribe('updateProgressBar', val => {
            const p = this._start + ((val * .01) * (this._end - this._start))
            this._progress.x = (this._w * p) - (this._w / 2)
        })
    }


    dispose () {
        this.container.destroy()
        this._mask = null
        this._gameContext.components.deviceResizer.removeElementFromResize('progressBar')
        this._unsubscribeProgress()
        this.container = null
        this._gameContext = null
        this._PIXI = null
        this._eventEmitter = null
    }


    setPointsBetween (val1, val2) {
        this._start = val1
        this._end = val2
    }
}
