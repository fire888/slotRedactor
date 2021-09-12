

export class CanvasCorners {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this.container = new gameContext.PIXI.Container()

        this._conf = [ config.config.l, config.config.r]

        this._l = null
        this._r = null

        gameContext.components.eventEmitter.subscribe('resizeWindow', this._resize.bind(this))

        this.setTexturesFromKeys(...this._conf)
    }


    setTexturesFromKeys (keyL, keyR) {
        this._l && this._l.destroy()
        this._l = new this._gameContext.PIXI.Sprite.from(keyL)
        this._l.anchor.set(0, 1)
        this.container.addChild(this._l)

        this._r && this._r.destroy()
        this._r = new this._gameContext.PIXI.Sprite.from(keyR)
        this._r.anchor.set(1, 1)
        this.container.addChild(this._r)

        this._resize()
    }


    _resize () {
        const { scaleGame, wApp, hApp } = this._gameContext.data.windowData

        this._l.x = -hApp
        this._r.x = hApp
        this._l.y = this._r.y = hApp / 2


        const scale = .5
        this._l.scale.set(scaleGame * scale)
        this._r.scale.set(scaleGame * scale)
    }
}
