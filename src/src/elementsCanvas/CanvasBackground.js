export class CanvasBackground {
    constructor(gameContext, config) {
        this._PIXI = gameContext.PIXI
        this._gameContext = gameContext
        this.config = config

        this.container = new this._PIXI.Sprite.from(this._PIXI.Texture.from(
            this.config.showModes[this._gameContext.data.view][this._gameContext.data.windowData.deviceMode].keyImg
        ))
        this.container.anchor.set(0.5)

        // const spr = new this._PIXI.Sprite.from('item00_anim01_fr00.png')
        // this.container.addChild(spr)
        //
        // const spr2 = new this._PIXI.Sprite.from('x.png')
        // this.container.addChild(spr2)

        gameContext.components.eventEmitter.subscribe('resizeWindow', this._resize.bind(this))
        this._resize()
    }

    _resize () {
        const { wApp, hApp, deviceMode } = this._gameContext.data.windowData

        this.container.texture = this._PIXI.Texture.from(this.config.showModes[this._gameContext.data.view][deviceMode].keyImg)

        const { w, h } =  this.config.showModes[this._gameContext.data.view][deviceMode].size
        this.container.scale.set(Math.max(wApp / w, hApp / h))
    }
}

