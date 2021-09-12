export class LayerImg {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this.config = config

        this.container = new this._PIXI.Container()

        // const { keyImg, scale, x, y, name} = config.config
        // const { halfFullWidth, halfFullHeight } = gameContext.data.slotMachine

        // this._sprite = new this._PIXI.Sprite.from(keyImg)
        // this._sprite.x = -halfFullWidth + x
        // this._sprite.y = -halfFullHeight + y
        // this._sprite.scale.set(scale)
        // this.container.addChild(this._sprite)


        this.container = new this._PIXI.Sprite.from(
            this.config.showModes['playScreen'][this._gameContext.data.windowData.deviceMode].keyImg)
        this.container.anchor.set(0.5, 1)

        gameContext.components.deviceResizer.setElementToResize({
            key: config.config.name,
            container: this.container,
            config: config.showModes
        })

        gameContext.components.eventEmitter.subscribe('resizeWindow', this._resize.bind(this))
    }

    setTextureFromKey (key) {
        this.container.texture = this._PIXI.Texture.from(key)
    }

    _resize() {
        const { deviceMode } = this._gameContext.data.windowData
        this.container.texture = this._PIXI.Texture.from(this.config.showModes[this._gameContext.data.view][deviceMode].keyImg)
    }
}
