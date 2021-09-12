import { showMessageLowBalance } from '../../elementsHTML/messLowBalance'


let BET_PER_LINE = null
let eventEmitter = null
let data = null


export class ChangerBet {
    constructor (gameContext, config) {
        eventEmitter = gameContext.components.eventEmitter
        BET_PER_LINE = config.config.BET_PER_LINE
        data = gameContext.data

        this.setBets = setBets
        this.addOne = addOne
        this.substractOne = substractOne
        this.setBetFromSlider = setBetFromSlider
        this.getDataToSend = getDataToSend
        this.showMessageLowBalance = showMessageLowBalance
    }
}


const setBets = serverResponse => {
    data.currency = serverResponse.defaultBets.currency
    data.bet.numLines = serverResponse.numberLines

    BET_PER_LINE = serverResponse.defaultBets.bets.split(';')
    for (let i = 0; i < BET_PER_LINE.length; ++i) {
        BET_PER_LINE[i] = +BET_PER_LINE[i]
    }


    serverResponse.previousBet = +serverResponse.previousBet



    if (serverResponse.previousBet === 0) {
        data.bet.betIndex = 0
    } else {
        for (let i = 0; i < BET_PER_LINE.length; ++i) {
            if (BET_PER_LINE[i] === serverResponse.previousBet) {
                data.bet.betIndex = i
            }
        }
    }


    data.bet.betPerLine = BET_PER_LINE
    data.bet.currentBet = BET_PER_LINE[data.bet.betIndex] * data.bet.numLines
    data.bet.lineValue = BET_PER_LINE[data.bet.betIndex]

    eventEmitter.emit('betValueChanged', null)
}



const addOne = () => {
    if (data.serverResponse.gift) return;

    const currentIndex = data.bet.betIndex

    const newIndex = BET_PER_LINE.length > currentIndex + 1
        ? currentIndex + 1
        : currentIndex

    data.bet.betIndex = newIndex
    data.bet.currentBet = BET_PER_LINE[newIndex] * data.bet.numLines
    data.bet.lineValue = BET_PER_LINE[newIndex]

    eventEmitter.emit('betValueChanged', null)
}


const substractOne = () => {
    if (data.serverResponse.gift) return;

    const currentIndex = data.bet.betIndex
    const newIndex = currentIndex - 1 > -1
        ? currentIndex - 1
        : 0
    data.bet.betIndex = newIndex

    data.bet.currentBet = BET_PER_LINE[newIndex] * data.bet.numLines
    data.bet.lineValue = BET_PER_LINE[newIndex]

    eventEmitter.emit('betValueChanged', null)
}


const setBetFromSlider = index => {
    data.bet.betIndex = index
    data.bet.currentBet = BET_PER_LINE[index] * data.bet.numLines

    eventEmitter.emit('betValueChanged', null)
    eventEmitter.emit('closeBetChoise', null)
}

const getDataToSend = () => ({
    numLines: data.bet.numLines,
    betPerLine: data.bet.betPerLine[data.bet.betIndex]
})

