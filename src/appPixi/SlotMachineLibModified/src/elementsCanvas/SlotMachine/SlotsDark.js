export class SlotsDark {
    constructor(gameContext, config) {
        this._PIXI = gameContext.PIXI
        this._gameContext = gameContext

        const {
            frameLeft,
            frameTop,
            fullWidth,
            frameRight,
            fullHeight,
            frameBottom,
            halfFullWidth,
            halfFullHeight,
        } = this._gameContext.data.slotMachine


        this.container = new this._PIXI.Container()
        this.container.pivot.set(halfFullWidth, halfFullHeight)

        const darkConfig = config.config
        if (darkConfig && darkConfig.active) {
            let dark
            const { darkImg } = darkConfig
            if ( darkImg ) {
                const { keyImg, offsetY, offsetX } = darkImg
                dark = new this._PIXI.Sprite.from(keyImg)
                dark.x = offsetX
                dark.y = offsetY
            } else {
                dark = _createRectangleDark({
                    color: darkConfig.color,
                    alpha: darkConfig.alpha,
                    coords: [
                        -frameLeft,
                        -frameTop,
                        fullWidth + frameLeft + frameRight,
                        fullHeight + frameTop + frameBottom,
                    ],
                }, this._PIXI)
            }
            this.container.addChild(dark)
        }

        gameContext.components.deviceResizer.setElementToResize({
            key: 'slotsDark',
            container: this.container,
            config: config.showModes,
        })
    }
}




const _createRectangleDark = (data, _PIXI) => {
    const rect = new _PIXI.Graphics()
    rect.beginFill(data.color)
    rect.drawRect(
        data.coords[0],
        data.coords[1],
        data.coords[2],
        data.coords[3],
    )
    rect.endFill()
    rect.alpha = data.alpha
    return rect
}

