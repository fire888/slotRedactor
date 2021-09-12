const DELTA_TIME_OFFSET_BOTTOM_DROP = 100
const DELTA_TIME_OFFSET_TOP_DROP = 30
const TIME_DELTA_SMALL_DROP = 25

const TIME_DELAY_TO_TOP_DROP = 500



export class SlotMachineDrop {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI

        const {
            columnsNum,
            symbolsFullNum,
        } = gameContext.data.slotMachine


        /** columns */
        this._columnsActions = []
        config.config.spritesCache.setContext(config.config.SYMBOLS, this._PIXI)
        for (let i = 0; i < columnsNum; i++) {
            const action = new config.config.SlotColumnActions(gameContext, config, i)
            this._columnsActions.push(action)
        }

        /** rotate params */
        this.isCanRotate = true
        this._finisCombinations = null
        this._timeStart = null
        this._timers = []

        this._levels = {}

        /** create bottom columns */
        this._levels['bott'] = {
            arrColumns: this._gameContext.components['symbolsBottom'].arrColumns,
            contColumns: this._gameContext.components['symbolsBottom'].container,
        }
        this._levels['norm'] = {
            arrColumns: this._gameContext.components['symbolsCenter'].arrColumns,
            contColumns: this._gameContext.components['symbolsCenter'].container,
        }
        this._levels['top'] = {
            arrColumns: this._gameContext.components['symbolsTop'].arrColumns,
            contColumns: this._gameContext.components['symbolsTop'].container,
        }
        if (this._gameContext.components['slotsMask']) {
            this._gameContext.components['symbolsBottom'].setMask(this._gameContext.components['slotsMask'].container)
            this._gameContext.components['symbolsCenter'].setMask(this._gameContext.components['slotsMask'].container)
        }


        this.setLevelSymbols([
            ['norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm'],
        ])

