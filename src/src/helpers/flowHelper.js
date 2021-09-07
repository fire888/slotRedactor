export const exec = (arr, i = 0) => arr[i] && arr[i](() => exec(arr, ++i))
export const pipe = exec


export const waitForClick = item => callback => item.onClick(callback)



export const pause = (time, f) => callback => setTimeout(() => {
    requestAnimationFrame(() => {
        f()
        callback()
    })
}, time)



export const action = f => callback => {
    f()
    callback()
}



export const actionAfter = f => callback => f(callback)