import { prepareInitResponse, prepareSpinResponse, prepareDataRequestToSend } from '../elementsCommon/GameManager/prepareServerResponse'
import { messServerError } from '../elementsHTML/messServerError'



const requestUrl = (BACKEND_HOST && BACKEND_HOST !== 'null')
    ? `${ BACKEND_HOST.trim() }`
    : null

const paths = {
     restore: '/gamestate',
     spin: '/spin',
}



const params = {
    restore: {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    },
    spin: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }
}




export class Responses {
    constructor (gameContext) {
        this._gameContext = gameContext

        this._sessionKey = gup('sk', window.location.href) || null
        if (!this._sessionKey) console.log('NO SESSION KEY !')

        this._platformId = null
        this._onResolve = null
    }


    /** public ***************************************************/

    getInitialData () {
        const token = `sessionToken=${ this._sessionKey }`
        const userAgent = `userAgent=${ navigator.userAgent }`
        const device = `deviceType=${ this._gameContext.data.windowData.deviceType }`
        const path = `${ requestUrl }${ paths.restore }?${ token }&${ userAgent }&${ device }`

        this._startFetch(path, params.restore, this._onSuccessInitial.bind(this), this._onDenied.bind(this))

        return new Promise(resolve => this._onResolve = resolve)
    }

    sendResponseWinCombination (totalBet) {
        const path = `${ requestUrl }${ paths.spin }`

        totalBet = prepareDataRequestToSend(totalBet)
        const body = JSON.stringify({
            "sessionToken": this._sessionKey,
            "numLines": totalBet.numLines,
            "betPerLine": totalBet.betPerLine,
            "platformId": this._platformId,
        })
        const paramsSpin = Object.assign({}, params.spin, { body })


        this._startFetch(path, paramsSpin, this._onSuccessSpin.bind(this), this._onDenied.bind(this))

        return new Promise(resolve => this._onResolve = resolve)
    }


    /** private *********************************************/

    _onSuccessInitial (json)  {
        console.log(JSON.stringify(json))

        this._platformId = json.sessionInfo.platformId

        const { mathIdentifier } = this._gameContext.CONSTANTS.GAME_CONFIG
        const isCheckMathIdentifier = checkMathIdentifier(mathIdentifier || null, json.sessionInfo.mathIdentifier)
        if (!isCheckMathIdentifier) {
            messServerError(
                this._gameContext,
            'Error. Game mathIdentifier missed match responded.',
                this._gameContext.CONSTANTS.GAME_CONFIG.HOME_URL,
            )
            return;
        }

        const serverResponse = prepareInitResponse(json, this._gameContext)

        this._gameContext.CONSTANTS.GAME_CONFIG.HOME_URL = json.sessionInfo.urls.return_url
        this._gameContext.CONSTANTS.GAME_CONFIG.REDIRECT_URL = json.sessionInfo.urls.deposit_url

        if (this._gameContext.components['changerBalance'].checkValidBalance(serverResponse)) {
            this._onResolve(serverResponse)
        }
    }


    _onSuccessSpin (json)  {
        console.log(JSON.stringify(json) + ',')

        const serverResponse = prepareSpinResponse(json)
        if (this._gameContext.components.changerBalance.checkValidBalance(serverResponse))
            this._onResolve(serverResponse)
    }


    _onDenied (mess, response) {
        console.log('win combination from server ERROR', response)
        messServerError(
            this._gameContext,
            mess,
            this._gameContext.CONSTANTS.GAME_CONFIG.HOME_URL,
        )
    }


    _startFetch (path, params, onSuccess, onDenied) {
        console.log(path, params)

        fetch(path, params)
            .then(function (response) {
                if (response.status === 200) {
                    response.json()
                        .then(onSuccess)
                }
                else if (response.status === 404) {
                    onDenied('Session token doesnt exist or has expired', response)
                }
                else if (response.status === 412) {
                    response.text()
                        .then(text => onDenied(text, response))
                }
                else {
                    onDenied(response.status, response)
                }
            }.bind(this))
            .catch(function(err) {
                onDenied('NETWORK ERROR', err)
            }.bind(this))
    }
}





export class ResponsesDev extends Responses {
    constructor (gameContext, config) {
        super(gameContext)

        this._sessionKey = config.config.DEV_SESSION_TOKEN
    }
}





export class ResponsesHardcode extends Responses {
    constructor (gameContext, config) {
        super(gameContext)

        this._restoreResp = (config && config.config && config.config.HARDCODE_RESTORE_RESPONSE) || null
        this._arrHardcodeResp = (config && config.config && config.config.HARDCODE_RESPONSE) || []
        if (!this._arrHardcodeResp.length) {
            console.log('Check HARDCODE_RESPONSE.')
        }
        this._indexResp = -1
    }


    getInitialData () {
        setTimeout(() => this._onSuccessInitial(this._restoreResp), 100)
        return new Promise(resolve => this._onResolve = resolve)
    }


    sendResponseWinCombination (totalBet) {
        setTimeout(() => {
            ++this._indexResp

            if (!this._arrHardcodeResp[this._indexResp]) {
                console.log('Check HARDCODE_RESPONSE array length', this._arrHardcodeResp.length, this._indexResp)
            }
            this._onSuccessSpin(this._arrHardcodeResp[this._indexResp])
        }, 100)

        return new Promise(resolve => this._onResolve = resolve)
    }
}





const gup = (name, url) => {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}


const checkMathIdentifier = (saved, valToCheck) => {
    if (Array.isArray(saved)) {
        for (let i = 0; i < saved.length; i++) {
            if (saved[i] === valToCheck) {
                return true;
            }
        }
        return false;
    } else {
        return saved === valToCheck;
    }
}
