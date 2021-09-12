import * as TWEEN from '../../helpers/tween'


export class MachineBoxes {
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
        } = this._gameContext.data.slotMachine


        this.container = new this._PIXI.Container()
        this.container.pivot.set(halfFullWidth, halfFullHeight)
        this.arrColumns = []

        for (let i = 0; i < columnsNum; i++) {
            const column = new this._PIXI.Container()
            column.x = (i * symbolW) + (i * dividerW) + (symbolW / 2)
            column.y = (symbolH / 2) - symbolWithDividerH
            this.container.addChild(column)
            this.arrColumns.push(column)
        }

        gameContext.components.deviceResizer.setElementToResize({
            key: 'machineBoxes',
            container: this.container,
            config: this._gameContext.CONSTANTS.SLOTS_CONFIG.showModes,
        })
    }


    setMask(mask) {
        this.container.mask = mask
    }


    showFrame(indX, indY, isSet) {
        this._gameContext.components['audioManager'].play('audioSymbolsFrame')

        const {symbolWithDividerH} = this._gameContext.data.slotMachine
        const spr = new this._PIXI.Sprite.from('frame.png')
        spr.anchor.set(0.5)
        spr.y = indY * symbolWithDividerH
        spr.alpha = 0
        this.arrColumns[indX].addChild(spr)
        TWEEN.createAuto({
            tweenType: 'eraseTween',
            fromValue: 0,
            toValue: 1,
            duration: 250,
            actionWithValue: val => spr.alpha = val
        }).start()
    }


    clear () {
        for (let i = 0; i < this.arrColumns.length; i ++) {
            for (let j = 0; j < this.arrColumns[i].children.length; j ++) {
                this.arrColumns[i].children[j].destroy()
                j --;
            }
        }
    }

}