export class Keyboard {
    constructor(gameContext) {
        this._timerSpaceDown = null
        this._ignoreSpaceUp = false
        this._isEnableAutoPlay = true

        this._enabled = {
            'spin': true,
            'stopForce': true,
            //'stopAutoPlay': true,
        }

        document.addEventListener('keydown', function (event) {
            if (event.keyCode === 32) {
                !this._timerSpaceDown && (this._timerSpaceDown = setTimeout(() => {
                    if (gameContext.data.currentStates === "playStates" && this._isEnableAutoPlay) {
                        gameContext.components['eventEmitter'].emit('toggleAutoPlay', true)
                        this._ignoreSpaceUp = true
                    }
                }, 2000))
            }
        }.bind(this))


        document.addEventListener('keyup', function (event) {
            if (event.keyCode === 32) {

                if (this._ignoreSpaceUp) {
                    this._ignoreSpaceUp = false
                    return;
                }

                this._timerSpaceDown && clearTimeout(this._timerSpaceDown)
                this._timerSpaceDown = null

                this._enabled['stopForce']
                    && gameContext.components['eventEmitter'].emit('clickForceStop', null)

                this._enabled['spin']
                    && gameContext.components['eventEmitter'].emit('clickSpin', null)

                gameContext.data.currentStates === "autoPlayStates"
                    && gameContext.components['eventEmitter'].emit('toggleAutoPlay', false)
            }
        }.bind(this))
    }

    toggleEnableAll (is) {
        for (let key in this._enabled) {
            this._enabled[key] = is
        }
    }

    toggleEnableByKey (key, is) {
        this._enabled[key] = is
    }

    toggleAutoPlay (is) {
        this._isEnableAutoPlay = is
    }
}

