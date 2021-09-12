import { WinLine } from './WinLine'


export class WinLines {
    constructor(gameContext, config) {
        this._eventEmitter = gameContext.components.eventEmitter
        this._PIXI = gameContext.PIXI


         const { symbolWithDividerW, symbolWithDividerH } = gameContext.data.slotMachine
         const { slots, interpolation } = config.config
         const linesPoints = []

         for (let i = 0; i < slots.length; i ++) {
            const arr = []
            for (let j = 0; j < slots[i].length; j ++) {
                const coord = slots[i][j]
                const x = (coord[0] * symbolWithDividerW) -(symbolWithDividerW / 2)
                const y = (coord[1] * symbolWithDividerH) -(symbolWithDividerH / 2)
                arr.push([x, y])
            }
            linesPoints.push(arr)
         }

         gameContext.data.lines = {
             points: prepearePathLines(linesPoints, interpolation)
         }


        this._config = gameContext.CONSTANTS.GAME_CONFIG.TYPES_WIN_LINES

        this.container = new this._PIXI.Container()

        const { fullWidth, fullHeight } = gameContext.data.slotMachine
        this.container.pivot.x = fullWidth / 2
        this.container.pivot.y = fullHeight / 2

        this._eventEmitter.subscribe('drawNewFrame', this._update.bind(this))


        this.lines = {}

        for (let i = 1; i < this._config.length; i ++ ) {
            const l = new WinLine(i, gameContext)
            this.container.addChild(l.container)
            this.lines[i] = l
        }

        gameContext.components.deviceResizer.setElementToResize({
            container: this.container,
            config: config.showModes,
        })
    }


    showLine(data) {
        this.lines[data.lineNumber] && this.lines[data.lineNumber].show()
    }


    _update(data) {
        for (let i = 1; i < this._config.length; i++) {
            this.lines[i].state !== 'none' && this.lines[i].update(data)
        }
    }

    clearAll() {
        for (let i = 1; i < this._config.length; i ++) {
            this.lines[i].hide()
        }
    }
}


/** ************************************************************
 * CALCULATE PATH ANIMATION LINES
 ** ************************************************************/

/**
 * Calculate interpolate main coordinates and add points buffer
 * @param { Array.<Object > } arr
 * @param { Number } interpolation
 * @returns { Object }
 *  @property { Object } points
 *      @property { Array } points
 *      @property { Number } nums
 */
export const prepearePathLines = (arr, interpolation) => {
    const points = {}
    for (let i = 0; i < arr.length; i++) {
        points[i + 1] = createPoints(arr[i], interpolation)
    }
    return points
}



const createPoints = (coords, interpolation) => {
    const pathPoints = []
    for (let i = 0; i < coords.length - 3; i += 2) {
        const x1 = coords[i][0], x2 = coords[i + 1][0], x3 = coords[i + 2][0];
        const y1 = coords[i][1], y2 = coords[i + 1][1], y3 = coords[i + 2][1];

        for (let j = 0; j < interpolation; j ++) {
            const t = j / interpolation
            const x = interpolate(x1, x2, x3, t)
            const y = interpolate(y1, y2, y3, t)
            pathPoints.push([x, y])
        }
    }

    const length = pathPoints.length
    const dist = Math.abs(coords[1][0] - coords[0][0]) / 2
    const startBufferStep = dist / length
    const endBufferStep = dist * 2 / length

    const lastCoordsIndex = coords.length - 2

    const startBufferPoints = []
    for (let i = 0; i < length; i ++) {
        startBufferPoints.push([
            coords[0][0] - dist + (startBufferStep * i),
            coords[0][1]
        ])
    }


    const endBufferPoints = []
    for (let i = 0; i < length; i ++) {
        endBufferPoints.push([
            coords[lastCoordsIndex][0] + (endBufferStep * i),
            coords[lastCoordsIndex][1]
        ])
    }


    return {
        points: [].concat(startBufferPoints, pathPoints, endBufferPoints),
        nums: length,
    }
}

const interpolate = (x1, x2, x3, t) => ((1 - t) * (1 - t) * x1) + (2 * t * (1 - t) * x2) + (t * t * x3)




