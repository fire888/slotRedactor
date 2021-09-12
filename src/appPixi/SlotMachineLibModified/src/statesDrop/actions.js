import * as String from '../helpers/string'



export function showWinLines (callback) {
    const { slotMachine, winLines, ui, eventEmitter, helperSortData, audioManager } = this._gameContext.components
    const { serverResponse } = this._gameContext.data
    const gameContext = this._gameContext

    const arrDataWinAnimations = getWinData(this._gameContext)
    let arrCountBlownSymbols = []


    const makeSmallDrop = dataMachine => {
        return new Promise(resolve => {
            slotMachine.resetSymbolsPoses(arrCountBlownSymbols)
            slotMachine.forceSetCombinationsData(dataMachine.wheels)

            setTimeout(() => {
                slotMachine.animateSmallDrop(arrCountBlownSymbols)
                    .then(resolve)
            }, 1000)
        })
    }


    const animateSuperWin = dataMachine => {
        return new Promise(resolve => {
            if (this._gameContext.components['superPrizeEffect'] &&
                this._gameContext.components['changerBalance'].checkSuperWinByVal(dataMachine.respinWin)
            ) {
                const { superPrizeEffect, changerBalance } = this._gameContext.components
                const superWinAnimationData = changerBalance.checkSuperWinByVal(dataMachine.respinWin)
                superPrizeEffect.start(superWinAnimationData, dataMachine.respinWin)
                    .then(resolve)
            } else {
                resolve()
            }
        })
    }


    const animateLines = dataMachine => {
        return new Promise(resolveAnimateLines => {
            const arrsWinSymbols = helperSortData.createWinsArrs(dataMachine.wheels, dataMachine.winLines, 'bott', 'top')

            for (let i = 0; i < dataMachine.winLines.length; ++i) {
                this._timers[i] = setTimeout(() => {
                    eventEmitter.emit('startAnimateLine', i)
                    audioManager.play('winLine')
                    winLines && winLines.showLine(dataMachine.winLines[i])
                    ui.setBigMes(String.getWinText(dataMachine.winLines[i], serverResponse.totalWin))
                    slotMachine.setLevelSymbols(arrsWinSymbols[i])
                }, 700 * i)
            }

            setTimeout(() => {
                slotMachine.setLevelSymbols(helperSortData.createFilled('norm'))
                resolveAnimateLines()
            }, dataMachine.winLines.length * 700 + 300)
        })
    }


    async function iterate(ind) {
        eventEmitter.emit('respinCount', ind)


        const dataMachine = arrDataWinAnimations[ind]

        if (ind !== 0) {
            await browserOn()
            await makeSmallDrop(dataMachine)
        }
        if (dataMachine.winLines) {
            await browserOn()
            await animateSuperWin(dataMachine)
            await browserOn()
            await animateLines(dataMachine)

            /** set win by states *******/
            if (gameContext.data.currentStates === 'freeStates') {
                if (serverResponse.gift && serverResponse.gift.current_giftspin !== 0) {
                    ui.setWinValue(serverResponse.gift.total_win - serverResponse.totalWin + dataMachine.win)
                } else {
                    ui.setWinValue(serverResponse.additionalInfo.total_free_game_win - serverResponse.totalWin + dataMachine.win)
                }
            } else {
                if (serverResponse.gift && serverResponse.gift.current_giftspin !== 0) {
                    ui.setWinValue(serverResponse.gift.total_win - serverResponse.totalWin + dataMachine.win)
                } else {
                    ui.setWinValue(dataMachine.win)
                }
            }

            audioManager.play('stone_explosion')
            setTimeout(() => eventEmitter.emit('explodeSymbols'), 500)


            const winSymbols = helperSortData.createAllWins(dataMachine.wheels, dataMachine.winLines, 0, 1)
            arrCountBlownSymbols = prepareCountSmallDrop(winSymbols)
            await browserOn()
            await slotMachine.explodeSymbols(winSymbols)
        } else {
            eventEmitter.emit('respinCount', 0)
        }

        ++ind
        if (!arrDataWinAnimations[ind]) {
            const { serverResponse } = gameContext.data
            serverResponse.gift && serverResponse.gift.current_giftspin !== 0 && ui.setWinValue(serverResponse.gift.total_win)

            return callback()
        }
        await browserOn()
        return iterate(ind)
    }

    eventEmitter.emit('onEnterShowWinLines', null)
    iterate(0)
}






export const getWinData = gameContext => {
    const { serverResponse, currentStates } = gameContext.data
    const count = serverResponse.wheels[0].length / 3


    /** Create sets views */
    const arrViews = []
    for (let i = 0; i < count; ++i) {
        const wheels = []
        for (let j = 0; j < serverResponse.wheels.length; ++j) {
            const v = []
            for (let k = i * 3; k < (i + 1) * 3; ++k) {
                v.push(serverResponse.wheels[j][k])
            }
            wheels.push(v)
        }
        arrViews.push(wheels)
    }


    /** create sets of winLines */
    const arrSpinsWinLines = []
    const wins = []

    let win = 0
    const respinsWins = []
    for (let i = 0; i < count - 1; ++i) {
        const spinWinLines = []
        let respinWin = 0
        for (let j = 0; j < serverResponse.winLines.length; ++j) {
            if (serverResponse.winLines[j].respinNumber !== i) continue;
            if (serverResponse.winLines[j].win === 0) continue;

            spinWinLines.push(serverResponse.winLines[j])
            win += serverResponse.winLines[j].win
            respinWin += serverResponse.winLines[j].win
        }
        arrSpinsWinLines.push(spinWinLines)
        wins.push(win)
        respinsWins.push(respinWin)
    }


    /** Create returned object */
    const arr = []
    for (let i = 0; i < count; ++i) {
        arr.push({
            wheels: arrViews[i],
            winLines: arrSpinsWinLines[i] || null,
            win: wins[i] || null,
            respinWin: respinsWins[i] || null,
        })
    }

    return arr
}



const prepareCountSmallDrop = arr => {
    const result = []
    for (let i = 0; i < arr.length; ++i) {
        let count = 0;
        for (let j = 0; j < arr[i].length; ++j) {
            arr[i][j] !== 0 && ++count
        }
        result.push(count)
    }
    return result
}



const browserOn = () => new Promise(resolve => requestAnimationFrame(resolve))

