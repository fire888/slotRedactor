import * as TWEEN from '../../helpers/tween'

export class SlotMachine {
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
        for (let i = 0; i < columnsNum; ++i) {
            const action = new config.config.SlotColumnActions(gameContext, config, i)
            action.setCallbackAfterStop(this._checkIsAllColumnsRotationsComplete.bind(this))
            this._columnsActions.push(action)
        }

        /** rotate params */
        this.isCanRotate = true
        this._finisCombinations = null
        this._symbolsFullNum = symbolsFullNum

        this._spinner = createSpinner(gameContext, this._columnsActions)

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
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm'],
            ['norm', 'norm', 'norm', 'norm'],
        ])
        this.setLevelSymbolsSingle(0, 0, 'norm')
        this.setLevelSymbolsSingle(1, 0, 'norm')
        this.setLevelSymbolsSingle(2, 0, 'norm')
        this.setLevelSymbolsSingle(3, 0, 'norm')
        this.setLevelSymbolsSingle(4, 0, 'norm')

    }


    /** CHANGE SYMBOLS DATA ************************************************************/

    /**
     * @param {Array<Array<number>>} data
     */
    forceSetCombinationsData (data) {
        for (let i = 0; i < this._columnsActions.length; i++) {
            this._columnsActions[i].forceSetColumnCombination(data[i])
        }
    }


    /**
     * Save copy and save in columns final symbols.
     * @param {Array<Array<number>>} data
     */
    setFinishCombinationsData (data) {
        this._finisCombinations = []
        for (let i = 0; i < data.length; ++i) {
            const wheel = []
            for (let j =0; j < data[i].length; j ++) {
                wheel.push(data[i][j])
            }
            this._finisCombinations.push(wheel)
        }

        for (let i = 0; i < this._columnsActions.length; i++) {
            this._columnsActions[i].setFinishCombination(data[i])
        }
    }


    /**
     * @param {array<array<string>>} data
     */
    setLevelSymbols (data) {
        const isSymbolsInBottom = isAnyValsEquals(data, "bott")
        this._levels['bott'].contColumns.renderable = isSymbolsInBottom
        this._gameContext.components['slotsDark'] &&
            (this._gameContext.components['slotsDark'].container.renderable = isSymbolsInBottom)

        for (let i = 0; i < data.length; ++i) {
            for (let j = 1; j < data[i].length; ++j) {
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
        for (let i = 0; i < data.length; ++i) {
            for (let j = 1; j < data[i].length; ++j) {
                this._columnsActions[i].slots[j].container.renderable = data[i][j] !== 0
            }
        }
    }


    /**
     * @param {Array<array<number>>} data (number === 1 || 0)
     */
    startWinAnimate(data) {
        for (let i = 0; i < this._columnsActions.length; i++) {
            this._columnsActions[i].setWinAnimationCombination(data[i])
        }
    }


    /**
     * @param {number} columnId
     * @param {number} slotId
     * @param {boolean} is
     */
    startWinAnimateSingle(columnId, slotId, is) {
        this._columnsActions[columnId].startWinAnimateSingle(slotId, is)
    }


    /**
     * @param {number} indX
     * @param {number} indY
     * @param {boolean} isSet
     */
    setSymbolBackground (indX, indY, isSet) {
        this._gameContext.components['winSymbolsFrames'].showFrame(indX, indY, isSet)
    }


    /**
     * Clear all symbols backgrounds
     */
    removeSymbolsBackground () {
        this._gameContext.components['winSymbolsFrames'].clear()
    }


    /**
     * @param {string} level 'bott' || 'norm' || 'top'
     * @param {boolean} is
     */
    toggleMaskLevelSymbols (level, is) {
        // this._levels[level].contColumns.mask = is ? this._mask : null
        // this._gameContext.components['symbolsBottom'].setMask(this._gameContext.components['slotsMask'].container)
        // this._levels[level].contColumns.mask = is ? this._gameContext.components['slotsMask'].container : null
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
    rotateSimple () {
        if (!this.isCanRotate) return;
        this.isCanRotate = false

        this._gameContext.components['eventEmitter'].emit('startRotateSimple', null)
        this._spinner.startRotate()
    }

    /**
     * Set final distance to rotation columns
     * @param {Array} data { mode<string>, val<number> }
     * @return {Promise}
     */
    startStopping (data) {
        return new Promise(resolve => {
            this.resolveStop = resolve
            this._spinner.setEndDistances(data)
        })
    }


    /**
     * Stop rotations
     */
    forceStopping() {
        this._spinner.forceStopping()
    }



    /** INTERNAL **********************************************************/

    _checkIsAllColumnsRotationsComplete (idColumnStopped) {
        if (idColumnStopped === this._columnsActions.length - 1) {
             this.isCanRotate = true
             this._spinner.reset()
             this.resolveStop()
        }
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





/**
 *
 * @param {object} gameContext
 * @param {object} columns
 * @returns {{
 *      startRotate: (function()),
 *      setEndDistances: (function(*)),
 *      forceStopping: (function()),
 *      reset: (function())
*   }}
 */

function createSpinner (gameContext, columns) {
    let dist = 0

    /** start tween */
     const beginRotate = () => {
         return new Promise(resolve => {
             const {
                 fromValue,
                 middleValueOne,
                 middleValueTwo,
                 toValue,
                 duration
             } = gameContext.CONSTANTS.SLOT_MACHINE_CONFIG.ANIMATION_SLOTS.beginTween

             const beginTween = TWEEN.createAuto({
                 tweenType: 'autoUpdateColumnTwoVals',
                 fromValue,
                 middleValueOne,
                 middleValueTwo,
                 toValue,
                 duration,
                 actionWithValue: val => {
                     for (let i = 0; i < columns.length; i ++) {
                         columns[i].updateByTween(val)
                     }
                 },
             })

             beginTween.start()
                 .then(() => {
                     dist = toValue
                     resolve()
                 })
        })
     }


    /** easy rotate */
    let unSubscribeUpdate = null
    const { speed } = gameContext.CONSTANTS.SLOT_MACHINE_CONFIG.ANIMATION_SLOTS.playStates

    const easyRotate = () => {
        for (let i = 0; i < columns.length; i ++) {
            columns[i].isEasyPhaseRotation = true
        }

        unSubscribeUpdate = gameContext.components['eventEmitter'].subscribe('drawNewFrame', count => {
            dist += speed * count
            for (let i = 0; i < columns.length; ++i) {
                columns[i].isEasyPhaseRotation && columns[i].updateByEasy(dist)
            }
        })
    }


    return {
        startRotate () {
            beginRotate()
                .then(easyRotate)
        },
        setEndDistances (data) {
            dist = dist > 15 && dist < 49 ? 49 : dist
            for (let i = 0; i < columns.length; i++) {
                columns[i].rotate(data[i], dist)
            }
        },
        forceStopping () {
            for (let i = 0; i < columns.length; i++) {
                columns[i].rotate({ mode: 'forceStop' }, dist)
            }
        },
        reset () {
            unSubscribeUpdate()
            dist = 0
        },
    }
}

