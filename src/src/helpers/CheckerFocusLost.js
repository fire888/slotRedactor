export class CheckerFocusLost {
    constructor (gameContext, config) {
        let isMustShowAlert = false
        window.onblur = function() {
            isMustShowAlert = true
        }
        window.onfocus = function() {
            const { isFirefox, deviceType } = gameContext.data.windowData
            if (isMustShowAlert && deviceType === 'Android_phone' && isFirefox) {
                config.config.messFunction(
                    gameContext,
                    gameContext.components.locale.getPhrase('You lost context, please reload game.'),
                    window.location
                )
            }
            gameContext.components['deviceResizer'].resize()
        }
    }
}