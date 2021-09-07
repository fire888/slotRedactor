export class CanvasLogo {
    constructor(gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this.config = config

        this.container = new this._PIXI.Sprite.from(
            this.config.showModes['startScreen'][this._gameContext.data.windowData.deviceMode].keyImg)
        this.container.anchor.set(0.5, 1)


        gameContext.components.deviceResizer.setElementToResize({
            key: 'logo',
            container: this.container,
            config: this.config.showModes
        })

        gameContext.components.eventEmitter.subscribe('resizeWindow', this._resize.bind(this))
    }


    _resize() {
        const { deviceMode } = this._gameContext.data.windowData
        this.container.texture = this._PIXI.Texture.from(this.config.showModes[this._gameContext.data.view][deviceMode].keyImg)
    }
}

