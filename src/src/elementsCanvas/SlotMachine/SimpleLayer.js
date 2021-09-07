export class SimpleLayer {
    constructor (gameContext, config) {
        this._PIXI = gameContext.PIXI


        this.container = new this._PIXI.Container()


        const { keyImg, scale, x, y,} = config.config
        const { halfFullWidth, halfFullHeight } = gameContext.data.slotMachine


        this._sprite = new this._PIXI.Sprite.from(keyImg)
        this._sprite.x = -halfFullWidth + x
        this._sprite.y = -halfFullHeight + y
        this._sprite.scale.set(scale)
        this.container.addChild(this._sprite)


        gameContext.components.deviceResizer.setElementToResize({
            key: 'simpleLayer' + Math.floor(Math.random() * 100000),
            container: this.container,
            config: config.showModes
        })
    }



    setTextureFromKey (key) {
        this._sprite.texture = this._PIXI.Texture.from(key)
    }
}
