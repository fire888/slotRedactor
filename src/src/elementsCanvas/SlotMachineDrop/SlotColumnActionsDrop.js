import * as TWEEN from '../../helpers/tween'



const DELAY_DROP_EACH_ITEM = 230
const TIME_ROTATE = 130






export class SlotColumnActionsDrop {
    constructor (gameContext, config, index) {
        this._gameContext =gameContext
        this._PIXI = this._gameContext.PIXI
        this._machineData = this._gameContext.data.slotMachine
        this._symbolsConfig = config.config.SYMBOLS


        this._id = index
        this._symbolsFullNum = this._machineData.symbolsFullNum
        this.isEasyPhaseRotation = false
        this._finishCombination = []
        this._isTopDropCanMoveAftrerMoveBottom = false
        this._isDropped = false
        this._tweens = []
        this._timers = []


        this._getSlotY = createGetterSlotY(this._machineData.symbolsFullNum, this._machineData.symbolWithDividerH)

        this.slots = []
        for (let i = 0; i < this._machineData.symbolsFullNum; ++i) {
            let slotItem = new config.config.SlotItem(gameContext, this._symbolsConfig ,i)
            slotItem.container.y = this._getSlotY(i)
            this.slots.push(slotItem)
        }
    }



    /**
     * @param {Array<number>} arr
     */
    forceSetColumnCombination (arr) {
        arr.forEach((item, i) => {
            this.slots[i].setNormalView(item)
        })
    }


    /**
     * Save finish symbols
     * @param {Array<number>} arr
     */
    setFinishCombination (arr) {
        this._finishCombination = arr;
    }


    startRotate (timer) {
        for (let i = this.slots.length - 1; i > -1; --i) {
            this._startMoveSlot(this.slots[i], i, (3 - i) * 50 + timer)
        }

        setTimeout(() => {
            this._isDropped = true
        }, 3 * 50 + timer)
    }


    startStopping (timer, onComplete) {
        for (let i = this.slots.length - 1; i > -1; i--) {
            this._endMoveSlot(this.slots[i], i, (2 - i) * DELAY_DROP_EACH_ITEM + timer, onComplete)
        }
    }

    forceStopping () {
        for (let i = 0; i < this._tweens.length; ++i) {
            this._tweens[i] && this._tweens[i].stop && this._tweens[i].stop()
        }
        for (let i = 0; i < this._timers.length; ++i) {
            clearTimeout(this._timers[i])
        }
        for (let i = 0; i < this.slots.length; ++i) {
            this.slots[i].container.y = i * this._machineData.symbolWithDividerH
            this.slots[i].setDropView(this._finishCombination[i])
        }


        const rotateTween = TWEEN.createAuto({
            tweenType: 'autoUpdateColumnTwoVals',
            fromValue: 0.0001,
            middleValueOne: -.1,
            middleValueTwo: .1,
            toValue: 0,
            duration: 100,
            actionWithValue: val => {
                for (let i = 0; i < this.slots.length; ++i) {
                    this.slots[i].container.rotation = val
                }
            }
        })
        rotateTween.start()
    }


    putOnEndPositions() {
        for (let i = 0; i < this.slots.length; ++i) {
            this.slots[i].container.y = i * this._machineData.symbolWithDividerH
        }
    }



    playWinAnimation (arr) {
        for (let i = 1; i < this.slots.length; i++) {
            this.slots[i].setWinView(arr[i])
        }
    }


    /**
     * @param {Array.<number>} arr
     */
    setWinAnimationCombination (arr) {
        for (let i = arr.length - 1; i > -1; i--) {
            if (arr[i] === 0) continue;

            this.slots[i].setWinAnimationView()
            this.slots[i].isBlown = true
        }
    }


