
import * as TWEEN from '../../helpers/tween'

const INFINITI = 10000000

export class SlotColumnActions {
    constructor (gameContext, config, index) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this._machineData = gameContext.data.slotMachine
        this._machineConfig = gameContext.CONSTANTS.SLOT_MACHINE_CONFIG
        this._symbolsConfig = config.config.SYMBOLS


        this._id = index
        this._isCanForceStop = true
        const { dist, slotsOffset } = this._machineConfig.ANIMATION_SLOTS.playStates
        this._slotsOffset = this._id * slotsOffset
        this._defaultFullDist = dist + this._slotsOffset
        this._fullDist = INFINITI
        this._symbolsFullNum = this._machineData.symbolsFullNum
        this._indexToSetSymbol = this._symbolsFullNum

        this.isEasyPhaseRotation = false

        this._finishCombination = []
        this._callbackAfterStop = () => {}

        this._getSlotY = createGetterSlotY(this._machineData.symbolsFullNum, this._machineData.symbolWithDividerH)

        this.slots = []
        for (let i = 0; i < this._machineData.symbolsFullNum; ++i) {
            let slotItem = new config.config.SlotItem(gameContext, this._symbolsConfig ,i, index)
            slotItem.container.y = this._getSlotY(i)
            this.slots.push(slotItem)
        }
    }


    /**
     * @param {function} callback
     */
    setCallbackAfterStop (callback) {
        this._callbackAfterStop = callback
    }


    /**
     * @param {Array<number>} arr
     */
    forceSetColumnCombination (arr) {
        for (let i = 0; i < arr.length; i++) {
            this.slots[i].setNormalView(arr[i])
        }
    }

    /**
     * Save finish symbols
     * @param {Array<number>} arr
     */
    setFinishCombination (arr) {
        this._finishCombination = arr;
    }


    /**
     * @param {object} data
     *      @property {number} val
     *      @property {string} mode
     */
    rotate (data, dist) {
        const { mode, val } = data

        if (mode === 'normal') {
            if (dist < this._defaultFullDist) {
                /** if server response gets before default stop */
                this._fullDist = this._defaultFullDist
            } else {
                /** if server response gets after default stop */
                const n = this._symbolsFullNum
                this._fullDist = Math.floor((dist + n) / n) * n + n + this._slotsOffset
            }
        }
        if (mode === 'forceStop' && this.isEasyPhaseRotation ) {
            const n = this._symbolsFullNum
            this._fullDist = Math.floor((dist + n) / n) * n + n
        }
        if (mode === 'scattersLong') {
            if (dist < this._defaultFullDist) {
                /** if server response gets before default stop */
                this._fullDist = this._defaultFullDist + val
            } else {
                /** if server response gets after default stop */
                const n = this._symbolsFullNum
                this._fullDist = Math.floor((dist + n) / n) * n + n + this._slotsOffset + val
            }
        }
    }


    /**
     * @param {Array.<number>} arr
     */
    setWinAnimationCombination (arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i] === 1
                ? this.slots[i].setWinAnimationView(null)
                : this.slots[i].setNormalView()
        }
    }


    /**
     * @param {number} slotId
     * @param {boolean} is
     */
    startWinAnimateSingle (slotId, is) {
        is
            ? this.slots[slotId].setWinAnimationView(null)
            : this.slots[slotId].setNormalView()
    }


    updateByTween (dist) {
        for (let i = 0; i < this.slots.length; i ++) {
            this.slots[i].container.y = this._getSlotY(dist + i)
        }
    }


    updateByEasy (dist) {
        this._updateSlots(dist)

        this.isEasyPhaseRotation = dist < this._fullDist
        if (this.isEasyPhaseRotation) { return; }

        for (let i = 0; i < this.slots.length; ++i) {
            this.slots[i].setNormalView(this._finishCombination[i])
        }

        this._endRotate(dist)
            .then(this._resetSlotsPositions.bind(this))
            .then(() => {
                this._callbackAfterStop(this._id)
            })
    }


    /** PRIVATE ***************************************************/


    /**
     * - update slots position and change top symbols if Y < previous Y
     * @param { number } dist
     * @private
     */
    _updateSlots (dist) {
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i]

            /** change slot Y */
            const prevY = slot.container.y
            slot.container.y = this._getSlotY(dist + i)
            if (slot.container.y >= prevY) {
                continue;
            }


            /** check dist and set final symbol */
            if (!slot.flagIsFinishSymbol && dist >= this._fullDist - i) {
                this._isCanForceStop = false
                slot.setBlurView(this._finishCombination[i])
                --this._indexToSetSymbol
                slot.flagIsFinishSymbol = true
            }


            /** set random symbol */
            if (!slot.flagIsFinishSymbol) {
                const typeNumArr =
                    this._gameContext.components['helperSortData'].getRandomNumberNotIn(
                        this.slots.map(item => item.currentType))
                slot.setBlurView(typeNumArr)
            }
        }
    }


    /**
     * - create end tween to rotate slots
     * @returns {Promise}
     * @private
     */
    _endRotate (dist) {
        return new Promise (resolve => {
            const {
                middleValueOneAddToDist,
                middleValueTwoAddToDist,
                duration,
                timeSoundOffset,
            } = this._machineConfig.ANIMATION_SLOTS.endTween

            const endTween = TWEEN.createAuto({
                tweenType: 'autoUpdateColumnTwoVals',
                fromValue: dist,
                middleValueOne: dist + middleValueOneAddToDist,
                middleValueTwo: dist + middleValueTwoAddToDist,
                toValue: this._fullDist,
                duration,
                actionWithValue: val => {
                        for (let i = 0; i < this.slots.length; i ++) {
                            this.slots[i].container.y = this._getSlotY(val + i)
                        }
                    }
            })


            const columnData = {
                isScatter: this._gameContext.components['helperSortData'].checkerScatterInColumn(this._id),
                idColumnStopped: this._id,
            }


            // launch stop sound before real column stopped.
            setTimeout(() => {
                this._gameContext.components['eventEmitter'].emit('playAudioColumnRotationComplete', columnData)
            }, duration + (timeSoundOffset || -200))


            // resolve on rotation column complete
            endTween.start().then(() => {
                this._gameContext.components['eventEmitter'].emit('singleColumnRotationComplete', columnData)
                resolve()
            })
        })
    }



    /**
     * - reset data rotations and prepare to new rotation
     * @returns {Promise}
     * @private
     */
    _resetSlotsPositions() {
        return new Promise (resolve => {
            this._isCanForceStop = true
            this._fullDist = INFINITI
            this._indexToSetSymbol = this._symbolsFullNum
            for (let i = 0; i < this.slots.length; i++) {
                this.slots[i].flagIsFinishSymbol = false
            }
            resolve()
        })
    }
}


/**
 * Save FullNum & H of symbol
 * @param fullNum
 * @param symbolH
 * @returns {function}
 *      @param {number} destination
 */
const createGetterSlotY = (fullNum, symbolH) => destination => (destination % fullNum) * symbolH

