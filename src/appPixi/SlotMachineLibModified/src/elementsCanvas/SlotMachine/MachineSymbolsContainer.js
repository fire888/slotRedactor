export class MachineSymbolsContainer {
    constructor(gameContext, config) {
        this._PIXI = gameContext.PIXI
        this._gameContext = gameContext

        const {
            symbolW,
            dividerW,
            symbolH,
            symbolWithDividerH,
            columnsNum,
            halfFullWidth,
            halfFullHeight,
            columnOffsetY,
        } = this._gameContext.data.slotMachine


        this.container = new this._PIXI.Container()
        this.container.pivot.set(halfFullWidth, halfFullHeight)
        this.arrColumns = []

        for (let i = 0; i < columnsNum; i++) {
            const column = new this._PIXI.Container()
            column.x = (i * symbolW) + (i * dividerW) + (symbolW / 2)
            column.y = (symbolH / 2) - symbolWithDividerH + columnOffsetY
            this.container.addChild(column)
            this.arrColumns.push(column)
        }

        gameContext.components.deviceResizer.setElementToResize({
            key: 'levelSymbols' + Math.floor(Math.random() * 1000000),
            container: this.container,
            config: config.showModes,
        })
    }

    setMask (mask) {
        this.container.mask = mask
    }
}