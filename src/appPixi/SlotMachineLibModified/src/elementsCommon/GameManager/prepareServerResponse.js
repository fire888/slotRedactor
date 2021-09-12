import { messServerError } from '../../elementsHTML/messServerError'

/** FROM BORIS

EUR("Euro", "EUR", 2,1),
USD("US Dollar", "USD", 2,1),
BTC("Bitcoin", "BTC", 8,1_000_000),
JPY("Japan JPY", "JPY", 0,1),
LTC("Litecoin", "LTC", 8,1_000_000),
DOG("Dogecoin", "DOG", 8,1_000_000),
ETH("Etherium", "ETH", 9,10_000_000),
BCH("Bitcoin Cash", "BCH", 8,1_000_000),
USDT("Tether USDT", "USDT", 8,1_000_000),
XRP("Ripple XRP", "XRP", 6,10_000),
RUB("Russian Ruble", "RUB", 2,1),
FUN("Demo", "FUN", 2,1);

 /
 AUD("Australian Dollar","AUD",2),
 CAD("Canadian Dollar","CAD",2),
 CZK("Czech Koruna","CZK",2),
 KRW("KOREA WON","KRW",0),
 KZT("KAZ Tenge","KZT",2),
 NOK("Norwegian Krone","NOK",2),
 NZD("New Zealand Dollar","NZD",2),
 PLN("Poland Zloty","PLN",2),
 ZAR("SOUTH AFRICA Rand","ZAR",2),
 IQD("Iraqi Dinar","IQD",3);

*/

/**
(VND)
3000;15000;30000;60000;140000;280000;550000;1100000;2200000;4100000;5500000;7000000
 (CLP)
90;440;900;1800;4400;8800;17500;35000;70000;130000;175000;220000
 (PKR)
 */




const MONEY_TRANSFORM = {
    "EUR": {
        name: "Euro",
        viewName: "EUR",
        multX: 1,
        multY: 1,
    },
    "USD": {
        name: "US Dollar",
        viewName: "USD",
        multX: 1,
        multY: 1,
    },
    "BTC": {
        name: "Bitcoin",
        viewName: "uBTC",
        multX: 1000000,
        multY: 0.000001,
    },
    "JPY": {
        name: "Japan JPY",
        viewName: "JPY",
        multX: 1,
        multY: 1,
    },
    "LTC": {
        name: "Litecoin",
        viewName: "uLTC",
        multX: 1000000,
        multY: 0.000001,
    },
    "DOG": {
        name: "Dogecoin",
        viewName: "uDOG",
        multX: 1000000,
        multY: 0.000001,
    },
    "ETH": {
        name: "Etherium",
        viewName: "uETH",
        multX: 1000000,
        multY: 0.000001,
    },
    "BCH": {
        name: "Bitcoin Cash",
        viewName: "uBCH",
        multX: 1000000,
        multY: 0.000001,
    },
    "USDT": {
        name: "Tether USDT",
        viewName: "USDT",
        multX: 1,
        multY: 1,
    },
    "XRP": {
        name: "Ripple XRP",
        viewName: "uXRP",
        multX: 1000000,
        multY: 0.000001,
    },
    "RUB": {
        name: "Russian Ruble",
        viewName: "RUB",
        multX: 1,
        multY: 1,
    },
    "FUN": {
        name: "Demo",
        viewName: "FUN",
        multX: 1,
        multY: 1,
    },
    "AUD": {
        name: "Australian Dollar",
        viewName: "AUD",
        multX: 1,
        multY: 1,
    },
    "CAD": {
        name: "Canadian Dollar",
        viewName: "CAD",
        multX: 1,
        multY: 1,
    },
    "CZK": {
        name: "Czech Koruna",
        viewName: "CZK",
        multX: 1,
        multY: 1,
    },
    "KRW": {
        name: "KOREA WON",
        viewName: "KRW",
        multX: 1,
        multY: 1,
    },
    "KZT": {
        name: "KAZ Tenge",
        viewName: "KZT",
        multX: 1,
        multY: 1,
    },
    "NOK": {
        name: "Norwegian Krone",
        viewName: "NOK",
        multX: 1,
        multY: 1,
    },
    "NZD": {
        name: "New Zealand Dollar",
        viewName: "NZD",
        multX: 1,
        multY: 1,
    },
    "PLN": {
        name: "Poland Zloty",
        viewName: "PLN",
        multX: 1,
        multY: 1,
    },
    "ZAR": {
        name: "SOUTH AFRICA Rand",
        viewName: "ZAR",
        multX: 1,
        multY: 1,
    },
    "IQD": {
        name: "Iraqi Dinar",
        viewName: "IQD",
        multX: 1,
        multY: 1,
    },
    'VND': {
       name: "VND",
       viewName: "kVND",
       multX: 0.001,
       multY: 1000,
    },
    'CLP': {
        name: "CLP",
        viewName: "kCLP",
        multX: 0.001,
        multY: 1000,
    },
    'PKR': {
        name: "PKR",
        viewName: "kPKR",
        multX: 0.001,
        multY: 1000,
    },
    'ZMW': {
        name: "ZMW",
        viewName: "ZMW",
        multX: 1,
        multY: 1,
    },
    'UGX': {
        name: "UGX",
        viewName: "kUGX",
        multX: 0.001,
        multY: 1000,
    },
    'CDF': {
        name: "CDF",
        viewName: "kCDF",
        multX: 0.001,
        multY: 1000,
    },
    'BIF': {
        name: "BIF",
        viewName: "kBIF",
        multX: 0.001,
        multY: 1000,
    },
    'XOF': {
        name: "XOF",
        viewName: "kXOF",
        multX: 0.001,
        multY: 1000,
    },
    'TND': {
        name: "Tunisian Dinar",
        viewName: "TND",
        multX: 1,
        multY: 1,
    },
    'TRY': {
        name: "",
        viewName: "TRY",
        multX: 1,
        multY: 1,
    },
    'CHF': {
        name: "Swiss Franc",
        viewName: 'CHF',
        multX: 1,
        multY: 1,
    },
    'XAF': {
        name: "Central African Francs",
        viewName: 'kXAF',
        multX: 0.001,
        multY: 1000,
    },
    'NGN': {
        name: "Nigerian Naira",
        viewName: 'kNGN',
        multX: 0.001,
        multY: 1000,
    },
    'MXN': {
        name: "Mexican Peso",
        viewName: 'hMXN',
        multX: 0.01,
        multY: 100,
    },
    'THB': {
        name: "Thai Baht",
        viewName: 'hTHB',
        multX: 0.01,
        multY: 100,
    },
    'UZS': {
        name: "Uzbekistan Som",
        viewName: 'kUZS',
        multX: 0.001,
        multY: 1000,
    },
}




