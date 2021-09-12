export class Background {
    constructor(gameContext, keyImg) {
        this._PIXI = gameContext.PIXI
        this._gameContext = gameContext

        this.config = gameContext.CONSTANTS.BACKGROUND_CONFIG

        this.container = new this._PIXI.Sprite.from(this._PIXI.Texture.from(
            this.config[this._gameContext.data.view][this._gameContext.data.windowData.deviceMode].keyImg
        ))
        this.container.anchor.set(0.5)

        gameContext.components.eventEmitter.subscribe('resizeWindow', this.resize.bind(this))
        this.resize()
    }


    //dispose () {}


    setTextureFromKey () {
        this.resize()
    }

    
    resize () {
        const { wApp, hApp, deviceMode } = this._gameContext.data.windowData

        this.container.texture = this._PIXI.Texture.from(this.config[this._gameContext.data.view][deviceMode].keyImg)

        const { w, h } =  this.config[this._gameContext.data.view][deviceMode].size
        this.container.scale.set(Math.max(wApp / w, hApp / h))
    }
}

