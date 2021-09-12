import { LightsContainer } from './Lights'

export class FlashContainer {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = this._gameContext.PIXI

        this.container = new this._PIXI.Container()
        this.container.y = -50
        this.container.scale.set(2.5)

        this._spL = new this._PIXI.Sprite.from('flash2.png')
        this._spL.blendmode = this._PIXI.BLEND_MODES.ADD
        this._spL.anchor.set(0.5)
        this.container.addChild(this._spL)

        this._lights = new LightsContainer(gameContext, config)
        this._lights.container.scale.set(0.3)
        this.container.addChild(this._lights.container)

        this._spR = new this._PIXI.Sprite.from('flash2.png')
        this._spR.blendmode = this._PIXI.BLEND_MODES.ADD
        this._spR.anchor.set(0.5)
        this.container.addChild(this._spR)

        this._unsubscriber = null
    }

    startAnimation () {
        let dist = 0
        const spd = 0.01
        let f = Math.random() * Math.PI

        this._unsubscriber = this._gameContext.components.eventEmitter.subscribe(
            'drawNewFrame',
            count => {
                this._spL.rotation += 0.01 * count
                this._spR.rotation -= 0.01 * count

                dist += spd * count
                this._lights.update(dist)
            })

        return new Promise(resolve => resolve())
    }

    stopAnimation () {
        this._unsubscriber()
    }
}