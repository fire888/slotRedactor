export class SlotsMask {
    constructor(gameContext, config) {
        this._PIXI = gameContext.PIXI
        this._gameContext = gameContext

        const {
            frameLeft,
            frameTop,
            fullWidth,
            frameRight,
            fullHeight,
            halfFullWidth,
            halfFullHeight,
            frameBottom,
        } = this._gameContext.data.slotMachine

        /** create mask */
        this.container = null
        const { maskImg } = config.config
        if (maskImg) {
            const { keyImg, offsetX, offsetY } = maskImg
            this.container = new this._PIXI.Sprite.from(keyImg)
            this.container.anchor.set(0.5)
        } else {
            this.container = _createRectangleDark({
                color: 0x000000,
                alpha: 1,
                coords: [
                    -frameLeft - halfFullWidth,
                    -frameTop - halfFullHeight,
                    frameLeft + fullWidth + frameRight,
                    frameTop + fullHeight + frameBottom,
                ],
            }, this._PIXI)
        }


        gameContext.components.deviceResizer.setElementToResize({
            key: 'slotsMask',
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
