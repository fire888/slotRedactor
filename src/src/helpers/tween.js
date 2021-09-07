import { numberWithSpaces } from './string'

export function create (data) {
    const { fromValue, toValue, duration } = data

    const timeStarted = Date.now()
    const easing = backOut(0.0)

    return {
        update: now => {
            const phase = Math.min(1, (now - timeStarted) / duration)
            const value = lerp(fromValue, toValue, easing(phase))
            const isDone = value === toValue
            return { value, isDone }
        },
    }
}


export function createWithOffset (data) {
    const {
        fromValue,
        middleValue,
        toValue,
        duration
    } = data

    const timeStarted = Date.now()

    return {
        update: now => {
            const phase = Math.min(1, (now - timeStarted) / duration)
            const value = _interpolate(fromValue, middleValue, toValue, phase)
            const isDone = value === toValue
            return { value, isDone }
        },
    }
}


export function createWithTwoOffsets (data) {
    const {
        fromValue,
        middleValueOne,
        middleValueTwo,
        toValue,
        duration
    } = data

    const timeStarted = Date.now()

    return {
        update: now => {
            const phase = Math.min(1, (now - timeStarted) / duration)
            const value =_interpolateTwoVals(fromValue, middleValueOne, middleValueTwo, toValue, phase)
            const isDone = value === toValue
            return { value, isDone }
        },
    }
}

const _interpolate = (x1, x2, x3, t) => ((1 - t) * (1 - t) * x1) + (2 * t * (1 - t) * x2) + (t * t * x3)

const lerp = (x1, x2, t) => x1 * (1 - t) + x2 * t;

const _interpolateTwoVals = (x1, x2, x3, x4, t) => {
    const v1 = (1-t)**3 * x1;
    const v2 = 3 * (1-t)**2 * t * x2
    const v3 = 3 * (1-t)*(t**2) * x3
    const v4 = t**3 * x4
    return v1 + v2 + v3 + v4
}


const backOut = amount => t => (--t * t * ((amount + 1) * t + amount) + 1)


export function createLinear (fromValue, toValue, duration) {
    const timeStarted = Date.now()
    return {
        update: now => {
            const phase = Math.min(1, (now - timeStarted) / duration)
            const value = (toValue - fromValue) * phase
            return value
        },
    }
}


export function createLinearPhase ({ fromValue, toValue, duration }) {
    const timeStarted = Date.now()
    return {
        update: () => {
            const phase = Math.min(1, (Date.now() - timeStarted) / duration)
            const value = lerp(fromValue, toValue, phase)
            return { value, isDone: phase }
        },
    }
}



/** auto update with tick ************************************************/

let tweensToUpdate = []

export const updateTweens = () => {
    for (let i = 0; i < tweensToUpdate.length; i ++) {
        tweensToUpdate[i].update()
    }
}
const removeFromUpdate = key => tweensToUpdate = tweensToUpdate.filter(item => item.key !== key)



export function createAuto (data) {
    const key = Math.random() * 1000000

    const complete = () => {
        removeFromUpdate(key)
        resolve()
    }

    let resolve

    return {
        start () {
            return new Promise(res => {
                resolve = res

                const tweenData = Object.assign({}, data, {
                    timeStarted: Date.now(),
                    callback: complete,
                })
                const update = tweensFunctions[data.tweenType](tweenData)
                tweensToUpdate.push({ update, key })
            })
        },
        stop : complete,
    }
}


export const eraseTween = (time, actionWithValue) => createAuto({
    fromValue: 0,
    toValue: 1,
    duration: 500,
    tweenType: 'eraseTween',
    actionWithValue,
}).start()



const tweensFunctions = {
    'linear': ({
            timeStarted,
            fromValue,
            toValue,
            duration,
            actionWithValue,
            callback,
        }) => () => {
            const phase = Math.min(1, (Date.now() - timeStarted) / duration)
            actionWithValue((toValue - fromValue) * phase)
            phase === 1 && callback()
    },

    'simpleTween': ({
            timeStarted,
            fromValue,
            toValue,
            duration,
            actionWithValue,
            callback,
        }) => () => {
            const phase = Math.min(1, (Date.now() - timeStarted) / duration)
            const value = lerp(fromValue, toValue, phase)
            actionWithValue(value)
            phase === 1 && callback()
        },

    'eraseTween': ({
            timeStarted,
            fromValue,
            toValue,
            duration,
            actionWithValue,
            callback,
        }) => () => {
            const easing = backOut(0.0)
            const phase = Math.min(1, (Date.now() - timeStarted) / duration)
            const value = lerp(fromValue, toValue, easing(phase))
            actionWithValue(value)
            phase === 1 && callback()
        },

    'autoUpdateColumnTwoVals': ({
            timeStarted,
            fromValue,
            middleValueOne,
            middleValueTwo,
            toValue,
            duration,
            actionWithValue,
            callback,
        }) => () => {
            const phase = Math.min(1, (Date.now() - timeStarted) / duration)
            const value = _interpolateTwoVals(fromValue, middleValueOne, middleValueTwo, toValue, phase)
            actionWithValue(value)
            phase === 1 && callback()
        },

    'autoUpdateColumnTwoValsAndOffset': ({
            timeStarted,
            fromValue,
            middleValueOne,
            middleValueTwo,
            toValue,
            duration,
            actionWithValue,
            timeOffsetStart,
            callback,
        }) => () => {
            const phase = Math.max(0, Math.min(1, (Date.now() - (timeStarted + timeOffsetStart)) / duration))

            const value = _interpolateTwoVals(fromValue, middleValueOne, middleValueTwo, toValue, phase)
            actionWithValue(value)
            phase === 1 && callback()
        },
}



