import * as PIXI from 'pixi.js-legacy'
import './assets/z.png'



export const start = gameContext => {
    gameContext.PIXI = PIXI

    /** prepare game data */

    const { START_BET_INDEX, NUM_LINES, BET_PER_LINE, DEFAULT_START_BALANCE } = gameContext.CONSTANTS.GAME_CONFIG

    gameContext.data = {
        bet: {
            betIndex: START_BET_INDEX,
            numLines: NUM_LINES,
            currentBet: BET_PER_LINE[START_BET_INDEX] * NUM_LINES,
            betPerLine: BET_PER_LINE,
        },
        balance: {
            newHiddenValue: DEFAULT_START_BALANCE,
            value: DEFAULT_START_BALANCE,
        },
        autoPlayModeMustExit: false,
        showTotalWin: {
            time: 0,
        },
        showWinLines: {
            fullTime: 0,
            timesToStart: [],
        },
        winResponseData: {},
        state: null
    }


    /** prepare machine data */

     const conMach = gameContext.CONSTANTS.SLOT_MACHINE_CONFIG
     const conGame = gameContext.CONSTANTS.GAME_CONFIG

     const columnsNum = conGame.SLOTS_COLUMNS_LENGTH
     const symbolsNum = conGame.SLOTS_LENGTH

    //const symbolsFullNum = symbolsNum + 1
     const { countSymbolsToAddForFullNum, columnOffsetY  } = gameContext.CONSTANTS.SLOT_MACHINE_CONFIG

     const symbolsFullNum = symbolsNum + (countSymbolsToAddForFullNum === undefined
             ? 1
             : countSymbolsToAddForFullNum)
    const columnOffsetYValue = symbolsNum + (columnOffsetY === undefined
            ? 0
            : columnOffsetY)


     const symbolW = conMach.symbol.width
     const halfSymbolW = symbolW / 2
     const dividerW = conMach.verticalDivider
     const symbolWithDividerW = symbolW + dividerW

     const symbolH = conMach.symbol.height
     const halfSymbolH = symbolH / 2
     const dividerH = conMach.horizontalDivider
     const symbolWithDividerH = symbolH + dividerH

     const frameTop = conMach.frameTop
     const frameBottom = conMach.frameBottom
     const frameLeft = conMach.frameLeft
     const frameRight = conMach.frameRight

     const fullWidth = (symbolW * columnsNum) + (dividerW * (columnsNum - 1))
     const halfFullWidth = fullWidth / 2
     const fullHeight = (symbolH * symbolsNum) + (dividerH * (symbolsNum - 1))
     const halfFullHeight = fullHeight / 2
     

     gameContext.data.slotMachine = {
         fullWidth,
         fullHeight,
         halfFullWidth,
         halfFullHeight,

         symbolW,
         halfSymbolW,
         dividerW,
         symbolWithDividerW,

         symbolH,
         halfSymbolH,
         dividerH,
         symbolWithDividerH,

         columnsNum,
         columnOffsetY: columnOffsetYValue,
         symbolsNum,
         symbolsFullNum,

         frameTop,
         frameBottom,
         frameLeft,
         frameRight,
     }


    const { InitionStates, PlayStates } = gameContext.constructors
    new InitionStates(gameContext)
        .start(gameContext)
        .then(() => {
            new PlayStates(gameContext)
                .start()
        })
}

