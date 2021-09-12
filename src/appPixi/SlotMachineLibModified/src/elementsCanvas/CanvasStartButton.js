export class CanvasStartButton {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this._eventEmitter = gameContext.components.eventEmitter
        this._device = gameContext.data.windowData.deviceMode
        this._config = config

        this.container = new this._PIXI.Container()
        this.container.renderable = false

        const { keyImg, keyImgHover } = this._config.config
        this._map = this._PIXI.Texture.from(keyImg)
        this._mapHover = this._PIXI.Texture.from(keyImgHover)

        this._button = new this._PIXI.Sprite(this._map)

        this._button.anchor.set(0.5)
        this._button.interactive = false
        this._button.buttonMode = false
        this._button.on('pointerup', () => {
            this._eventEmitter.emit('clickStartButton', null)
        })
        this._button.on('pointerover', () => {
            this._button.texture = this._mapHover
        })
        this._button.on('pointerout', () => {
            this._button.texture = this._map
        })

        this.container.addChild(this._button)

        gameContext.components.deviceResizer.setElementToResize({
            key: 'startButton',
            container: this.container,
            config: this._config.showModes
        })
    }

    enable () {
        this.container.renderable = true
        this._button.interactive = true
        this._button.buttonMode = true
    }


    disable () {
        this.container.renderable = false
        this._button.interactive = false
        this._button.buttonMode = false
    }



    dispose () {
        this._gameContext.components.deviceResizer.removeElementFromResize('startButton')
        this._gameContext = null
        this._PIXI = null
        this._eventEmitter = null
        this._device = null


        this._map.destroy()
        this._mapHover.destroy()
        this._button.destroy()
        this.container.destroy()
    }
}
