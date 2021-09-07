import * as STRING from '../helpers/string'


const WIGETS = [
    'balance',
    'bet',
    'win',
]


export class HtmlUiWidgets {
    constructor (gameContext) {
        this._eventEmitter = gameContext.components.eventEmitter
        this._gameContext = gameContext
        this._locale = gameContext.components.locale

        this._eventEmitter.subscribe('globalDataAfterSpinFromSever', response => {
            if (!response) return;

            this.setCurrency(response.currency)
        })

        this._eventEmitter.subscribe('closeBetChoise', () => {
            this.setBetValue(this._gameContext.data.bet.currentBet)
        })

        this._eventEmitter.subscribe('toggleAlertSpin', is => {
            is ? this.wigets['bet'].value.classList.add('red') : this.wigets['bet'].value.classList.remove('red')
        })

        this._eventEmitter.subscribe('updateTotalBalance', () => {
            this.setTotalBalance(this._gameContext.data.balance.value)
        })

        this._eventEmitter.subscribe('changeLanguage', () => {
            for (let key in this.wigets) {
                this.wigets[key].name.innerHTML = this._locale.getPhrase(this.wigets[key].nameValue)
            }
        })

        this.container = document.createElement('div')
        this.container.classList.add('bottom-info-container')
        this._gameContext.components.app.containerDOM.appendChild(this.container)

        this.wigets = {}

        for (let i = 0; i < WIGETS.length; i ++) {
            this.wigets[WIGETS[i]] = this._createWidget(WIGETS[i])
            this.container.appendChild(this.wigets[WIGETS[i]].container)
        }

        gameContext.components.eventEmitter.subscribe('resizeWindow', data => {
            this.container.style.width = data.wApp + 'px'
        })
    }

    setWinValue (val) {
        this.wigets['win'].value.innerHTML = STRING.numberWithSpaces(val)
    }

    setTotalBalance (val) {
        this.wigets['balance'].value.innerHTML = STRING.numberWithSpaces(val)
    }

    setBetValue (val) {
        this.wigets['bet'].value.innerHTML = STRING.numberWithSpaces(val)
    }

    setCurrency (val) {
        this.wigets['balance'].currency.innerHTML = val
        this.wigets['bet'].currency.innerHTML = val
        this.wigets['win'].currency.innerHTML = val
    }

    _createWidget (key) {
        const container = document.createElement('div')
        container.classList.add('info-item')
        container.classList.add(key + '-container')

        const name = document.createElement('span')
        name.innerText = this._locale.getPhrase(key.toUpperCase())
        container.appendChild(name)

        const currency = document.createElement('span')
        currency.classList.add('currency')
        currency.innerText = 'EUR'
        container.appendChild(currency)

        const value = document.createElement('span')
        value.classList.add('bold')
        value.innerText = ''
        container.appendChild(value)

        return {
            container,
            value,
            currency,
            name,
            nameValue: key.toUpperCase()
        }
    }

    redraw () {
        this.setCurrency(this._gameContext.data.serverResponse.currency)
        for (let key in this.wigets) {
            this.wigets[key].name.innerHTML = this._locale.getPhrase(this.wigets[key].nameValue)
        }
        this.setTotalBalance(this._gameContext.data.balance.value)
        this.setBetValue(this._gameContext.data.bet.currentBet)
        this.setWinValue(this._gameContext.data.serverResponse.totalWin)
    }
}