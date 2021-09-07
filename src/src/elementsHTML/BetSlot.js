

import '../stylesheets/betSlotStyle.css'
//import * as ChangeBetActions from '../actions/changeBet'
//import * as ChangeBalanceActions from '../actions/changeBalance'

export class BetSlot {
    constructor (gameContext) {
        const { betIndex, numLines, currentBet, betPerLine } = gameContext.data.bet
        this.betIndex = betIndex
        this.numLines = numLines
        this.currentBet = currentBet
        this.betPerLine = betPerLine

        this._locale = gameContext.components.locale
        this._gameContext = gameContext
        this._eventEmitter = gameContext.components.eventEmitter

        this.containerHTML = document.createElement('div')
        this.containerHTML.classList.add('bet-html-container')
        this.containerHTML.style.display = 'none'
        this._gameContext.container.appendChild(this.containerHTML)

        this.betWrapper = document.createElement('div')
        this.betWrapper.classList.add('bet-html-wrapper')
        this.containerHTML.appendChild(this.betWrapper)

        this.betWrapperInner = document.createElement('div')
        this.betWrapperInner.classList.add('bet-html-wrapper-inner')
        this.betWrapper.appendChild(this.betWrapperInner)

        this.buttLess = document.createElement('div')
        this.buttLess.classList.add('bet-butt-less')
        this.betWrapperInner.appendChild(this.buttLess)

        this.valueContainer = document.createElement('div')
        this.valueContainer.classList.add('bet-value-container')
        this.betWrapperInner.appendChild(this.valueContainer)

        this.betValue = document.createElement('div')
        this.betValue.innerText = (this.betPerLine[this.betIndex] * numLines).toFixed(2)
        this.betValue.classList.add('bet-value')
        this.valueContainer.appendChild(this.betValue)

        this.betTitle = document.createElement('div')
        this.betTitle.innerText = this._locale.getPhrase('bet')
        this.betTitle.classList.add('bet-title')
        this.valueContainer.appendChild(this.betTitle)

        this._eventEmitter.subscribe('changeLanguage', () => {
            this.betTitle.innerText = this._locale.getPhrase('bet')
        })

        this.buttMore = document.createElement('div')
        this.buttMore.classList.add('bet-butt-more')
        this.betWrapperInner.appendChild(this.buttMore)


        this.addListeners()
    }



    addListeners () {
        this._eventEmitter.subscribe('resizeWindow', () => {
            const { wUi, hApp, htmlFontSize, deviceMode } = this._gameContext.data.windowData

            if (deviceMode === 'phoneTop') {
                 this.betWrapper.style.transform = `translate(0, ${ (hApp / 2) + (-14 * htmlFontSize) }px)`
            } else {
                 this.betWrapper.style.transform = `translate(${ (wUi / 2) + ((-18) * htmlFontSize) }px, 0)`
            }
        })

        this.buttMore.addEventListener('touchend', e => onControlClick(e, 'more'))
        this.buttLess.addEventListener('touchend', e => onControlClick(e, 'less'))
        this.containerHTML.addEventListener('touchend', e => onControlClick(e, 'close'))
        this.betWrapper.addEventListener('touchend', e => onControlClick(e, 'none'))


        const onControlClick = (e, val) => {
             e.stopPropagation()
             e.preventDefault()

             if (val === 'none') {
                 return;
             }

             if (val === 'more') {
                 this._eventEmitter.emit('clickHtmlBet', null)
                 this.betIndex = this.betPerLine[this.betIndex + 1]
                     ? this.betIndex + 1
                     : this.betIndex
             }
             if (val === 'less') {
                 this._eventEmitter.emit('clickHtmlBet', null)
                 this.betIndex = this.betPerLine[this.betIndex - 1]
                     ? this.betIndex - 1
                     : this.betIndex
             }

             this.betValue.innerText = (this.betPerLine[this.betIndex] * this.numLines).toFixed(2)

             if (this._gameContext.components.changerBalance.checkValueNotMoreBalance(this.betValue.innerText)) {
                 this.betValue.classList.remove('red')
             } else {
                 this.betValue.classList.add('red')
             }

             if (val === 'close') {
                 this._gameContext.components.changerBet.setBetFromSlider(this.betIndex)
             }
        }
    }

    show () {
        if (this._gameContext.components.changerBalance.checkValueNotMoreBalance(this.betValue.innerText)) {
            this.betValue.classList.remove('red')
        } else {
            this.betValue.classList.add('red')
        }
        this.containerHTML.style.display = 'flex'
    }

    hide () {
        this.containerHTML.style.display = 'none'
    }
}