        this._resolveStop = null
    }


    /** CHANGE SYMBOLS DATA ************************************************************/

    /**
     * @param {Array<Array<number>>} data
     */
    forceSetCombinationsData (data) {
        this._columnsActions.forEach((item, i) => item.forceSetColumnCombination(data[i]))
    }


    /**
     * Save copy and save in columns final symbols.
     * @param {Array<Array<number>>} data
     */
    setFinishCombinationsData (data) {
        this._finisCombinations = []
        for (let i = 0; i < data.length; i ++) {
            const wheel = []
            for (let j = 0; j < data[i].length; j ++) {
                wheel.push(data[i][j])
            }
            this._finisCombinations.push(wheel)
        }
        this._columnsActions.forEach((item, i) => item.setFinishCombination(data[i]))
    }


    /**
     * @param {array<array<string>>} data
     */
    setLevelSymbols (data) {
        const isSymbolsInBottom = isAnyValsEquals(data, "bott")
        this._levels['bott'].contColumns.renderable = isSymbolsInBottom
        this._gameContext.components['slotsDark'] &&
        (this._gameContext.components['slotsDark'].container.renderable = isSymbolsInBottom)

        for (let i = 0; i < data.length; i ++) {
            for (let j = 0; j < data[i].length; j ++) {
                this.setLevelSymbolsSingle(i, j, data[i][j])
            }
        }
    }

    /**
     * @param {number} columnId
     * @param {number} slotId
     * @param {string} level
     */
    setLevelSymbolsSingle (columnId, slotId, level) {
        this._levels[level].arrColumns[columnId].addChild(this._columnsActions[columnId].slots[slotId].container)
    }


    /**
     * @param {array<array<number>>} data
     */
    renderSlots (data) {
        for (let i = 0; i < data.length; i ++) {
            for (let j = 0; j < data[i].length; j ++) {
                this._columnsActions[i].slots[j].container.renderable = data[i][j] !== 0
            }
        }
    }


    setCustomAnimation (data) {
        this._columnsActions.forEach((item, i) => item.setCustomAnimation(data[i]))
    }


    /**
     * @param {Array<array<number>>} data (number === 1 || 0)
     */
    explodeSymbols (data) {
        const TIME_ANIMATION_EXPLODE = 700
        const explodeColumns = []

        for (let i = 0; i < data.length; ++i) {
            let isExplode = false
            let isMoveDown = false

            for (let j = data[i].length - 1; j > -1; --j) {
                if (data[i][j] === 1) {
                    isExplode = true

                    for (let k = j; k > -1; --k)
                        data[i][j] === 0 && (isMoveDown = true)
                }
            }

            isExplode && explodeColumns.push({ num: i, slots: data[i], isMoveDown })
        }


        return new Promise (resolve => {
            let countMove = 0
            let completeMovedColumns = 0

            const onMoved = () => {
                ++completeMovedColumns
                if (completeMovedColumns === explodeColumns.length - 1) resolve()
            }


            for (let i = 0; i < explodeColumns.length; ++i) {
                const { num, slots, isMoveDown } = explodeColumns[i]
                this._columnsActions[num].setWinAnimationCombination(slots)

                setTimeout(() => {
                    this._columnsActions[num].moveSymbolsOnEmptyPlaces(slots, onMoved)
                }, countMove * TIME_DELTA_SMALL_DROP + TIME_ANIMATION_EXPLODE)

                isMoveDown && ++countMove
            }
        })
    }


    resetSymbolsPoses(arr) {
        for (let i = 0; i < this._columnsActions.length; i++) {
            for (let j = 0; j < this._columnsActions[i].slots.length; ++j) {
                let offsetToTop = 0
                if (arr && arr[i] > 0 && j <= arr[i] - 1) {
                    offsetToTop = -1200
                }
                this._columnsActions[i].slots[j].container.y = this._gameContext.data.slotMachine.symbolWithDividerH * j + offsetToTop
                this._columnsActions[i].slots[j].level = j
            }
        }
    }


    animateSmallDrop(arr) {
        const arrSymbolsDrop = []


        for (let level = 3; level > 0; --level) {
            for (let i = 0; i < arr.length; ++i) {
                if (arr[i] === level || arr[i] > level) {
                    const time = arr[i+1] && (arr[i+1] === level || arr[i+1] > level) ? 100 : 400
                    arrSymbolsDrop.push({ col: i, symb: level - 1, time })
                }
            }
        }



        return new Promise(res => {
            !arrSymbolsDrop.length && res()

            const iterate = ind => {
                if (!arrSymbolsDrop[ind]) {
                    setTimeout(res , 1000)
                } else {
                    const {col, symb, time} = arrSymbolsDrop[ind]
                    this._columnsActions[col].dropBlowSymbol(symb)
                    setTimeout(() => iterate(++ind), time)
                }
            }
            iterate(0)
        })

    }



    /**
     * @param {number} col
     * @param {number} symb
     * @returns {Object} SlotItem instance
     */
    getSlot(col, symb) {
        return this._columnsActions[col].slots[symb]
    }




    /** METHODS ROTATIONS ************************************************************/

    /**
     * start rotate columns without stopping
     */
    rotateSimple (isFast) {
        if (!this.isCanRotate) return;
        this.isCanRotate = false
        this._timeStart = Date.now()

        if (isFast) {
            for (let i = 0; i < this._columnsActions.length; ++i) {
                for (let j = 0; j < this._columnsActions[i].slots.length; ++j) {
                    this._columnsActions[i].slots[j].container.y = -2000
                }
            }
            return;
        }

        let timerOffset = 0
        for (let i = 0; i < this._columnsActions.length; ++i) {
            this._columnsActions[i].startRotate(timerOffset)
            timerOffset += DELTA_TIME_OFFSET_BOTTOM_DROP
        }
    }

    /**
     * Set final distance to rotation columns
     * @param {Array} data { mode<string>, val<number> }
     * @return {Promise}
     */
    startStopping () {
        return new Promise(resolve => {
            this._resolveStop = resolve
            this._startStopping()
        })
    }

    forceStopping() {
        for (let i = 0; i < this._timers.length; ++i) {
            clearTimeout(this._timers[i])
        }
        for (let i = 0; i < this._columnsActions.length; ++i) {
            this._columnsActions[i].forceStopping()
        }
        this.isCanRotate = true
        this._timers = []
        setTimeout(() => this._resolveStop && this._resolveStop(), 100)
    }



    /** INTERNAL **********************************************************/

    _startStopping() {
        let countCompleted = 0

        const onComplete = () => {
            ++countCompleted
            if (countCompleted < 15) return;

            this._timers = []
            this.isCanRotate = true
            this._resolveStop()
        }


        const deltaTime = Date.now() - this._timeStart
        const delay = Math.max(TIME_DELAY_TO_TOP_DROP - deltaTime, 0)


        this._timers.push(setTimeout(() => {
            let timerOffset = 0
            for (let i = 0; i < this._columnsActions.length; ++i) {
                this._columnsActions[i].startStopping(timerOffset, onComplete)
                timerOffset += DELTA_TIME_OFFSET_TOP_DROP
            }
        }, delay))
    }
}




const isAnyValsEquals = (arr, val) => {
    for (let i = 0; i < arr.length; i ++) {
        for (let j = 0; j < arr[i].length; j ++) {
            if (arr[i][j] === val) {
                return true;
            }
        }
    }
    return false;
}

