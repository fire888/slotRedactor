import ButtonForUI from './Control'


const keysForDisable = [
    'spinCanvas',
    'betUpCanvas',
    'betDownCanvas',
    //'soundOffCanvas',
    //'soundOnCanvas',
    'settingsCanvas',
    'menuCanvas',
    'homeCanvas',
]

const DIS_ALPHA = .3


export default class ControlsUICanvas {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._eventEmitter = gameContext.components.eventEmitter
        this._PIXI = gameContext.PIXI
        this._config = config.config.UI_CANVAS_CONTROLS_CONFIG


        const actions = {
            'menuCanvas': function () {
                this.controls['infoCanvas'].sprite.visible ? this._hideDropUpMenu() : this._showDropUpMenu()
            },
            'infoCanvas': function () {
                this._eventEmitter.emit('clickMenu', 'info')
                this._hideDropUpMenu();
            },
            'perLinesMenuCanvas': function () {
                this._eventEmitter.emit('clickMenu', 'rules')
                this._hideDropUpMenu();
            },
            'settingsCanvas': function () {
                this._eventEmitter.emit('clickMenu', 'settings')
                this._hideDropUpMenu();
            },
            'betDownCanvas': function () {
                this._gameContext.components.changerBet.substractOne()
            },
            'betUpCanvas': function () {
                this._gameContext.components.changerBet.addOne()
            },
            'spinCanvas': function () {
                this._eventEmitter.emit('clickSpin', null)
            },
            'stopForce': function () {
                this._eventEmitter.emit('clickForceStop', null)
            },
            'stopAutoPlay': function () {
                if (this.ignoreMouseUpStopAutoPlay) {
                    this.ignoreMouseUpStopAutoPlay = false
                    return;
                }
                this._eventEmitter.emit('toggleAutoPlay', false)
            },
            'soundOffCanvas': function () {
                this._isSoundMuted = !this._isSoundMuted
                this.controls['soundOffCanvas'].sprite.visible = false
                this.controls['soundOnCanvas'].sprite.visible = true
                this._eventEmitter.emit('toggleSoundOnOff', false)
            },
            'soundOnCanvas': function () {
                this.controls['soundOffCanvas'].sprite.visible = true
                this.controls['soundOnCanvas'].sprite.visible = false
                this._eventEmitter.emit('toggleSoundOnOff',  true)
            },
            'homeCanvas': function () {
                window.location = gameContext.CONSTANTS.GAME_CONFIG.HOME_URL
            },
        }


        this._isSoundMuted = false
        this.isDisabled = false
        this.isAutoplayDisabled = false
        this.controls = {}

        this.container = new this._PIXI.Container()

        for (let i = 0; i < this._config.length; i ++) {
            this._config[i].callback = actions[this._config[i].key].bind(this)

            const someButton = new ButtonForUI(this._config[i], this._PIXI)
            this.container.addChild(someButton.sprite)
            this.controls[this._config[i].key] = someButton
        }

        this.controls['soundOnCanvas'].sprite.visible = false
        this.controls['stopAutoPlay'].sprite.visible = false

        // autoPlay
        this._eventEmitter.subscribe('toggleAutoPlay', is => 
            this.controls['stopAutoPlay'].sprite.visible = is)

        this._eventEmitter.subscribe('hideButtonAutoPlay', () =>
            this.controls['stopAutoPlay'].sprite.visible = false)

        this.controls['stopAutoPlay'].sprite
            .on('pointerout', () => {
                this.ignoreMouseUpStopAutoPlay = false
            })

        // spin additional
        this.spinAlertMap = this._PIXI.Texture.from('spinCanvasDisable.png')
        this.spinMap = this.controls['spinCanvas'].map

        this._eventEmitter.subscribe('toggleAlertSpin', is => this.enableSpin())

        this.timerMouseDown = null
        this.ignoreMouseUpStopAutoPlay = false
        this.controls['spinCanvas'].sprite
            .on('pointerdown', () => {
                if (this.isAutoplayDisabled === true) {
                    return;
                }
                if (this._gameContext.components['superPrizeEffect']
                    && this._gameContext.components['superPrizeEffect'].container.renderable) {
                    return;
                }
                this.timerMouseDown = setTimeout(() => {
                    this.ignoreMouseUpStopAutoPlay = true
                    this._eventEmitter.emit('toggleAutoPlay', true)
                }, 2000)   
            })
            .on('pointerup', () => {
                if (this.timerMouseDown) clearTimeout(this.timerMouseDown)
            })
            .on('pointerout', () => {
                if (this.timerMouseDown) clearTimeout(this.timerMouseDown)
            })

        this.controls['stopForce'].sprite.renderable = false
        this.controls['stopForce'].sprite.interactive = false

        this.disable()
    }

    _hideDropUpMenu () {
        this.controls['infoCanvas'].sprite.visible = false
        this.controls['perLinesMenuCanvas'].sprite.visible = false
        this.controls['settingsCanvas'].sprite.visible = false
    }

    _showDropUpMenu () {
        this.controls['infoCanvas'].sprite.visible = true
        this.controls['perLinesMenuCanvas'].sprite.visible = true
        this.controls['settingsCanvas'].sprite.visible = true
    }

    disableSpinAlert () {
        this.controls['spinCanvas'].sprite.texture = this.spinAlertMap
        this.controls['spinCanvas'].map = this.spinAlertMap
        this.controls['spinCanvas'].sprite.interactive = false
    }

    enableSpin () {
        this.controls['spinCanvas'].sprite.texture = this.spinMap
        this.controls['spinCanvas'].map = this.spinMap
        this.controls['spinCanvas'].sprite.interactive = true
    }

    disable () {
        for (let i = 0; i < keysForDisable.length; i++) {
            this.controls[keysForDisable[i]].sprite.interactive = false
            this.controls[keysForDisable[i]].sprite.alpha = DIS_ALPHA
        }
        this._hideDropUpMenu();
    }

    disableBet () {
        const arr = ['betDownCanvas', 'betUpCanvas']
        for (let i = 0; i < arr.length; i++) {
            this.controls[arr[i]].sprite.interactive = false
            this.controls[arr[i]].sprite.alpha = DIS_ALPHA
        }
    }

    disableRules () {
        this.controls['menuCanvas'].sprite.interactive = false
        this.controls['menuCanvas'].sprite.alpha = DIS_ALPHA
    }

    enable () {
        for (let i = 0; i < keysForDisable.length; i++) {
            this.controls[keysForDisable[i]].sprite.interactive = true
            this.controls[keysForDisable[i]].sprite.alpha = this.controls[keysForDisable[i]].defaultAlpha
        }
    }

    disableAutoplay () {
        this.isAutoplayDisabled = true
    }

    enableAutoplay () {
        this.isAutoplayDisabled = false
    }

    hideButtons () {
        this._hideDropUpMenu()
    }

    toggleForceStopButton(val) {
        this.controls['stopForce'].sprite.renderable = val
        this.controls['stopForce'].sprite.interactive = val
    }
}
