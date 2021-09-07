import { prepareSpinResponse } from '../helpers/prepareServerResponse'

const proto = {
    additionalInfo: {special_book_symbol: "-1", total_free_spins: "15", bonus_id: "353", total_free_game_win: "0.0", free_spins_count: "0"},
    currency: "FUN",
    currentBalance: 14980,
    gameState: "NORMAL_SPIN",
    totalWin: 0,
    wheels: [
        [5, 10, 3],
        [6, 9, 4],
        [7, 10, 5],
        [8, 1, 6],
        [9, 2, 7],
    ],
    winLines: [
        {lineNumber: 1, win: 5000, length: 4, symbolId: 7, lineType: "SIMPLE_LINE"},
        {lineNumber: 2, win: 5000, length: 4, symbolId: 6, lineType: "SIMPLE_LINE"},
        {lineNumber: 3, win: 5000, length: 4, symbolId: 8, lineType: "SIMPLE_LINE"},
    ],
}

export function createRandomResp () {
    const r = prepareSpinResponse(proto)
    console.log(r)

    // prepare wheels
    for (let i = 0; i < r.wheels.length; i ++) {
        for (let j = 0; j < r.wheels[i].length; j ++) {
            r.wheels[i][j] = Math.floor(Math.random() * 11)
        }
    }

    // prepare winlines
    if (Math.random() < 0.5) r.winLines = []
    return r
}

