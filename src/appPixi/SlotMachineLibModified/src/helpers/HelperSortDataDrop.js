

let SYMBOLS = null, SLOTS_COLUMNS_LENGTH = null, SLOTS_LENGTH = null, TYPES_WIN_LINES = null,
    SCATTER_ID = null,
    MINI_GAME_SCATTER_ID = null
let gameContext = null



export class HelperSortDataDrop {
    constructor (gameContextLink, config) {
        gameContext = gameContextLink
        SYMBOLS = config.config.SYMBOLS
        TYPES_WIN_LINES = gameContext.CONSTANTS.GAME_CONFIG.TYPES_WIN_LINES
        SLOTS_COLUMNS_LENGTH = gameContext.data.slotMachine.columnsNum
        SLOTS_LENGTH = gameContext.data.slotMachine.symbolsFullNum
        SCATTER_ID = gameContext.CONSTANTS.GAME_CONFIG.SCATTER_ID
        gameContext.CONSTANTS.GAME_CONFIG.hasOwnProperty('MINI_GAME_SCATTER_ID') && (MINI_GAME_SCATTER_ID = gameContext.CONSTANTS.GAME_CONFIG.MINI_GAME_SCATTER_ID)

        this.getRandomNumberNotIn = getRandomNumberNotIn
        this.createFilled = createFilled
        this.prepareFinishSymbols = prepareFinishSymbols
        this.prepareFinishSymbolsNotRan = prepareFinishSymbolsNotRan
        this.getTimesRotations = getTimesRotations
        this.createAllWins = createAllWins
        this.createWinsArrs = createWinsArrs
        this.createLevelSymbols = createLevelSymbols
        this.createLevelSymbolsArrs = createLevelSymbolsArrs
        this.checkerScatterInColumn = checkerScatterInColumn
        this.checkScatterLine = checkScatterLine
        this.createArrBonuses = createArrBonuses
        this.isAllMembersEquals = isAllMembersEquals
        this.checkWild = checkWild
        this.checkWildInLine = checkWildInLine
        this.getTimeTotalWin = getTimeTotalWin
        this.getTimesWinLines = getTimesWinLines
        this.prepareFreeWinPerLinesData = prepareFreeWinPerLinesData
    }
}



/** *************************************************************************
 *  ROTATION FUNCTIONS
 ** *************************************************************************/

/**
 * Return number not in array
 * @param {Array} arr
 * @returns {number}
 */
export const getRandomNumberNotIn = arr => {
    let num = Math.floor(Math.random() * SYMBOLS.length)

    let is = true
    for (let i = 0; i < arr.length; i++) {
        num === arr[i] && (is = false)
    }
    return is ? num : getRandomNumberNotIn(arr)
}



/**
 * Create Arrays in Array filled val or random numbers
 * @param val // {Number} or {String === 'random'}
 * @returns {Array.<Number>}
 */
export const createFilled = val => {
    const arr = []
    for (let i = 0; i < SLOTS_COLUMNS_LENGTH; i ++) {
        let innerArr = []
        for (let j = 0; j < SLOTS_LENGTH; j ++) {
            innerArr.push((val === 'random') ? getRandomNumberNotIn(innerArr) : val)
        }
        arr.push(innerArr)
    }
    return arr
}



/**
 * Create copy resp.wheels and insert before random number.
 * @param { Object } resp
 *  @property { Array.<Array>.<Number> } wheels
 * @returns { Array.<Array>.<Number> }
 */
export const prepareFinishSymbols = resp => {
    const len = SYMBOLS.length

    let symbolsTypes = []

    resp.wheels.forEach(item => {
        item = item.map(num => num < len ? num : Math.floor(num % len))
        symbolsTypes.push(item)
    })
    return symbolsTypes
}


export const prepareFinishSymbolsNotRan = resp => {
    let symbolsTypes = []
    for (let i = 0; i < resp.wheels.length; ++i) {
        const wheel = []
        for (let j = 0; j < resp.wheels[i].length; ++j) {
            wheel.push(resp.wheels[i][j])
        }
        symbolsTypes.push(wheel)
    }
    return symbolsTypes
}



/**
 * Create durations columns rotate, check first two scatters, create durations columns effects.
 * @param { Object } resp
 *      @property { Array.<Array>.<Number> } wheels
 * @returns { Object }
 *      @property { Array.<Number> } timerRotations
 *      @property { Boolean } isEffect
 *      @property { Array.<Object> } arrColumnsEffect
 *          @property { Number } columnId
 *          @property { Number } startTime
 *          @property { Number } endTime
 */
