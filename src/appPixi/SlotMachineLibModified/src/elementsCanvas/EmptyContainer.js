export class EmptyContainer {
    constructor (gameContext, config) {
        this._PIXI = gameContext.PIXI
        this.container = new this._PIXI.Container()

        gameContext.components.deviceResizer.setElementToResize({
            key: 'simpleLayer' + Math.floor(Math.random() * 100000),
            container: this.container,
            config: config.showModes
        })
    }
}