let currentMoneyData = null


export const prepareInitResponse = (resp, gameContext = null) => {
    const copy = JSON.parse(JSON.stringify(resp))

    const obj = {
        totalWin: copy.sessionInfo.totalWin,
        winLines: copy.sessionInfo.winLines,
        wheels: copy.sessionInfo.wheels,
        currentBalance: copy.balanceResponse.balance,
        currency: copy.balanceResponse.currency,
        gameState: copy.sessionInfo.gameState,
        additionalInfo: copy.sessionInfo.additionalInfo,
        defaultBets: copy.defaultBets,
        previousBet: copy.sessionInfo.previousBet,
        previousCountLines: copy.sessionInfo.previousCountLines,
        numberLines: copy.sessionInfo.numberLines,
    }

    const gift = copy.sessionInfo.gift ? copy.sessionInfo.gift : null
    gift && (obj.gift = gift)

    return prepareSpinResponse(obj, gameContext)
}


export const prepareSpinResponse = (resp, gameContext) => {
    const obj = JSON.parse(JSON.stringify(resp))

    moneyTransform(obj, gameContext)
    return obj
}


export const prepareDataRequestToSend = dataBet => {
    let bet = +dataBet.betPerLine
    bet *= currentMoneyData.multY
    bet = bet.noExponents()
    bet = +bet
    bet = bet.toFixed(10)
    bet = +bet
    dataBet.betPerLine = bet + ''

    return dataBet
}


const moneyTransform = (obj, gameContext) => {
    if (!MONEY_TRANSFORM[obj.currency]) {
        messServerError(gameContext, 'Unknown currency ' + obj.currency, gameContext.CONSTANTS.GAME_CONFIG.HOME_URL)
        throw new Error("Something went badly wrong!")
    }
    currentMoneyData = MONEY_TRANSFORM[obj.currency]

    const { viewName, multX } = currentMoneyData

    // currency
    if (obj.defaultBets) {
        obj.defaultBets.currency = viewName
    }
    if (obj.currency) {
        obj.currency = viewName
    }

    // change bets
    if (obj.defaultBets) {
        const arrBets = obj.defaultBets.bets.split(';').map(item => item * multX)
        let stroke = ''
        for (let i = 0; i < arrBets.length; i++) {
            stroke += arrBets[i]
            if (arrBets[i + 1]) stroke += ';'
        }
        obj.defaultBets.bets = stroke
    }

    // change balance
    obj.currentBalance *= multX

    // change win
    obj.totalWin *= multX
    if (obj.winLines) {
        for (let i = 0; i < obj.winLines.length; i++) {
            obj.winLines[i].win *= multX
        }
    }


    // freeWin
    if (obj.additionalInfo && obj.additionalInfo.total_free_game_win)
        obj.additionalInfo.total_free_game_win *= multX

    // giftStins
    if (obj.gift) {
        obj.gift.total_win *= multX
    }
}



Number.prototype.noExponents = function () {
    var data= String(this).split(/[eE]/);
    if (data.length == 1) return data[0];

    var z = '', sign = this < 0? '-':'',
        str= data[0].replace('.', ''),
        mag= Number(data[1]) + 1;

    if (mag<0) {
        z = sign + '0.';
        while(mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
}