    setCustomAnimation (arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            if (arr[i] === 0) continue;

            this.slots[i].setCustomView()
        }
    }



    moveSymbolsOnEmptyPlaces (arr, callback) {
        const OFFSET_SYMBOL_TIME = 50
        const DROP_TIME = 250
        const ANIMATION_TIME = 233

        let maxEmptyCount = 0
        for (let i = 2; i > -1; --i) {
            let bottomEmptyCount = 0

            if (this.slots[i].isBlown) continue;

            for (let j = i; j < arr.length; ++j) {
                if (this.slots[j].isBlown) {
                    ++bottomEmptyCount
                }
            }
            maxEmptyCount < bottomEmptyCount && (maxEmptyCount = bottomEmptyCount)

            bottomEmptyCount > 0 && setTimeout(() => {
                const moveTween = TWEEN.createAuto({
                    tweenType: 'autoUpdateColumnTwoVals',
                    fromValue: this.slots[i].container.y,
                    middleValueOne: this.slots[i].container.y + 30,
                    middleValueTwo: this.slots[i].container.y + this._machineData.symbolWithDividerH * bottomEmptyCount - 30,
                    toValue: this.slots[i].container.y + this._machineData.symbolWithDividerH * bottomEmptyCount,
                    duration: DROP_TIME,
                    actionWithValue: val => this.slots[i].container.y = val,
                })
                moveTween.start()
                    .then(() => {
                        const rotateTween = TWEEN.createAuto({
                            tweenType: 'autoUpdateColumnTwoVals',
                            fromValue: 0,
                            middleValueOne: -0.1,
                            middleValueTwo: 0.1,
                            toValue: 0,
                            duration: TIME_ROTATE,
                            actionWithValue: val => this.slots[i].container.rotation = val,
                        })
                        rotateTween.start()
                    })
            },  (3 - i) * OFFSET_SYMBOL_TIME)
        }

        for (let i = 0; i < this.slots.length; ++i)
            this.slots[i].isBlown = false

        setTimeout(callback, maxEmptyCount * OFFSET_SYMBOL_TIME + DROP_TIME + ANIMATION_TIME)
    }





    dropBlowSymbol (ind) {
        const TIME_OFFSET_ROTATE = 400
        //const TIME_DROP = 500
        const TIME_DROP = 300
        const finishPos = this._machineData.symbolWithDividerH * ind


        const currentSlot = this.slots[ind]
        const moveTween = TWEEN.createAuto({
            tweenType: 'autoUpdateColumnTwoVals',
            fromValue: -1200 + finishPos,
            middleValueOne: -1000 + finishPos,
            middleValueTwo: finishPos + 100,
            toValue: finishPos,
            duration: TIME_DROP,
            actionWithValue: val => currentSlot.container.y = val,
        })



        setTimeout(() => {
            moveTween
                .start()
                .then(() => {
                    this._gameContext.components['eventEmitter'].emit('singleStoneDropped', {
                        column: this._id,
                        slot: ind,
                        mode: 'smallDrop',
                        type: this.slots[ind].currentType
                    })

                    const rotateTween = TWEEN.createAuto({
                        tweenType: 'autoUpdateColumnTwoVals',
                        fromValue: 0,
                        middleValueOne: -0.1,
                        middleValueTwo: 0.1,
                        toValue: 0,
                        duration: TIME_ROTATE,
                        actionWithValue: val => currentSlot.container.rotation = val,
                    })
                    rotateTween.start()
                })
        }, TIME_OFFSET_ROTATE)
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




    /** PRIVATE ***************************************************/

    _startMoveSlot (slot, i, timeOffsetStart) {
        const beginTween = TWEEN.createAuto({
            tweenType: 'autoUpdateColumnTwoValsAndOffset',
            fromValue: slot.container.y,
            middleValueOne: slot.container.y - 100,
            middleValueTwo: slot.container.y + 500,
            toValue: slot.container.y + 2000,
            duration: 500,
            timeOffsetStart,
            actionWithValue: val => slot.container.y = val,
        })

        this._tweens.push(beginTween)
        beginTween.start()
    }


    _endMoveSlot (slot, i, timeOffsetStart, onComplete) {
        const lastPos = i * this._machineData.symbolWithDividerH

        this._timers.push(setTimeout(() => {
            slot.setNormalView(this._finishCombination[i])

            this._timers.push(setTimeout(() => {
                slot.setDropView(this._finishCombination[i])
            }, timeOffsetStart + 250))

            this._timers.push(setTimeout(() => {
                for (let i = 0; i < this._timers.length; ++i) {
                    clearTimeout(this._timers[i])
                }

                slot.container.y = lastPos
            }, timeOffsetStart + 250 + 500))



            const beginTween = TWEEN.createAuto({
                tweenType: 'autoUpdateColumnTwoValsAndOffset',
                fromValue: lastPos - 1500,
                middleValueOne: lastPos - 1000,
                middleValueTwo: lastPos + 100,
                toValue: lastPos,
                duration: 350,
                timeOffsetStart,
                actionWithValue: val => slot.container.y = val,
            })

            this._tweens.push(beginTween)

            beginTween
                .start()
                .then(() => {
                    this._gameContext.components['eventEmitter'].emit('singleStoneDropped', {
                        column: this._id,
                        slot: i,
                        mode: 'bigDrop',
                        type: slot.currentType
                    })

                    onComplete()

                    const rotateTween = TWEEN.createAuto({
                        tweenType: 'autoUpdateColumnTwoVals',
                        fromValue: 0,
                        middleValueOne: -0.1,
                        middleValueTwo: 0.1,
                        toValue: 0,
                        duration: TIME_ROTATE,
                        actionWithValue: val => slot.container.rotation = val,
                    })
                    this._tweens.push(rotateTween)

                    rotateTween.start()

                    if (i === 0) {
                        this._isDropped = false
                        this._isTopDropCanMoveAftrerMoveBottom = false
                    }
                })
        }, timeOffsetStart))
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