export const getTimesRotations = (resp) => {
    const { wheels } = resp
    const { scattersOffset } = gameContext.CONSTANTS.SLOT_MACHINE_CONFIG.ANIMATION_SLOTS['playStates']



    /** check two scattes in first three columns */

    let countScattersMiniGame = 0
    let countScatters = 0

    for (let i = 0; i < wheels.length - 2; i++) {
        for (let j = 0; j < wheels[i].length; j++) {
            if (SCATTER_ID === wheels[i][j]) {
                countScatters ++
            }
            if (MINI_GAME_SCATTER_ID === wheels[i][j]) {
                countScattersMiniGame ++
            }
        }
    }

    const countScattersDone = countScattersMiniGame === 2 || countScatters === 2
    const isEffect = !!countScattersDone

    /** create data for components */

    const machineRotData = []
    const columnsEffectData = []

    for (let i = 0; i < SLOTS_COLUMNS_LENGTH; i++) {
        machineRotData.push({ mode: 'normal' })
        columnsEffectData.push({ mode: 'normal' })
    }

    if (!isEffect) {
        return {
            machineRotData,
            columnsEffectData,
            isEffect,
        }
    }


    /** update data two last columns if is effect */
    let lenEffect = 1

    columnsEffectData[wheels.length - 2].mode = 'scattersLong'

    let isLastColumnRotate = true
    for (let j = 0; j < wheels[wheels.length - 2].length; j++) {
        wheels[wheels.length - 2][j] === SCATTER_ID && (isLastColumnRotate = false)
    }

    if (isLastColumnRotate) {
        lenEffect = 2
        columnsEffectData[wheels.length - 1].mode = 'scattersLong'
    }


    /////////////////////////////

    let val = 0
    for (let i = 0; i < lenEffect; i++) {
        val += scattersOffset
        for (let j = 3 + i; j < 5; j ++) {
            machineRotData[j].mode = 'scattersLong'
            machineRotData[j].val = val
        }
    }

    return {
        machineRotData,
        columnsEffectData,
        isEffect,
    }
}


/** ***********************************************************************
 *  WIN ANIMATION FUNCTIONS
 ** ***********************************************************************/

/**
 * Create filled array of all win symbols
 * @param { Array.<Array>.<Number> } wheels
 * @param { Array.<Object> } winLines
 *  @property { Number } lineNumber
 *  @property { Number } length
 *  @property { Number } symbolId
 * @param valZero
 * @param val
 * @returns { Array.<Array>.<Number> }
 */
const createAllWins = (wheels, winLines, valZero, val) => {
    const arr = createFilled(0)

    for (let i = 0; i < winLines.length; i++) {
        _compareWheelsAndWinLinesAndSetVal(arr, wheels, winLines[i], val)
    }

    return arr
}


/**
 * Create filled arrays of single wins symbols
 * @param { Array.<Array>.<Number> } wheels
 * @param { Array.<Object> } winLines
 *  @property { Number } lineNumber
 *  @property { Number } length
 *  @property { Number } symbolId
 * @param valZero
 * @param val
 * @returns { Array.<Array>.<Array>.<Number> }
 */

export const createWinsArrs = (wheels, winLines, valZero, val) => {
    const arrAnimateSymbols = []

    for (let i = 0; i < winLines.length; i++) {
        const arr = createFilled(valZero)
        _compareWheelsAndWinLinesAndSetVal(arr, wheels, winLines[i], val)
        arrAnimateSymbols.push(arr)
    }

    return arrAnimateSymbols
}


export const createLevelSymbols = (wheels, winLines) => {
    const arr = createFilled('norm')

    for (let i = 0; i < winLines.length; i++) {
        _compareWheelsAndWinLinesAndSetVal(arr, wheels, winLines[i], 'top')
    }

    return arr
}


export const createLevelSymbolsArrs = (wheels, winLines) => {
    const arrAnimateSymbols = []

    for (let i = 0; i < winLines.length; i++) {
        const arr = createFilled('bott')
        _compareWheelsAndWinLinesAndSetVal(arr, wheels, winLines[i], 'top')
        arrAnimateSymbols.push(arr)
    }

    return arrAnimateSymbols
}


