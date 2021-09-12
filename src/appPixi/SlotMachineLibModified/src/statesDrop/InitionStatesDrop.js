import { InitionStates } from '../states/InitionStates'
import { getWinData } from './actions'



export class InitionStatesDrop extends InitionStates {
    _startGame() {
        this._gameContext.data.view = 'playScreen'

        this._destroyLayers('playScreen')
        this._initLayers('playScreen')
        this._initConstructors('playScreen')

        const { deviceResizer, locale, helperSortData, ui, slotMachine } = this._gameContext.components
        const { serverResponse, windowData } = this._gameContext.data

        deviceResizer.startIphone()

        const { wheels } = serverResponse
        let symbols
        if (wheels && wheels.length > 0) {
            const arrs = getWinData(this._gameContext)
            symbols = arrs[arrs.length - 1].wheels
        } else {
            symbols = helperSortData.createFilled('random')
        }
        slotMachine.forceSetCombinationsData(symbols)

        this._unsubscriberStartButton && this._unsubscriberStartButton()
        this._gameContext.data.currentStates = 'playStates'


        /** prepare ui */
        if (ui) {
            const { betPerLine, betIndex, currentBet } = this._gameContext.data.bet

            ui.setBetValue(betPerLine[betIndex], currentBet)
            ui.setBigMes(locale.getPhrase("Spin the wheels!"))

            if (serverResponse.gift && serverResponse.gift.current_giftspin !== 0) {
                ui.setWinValue(serverResponse.gift.total_win)
            }

            windowData.deviceMode !== 'desktop' && setTimeout(ui.redraw, 500)
        }


        /** inition done */
        deviceResizer.resize()
        setTimeout(this._sm['next'].bind(this._sm))
    }
}