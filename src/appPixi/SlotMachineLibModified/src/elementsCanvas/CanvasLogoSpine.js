export class CanvasLogoSpine {
    constructor(gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this.config = config

        this.container = new this._PIXI.Container()

        this._sp = new this._PIXI.Sprite.from(
            this.config.showModes['startScreen'][this._gameContext.data.windowData.deviceMode].keyImg)
        this._sp.anchor.set(0.5, 1)
        this.container.addChild(this._sp)


        gameContext.components.deviceResizer.setElementToResize({
            key: 'logo',
            container: this.container,
            config: this.config.showModes
        })

        this._unsubscribeResize = gameContext.components.eventEmitter.subscribe('resizeWindow', this._resize.bind(this))

        gameContext.components.eventEmitter.subscribe('startTotalWinAnimation', this._animate.bind(this))
    }


    _resize() {
        if (this._gameContext.data.view === 'playScreen') {
            if (this._sp.constructor.name !== 'Spine') {
                this._sp.destroy()
                this._sp = new this._PIXI.spine.Spine(this._gameContext.resources[`logoJson`].spineData)
                this._animate()
                this.container.addChild(this._sp)
                this._unsubscribeResize()
            }
        } else {
            const { deviceMode } = this._gameContext.data.windowData
            this._sp.texture = this._PIXI.Texture.from(this.config.showModes[this._gameContext.data.view][deviceMode].keyImg)
        }
    }


    _animate () {
        this._sp.state.setAnimation(0, 'idle', false)
    }
}