export const checkerScatterInColumn = colNum => {
    const { wheels } = gameContext.data.serverResponse
    for (let i = 0; i < wheels[colNum].length; i ++) {
        if (wheels[colNum][i] === SCATTER_ID || wheels[colNum][i] === MINI_GAME_SCATTER_ID) {
            let scatterCount = 0;
            for (let c = colNum; c > -1; c --) {
                for (let s = 0; s < wheels[c].length; s++) {
                    if (wheels[c][s] === SCATTER_ID) {
                        scatterCount ++;
                    }
                    if (wheels[c][s] === MINI_GAME_SCATTER_ID) {
                        scatterCount ++;
                    }
                }
            }
            return { scatterCount }
        }
    }
    return false;
}


export const checkScatterLine = serverResponse => {
    const { winLines } = serverResponse
    for (let i = 0; i < winLines.length; i ++) {
        if (winLines[i].lineType === "SCATTER_LINE") return true;
    }
    return false;
}

/**
 * Compare winLine.symbolId with TYPES_WIN_LINES or check scatters in wheels
 * @param { Array.<Array>.<Number> } arr: to fill new values
 * @param { Array.<Array>.<Number> } wheels
 * @param { Object } winLine
 *  @property { Number } lineNumber
 *  @property { Number } length
 *  @property { Number } symbolId
 * @param { Number } val
 * @private
 */
const _compareWheelsAndWinLinesAndSetVal = (arr, wheels, winLine, val) => {

    if (winLine['lineNumber'] > TYPES_WIN_LINES.length - 1) {
        return
    }

    let count = 0

    // scatters //
    if (winLine['lineNumber'] === 0) {
        for (let i = 0; i < wheels.length; i++) {
            for (let j = 0; j < wheels[j].length; j ++) {
                if (count < winLine.length && winLine.symbolId === wheels[i][j]) {
                    count ++
                    arr[i][j] = val
                }
            }
        }
        return
    }

    // normal lines
    const typeLine = TYPES_WIN_LINES[winLine['lineNumber']]

    for (let i = 0; i < typeLine.length; i++ ) {
        if (count < winLine['length']) {
            count ++
            arr[i][typeLine[i]] = val
        }
    }
}


/**
 * Create arrays of each new bonus symbols, array animated bonus symbols, array coordinates each bonus symbols
 * @param { Array.<Array>.<Number> } wheels
 * @param { Object } winLine
 *      @property { Number } lineNumber
 *      @property { Number } length
 *      @property { Number } symbolId
 * @returns { Object }
 *      @property { Array.<Array>.<Array>.<Number> } symbols
 *      @property { Array.<Array>.<Number> } animation
 *      @property { Array.<Array>.<Number> } arrCoordInd
 */
export const createArrBonuses = (wheels, winLine) => {
    const arrCoordsInd = []

    for (let i = 0; i < wheels.length; i ++) {
        for (let j = 1; j < wheels[i].length; j ++) {
            if (wheels[i][j] == winLine.symbolId) {
                for (let k = 1; k < wheels[i].length; k++) {
                    arrCoordsInd.push([i, k])
                }
            }
        }
    }

    const arrSymb = []
    const arrAnim = createFilled(0)

    for (let i = 0; i < arrCoordsInd.length; i++) {
        arrAnim[arrCoordsInd[i][0]][arrCoordsInd[i][1]] = 1
        const arr = createCopy(wheels)
        for (let j = 0; j < i || j == i; j++) {
            arr[arrCoordsInd[j][0]][arrCoordsInd[j][1]] = winLine.symbolId
        }
        arrSymb.push(arr)
    }



    return {
        symbols: arrSymb,
        animation: arrAnim,
        arrCoordsInd,
    }
}


const createCopy = arr => arr.map(item => item.map(innerItem => innerItem))


/**
 * @param { Array.<Array>.<any> } arr
 * @param val
 * @returns { boolean }
 */
export const isAllMembersEquals = (arr, val) => {
    for (let i = 0; i < arr.length; i ++) {
        for (let j = 0; j < arr[i].length; j ++) {
            if (arr[i][j] != val) {
                return false;
            }
        }
    }
    return true;
}



export const checkWild = function (wheels, winLines) {
    for (let i = 0; i < winLines.length; i ++) {
        if (winLines[i].lineType === "SIMPLE_LINE") {
            const lineData = TYPES_WIN_LINES[winLines[i].lineNumber]
            for (let j = 0; j < lineData.length; j ++) {
                if (wheels[j][lineData[j]] === 0) {
                    return true
                }
            }
        }
    }
    return false
}



export const checkWildInLine = function (winLine, wheels) {
    const lineData = TYPES_WIN_LINES[winLine.lineNumber]
    for (let j = 0; j < lineData.length; j ++) {
        if (wheels[j][lineData[j]] === 0) {
            return true
        }
    }
    return false
}



