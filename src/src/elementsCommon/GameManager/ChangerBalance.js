let MAX_CURRENT_BALANCE_VALUE = null
let eventEmitter = null
let data = null
let gameContextLink = null


export class ChangerBalance {
    constructor (gameContext, config) {
        MAX_CURRENT_BALANCE_VALUE = config.config.MAX_CURRENT_BALANCE_VALUE
        eventEmitter = gameContext.components.eventEmitter
        data = gameContext.data
        gameContextLink = gameContext

        this.substractBet = substractBet
        this.setBalance = setBalance
        this.setNewHidden = setNewHidden
        this.switchOldToNew = switchOldToNew
        this.checkValidBalance = checkValidBalance
        this.checkIsBetMoreBalance = checkIsBetMoreBalance
        this.checkValueNotMoreBalance = checkValueNotMoreBalance
        this.getStrengthWin = getStrengthWin
        this.checkSuperWin = checkSuperWin
        this.checkSuperWinByVal = checkSuperWinByVal
        this.getShowWinDurationByValue = getShowWinDurationByValue
    }
}


const substractBet = () => {
    data.balance.value = data.balance.value - data.bet.currentBet
    eventEmitter.emit('updateTotalBalance', null)
}

const setBalance = val => {
    data.balance.value = val
    data.balance.newHiddenValue = val
    eventEmitter.emit('updateTotalBalance', null)
}

const setNewHidden = val => data.balance.newHiddenValue = val

const switchOldToNew = () => {
    data.balance.value = data.balance.newHiddenValue
    eventEmitter.emit('updateTotalBalance', null)
}

const checkIsBetMoreBalance = () => {
    return !data.serverResponse.gift
        ? data.balance.value < data.bet.currentBet
        : false
}

const checkValueNotMoreBalance = val => val <= data.balance.value


const checkValidBalance = () => true


const getStrengthWin = () => {
    const t = data.serverResponse.totalWin / data.bet.currentBet

    if (t <= 2) return 1;
    if (t <= 4) return 2;
    if (t <= 10) return 3;
    if (t <= 20) return 4;
    if (t <= 40) return 5;
    return 6;
}


const checkSuperWin = () => {
    const t = data.serverResponse.totalWin / data.bet.currentBet

    if (t < 20) return null;
    if (t < 60) return 'BIG_WIN';
    if (t < 100) return 'SUPER_WIN';
    if (t < 200) return 'MEGA_WIN';
    return 'JACKPOT';
}


const checkSuperWinByVal = val => {
    const t = val / data.bet.currentBet

    if (t < 20) return null;
    if (t < 60) return 'BIG_WIN';
    if (t < 100) return 'SUPER_WIN';
    if (t < 200) return 'MEGA_WIN';
    return 'JACKPOT';
}


const getShowWinDurationByValue = (value, time) => {
    if (value < 100) return time * 0.5;
    if (value < 500) return time * 0.65;
    if (value < 5000) return time * 0.85;
    return time;
}


