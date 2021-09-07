

export class BackgroundMachine {
    constructor (gameContext) {
        this._PIXI = gameContext.PIXI

        this.container = new this._PIXI.Container()

        const { keyImg, scale, x, y,} = gameContext.CONSTANTS.BACKGROUND_MACHINE_CONFIG
        const { halfFullWidth, halfFullHeight } = gameContext.data.slotMachine

        this.sprite = new this._PIXI.Sprite.from(keyImg)
        this.sprite.x = x - halfFullWidth
        this.sprite.y = y - halfFullHeight
        this.sprite.scale.set(scale)
        this.container.addChild(this.sprite)

        gameContext.components.deviceResizer.setElementToResize({
            container: this.container,
            config: {
                playScreen: gameContext.CONSTANTS.PLAY_SCREEN_CONFIG.slotMachine
            }
        })
    }
}