export const getTimeTotalWin = gameContext => {
    const { wheels, winLines } = gameContext.data.serverResponse
    const { SLOT_MACHINE_CONFIG } = gameContext.CONSTANTS

    const wins = createAllWins(wheels, winLines, 0, 1)

    let time = 0

    for (let i = 0; i < wins.length; i ++) {
        for (let j = 0; j < wins[i].length; j ++) {
            if (wins[i][j] === 1) {
                const symbolId = wheels[i][j - 1]
                const t = (SYMBOLS[symbolId] && SYMBOLS[symbolId].winAnimationTime) || 1500 // TODO: 1500 get from config
                time < t && (time = t)
            }
        }
    }
    time === 0 && (time = SLOT_MACHINE_CONFIG.ANIMATION_SYMBOLS[gameContext.data.currentStates].timeShowTotalWin)
    return time
}



export const getTimesWinLines = gameContext => {
    const { wheels, winLines } = gameContext.data.serverResponse
    const { SLOT_MACHINE_CONFIG } = gameContext.CONSTANTS

    let fullTime = 0
    const arrTimes = []

    const wins = createWinsArrs(wheels, winLines, 0, 1)

    for (let k = 0; k < wins.length; k ++ ) {
        let time = 0

        for (let i = 0; i < wins[k].length; i++) {
            for (let j = 0; j < wins[k][i].length; j++) {
                if (wins[k][i][j] === 1) {
                    const symbolId = wheels[i][j-1]
                    const t = (SYMBOLS[symbolId] && SYMBOLS[symbolId].winAnimationTime && SYMBOLS[symbolId].winAnimationTime) || 0
                    time < t && (time = t)
                }
            }
        }

        time === 0 && (time = SLOT_MACHINE_CONFIG.ANIMATION_SYMBOLS[gameContext.data.currentStates].timeShowWinLine)
        arrTimes.push(time)
        fullTime += time
    }

    const timesToStart = []
    for (let i = 0; i < arrTimes.length; i ++) {
        timesToStart.push(0)
    }

    for (let i = 0; i < arrTimes.length; i ++) {
        for (let j = 0; j < i; j ++) {
            timesToStart[i] += arrTimes[j]
        }
    }


    return {
        timesToStart,
        fullTime,
    }
}



/***********************************************/
const prepareFreeWinPerLinesData = gameContext => {

    const arrSimpleWinLines = gameContext.data.serverResponse.winLines.filter(item =>
        item.lineType === "SIMPLE_LINE"
        || item.lineType === "SCATTER_LINE"
        || item.lineType === "WILD_X2_LINE"
        || item.lineType === "SIMPLE_WILD_LINE"
        || (item.lineType === "BONUS_LINE" && item.win === 0)
    )


    const { wheels } = gameContext.data.serverResponse
    const { SLOT_MACHINE_CONFIG } = gameContext.CONSTANTS


    let fullTime = 0
    const arrTimes = []

    const animationSymbolsByLine = createWinsArrs(gameContext.data.serverResponse.wheels, arrSimpleWinLines, 0, 1)

    for (let k = 0; k < animationSymbolsByLine.length; k ++ ) {
        let time = 0

        for (let i = 0; i <  animationSymbolsByLine[k].length; i++) {
            for (let j = 0; j < animationSymbolsByLine[k][i].length; j++) {
                if (animationSymbolsByLine[k][i][j] === 1) {
                    const symbolId = wheels[i][j-1]
                    const t = SYMBOLS[symbolId].winAnimationTime || 0
                    time < t && (time = t)
                }
            }
        }

        time === 0 && (time = SLOT_MACHINE_CONFIG.ANIMATION_SYMBOLS[gameContext.data.currentStates].timeShowWinLine)
        arrTimes.push(time)
        fullTime += time
    }

    const timesToStart = []
    for (let i = 0; i < arrTimes.length; i ++) {
        timesToStart.push(0)
    }

    for (let i = 0; i < arrTimes.length; i ++) {
        for (let j = 0; j < i; j ++) {
            timesToStart[i] += arrTimes[j]
        }
    }


    const levelSymbolsArrs = createLevelSymbolsArrs(gameContext.data.serverResponse.wheels, arrSimpleWinLines)

    return {
        fullTime,
        timesToStart,
        animationSymbolsByLine,
        levelSymbolsArrs,
        arrSimpleWinLines,
    }
}



