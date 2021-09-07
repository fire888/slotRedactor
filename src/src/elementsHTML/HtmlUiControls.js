
const KEYS_DISABLE_WHEN_ROT = [
    //'sound',
    'menu',
    //'menu-info',
    //'menu-rules',
    //'menu-settings',
    'home',
    'bet',
    'spin',
    // fullScreen
]


const STANDARD_CONTROLS_SHOW = [
    'menu',
    'home',
    'bet',
    'spin',
    'sound'
]

const DIS_ALPHA = .3
const ENABLE_ALPHA = .8


const CONTROLS_CONFIG = {
    'sound': { 
       classList: ['control', 'butt-sound'],
       action: function () {
           this.clickSound()
       },
    },
    'fullScreen': {
        classList: ['control', 'butt-fullScreen'],
        action: function () {
            this._eventEmitter.emit('clickFullScreen', true)
        }
    },
    'menu': {
        classList: ['control', 'butt-menu'],
        action:  function () {
            if (this.isRulesDisabled) return;

            this.toggleVisible(['menu-info', 'menu-rules', 'menu-settings'])
        },
    },
    'menu-info': {
        classList: ['control', 'butt-menu-info', 'hidden'],
        action:  function () {
            this._eventEmitter.emit('clickMenu', 'info')
        }, 
    },
    'menu-rules': {
        classList: ['control', 'butt-menu-rules', 'hidden'],
        action:  function () {
            this._eventEmitter.emit('clickMenu', 'rules')
        }, 
    },
    'menu-settings': {
        classList: ['control', 'butt-menu-settings', 'hidden'],
        action:  function () {
            this._eventEmitter.emit('clickMenu', 'settings')
        }, 
    },
    'home': {
        classList: ['control', 'butt-home'],
        action: function () {
            const link = document.createElement('a')
            link.href = this._gameContext.CONSTANTS.GAME_CONFIG.HOME_URL
            link.click()
        },
    },
    'bet': {
        classList: ['control', 'butt-bet'],
        action: function () {
            if (this.isBetDisabled) return;
            this._eventEmitter.emit('clickBetMobile', null)
        }, 
    },
    'spin': {
        classList: ['control', 'butt-main', 'butt-spin'],
        action: function () {
            this._eventEmitter.emit('clickSpin', null)
        },        
    },
    'forceStop': {
        classList: ['control', 'butt-main', 'butt-force-stop', 'hidden'],
        action: function () {
            this._eventEmitter.emit('clickForceStop', null)
        },
    },
    'stopAutoPlay': {
        classList: ['control', 'butt-main', 'butt-stop-auto-play'],
        action: function () {
            this._eventEmitter.emit('toggleAutoPlay', false)
        },       
    }
}


export class HtmlUiControls {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._eventEmitter = gameContext.components.eventEmitter
        this._config = config


        this.isDisabled = false
        this.isBetDisabled = false
        this.isAutoplayDisabled = false


        this._eventEmitter.subscribe('toggleAutoPlay', is => {
           if (is) {
                this.hide(['spin'])
                this.show(['stopAutoPlay'])
           } else {
                this.hide(['stopAutoPlay'])
                this.show(['spin'])
           }
        })

        this._eventEmitter.subscribe('hideButtonAutoPlay', () => {
            this.hide(['stopAutoPlay'])
            this.show(['spin'])
        })

        window.addEventListener('mouseup', () => {
            this.hide(['menu-info', 'menu-rules', 'menu-settings'])
        })

        this.controls = {}

        for (let key in CONTROLS_CONFIG) {
            const butt = this.createButton(key, CONTROLS_CONFIG[key])
            gameContext.components.app.containerDOM.appendChild(butt)
            this.controls[key] = butt
        }

        this.controls['fullScreen'].classList.add('hidden')
        this.hide(['stopAutoPlay'])
        this.ignoreMouseUpStopAutoPlay = false


        this.timerStartAutoPlay = null
        this.controls['spin'].addEventListener('touchstart', () => {
            if (this.isAutoplayDisabled === true) {
               return;
            }
            if (this._gameContext.components['superPrizeEffect']
                && this._gameContext.components['superPrizeEffect'].container.renderable) {
                return;
            }
            this.timerStartAutoPlay = setTimeout(() => {
                this.ignoreMouseUpStopAutoPlay = true
                this._eventEmitter.emit('toggleAutoPlay', true)
            }, 2000)
        })
        document.addEventListener('touchend', () => {
            if (this.ignoreMouseUpStopAutoPlay === true) {
                this.ignoreMouseUpStopAutoPlay = false
                return
            }
            if (this.timerStartAutoPlay) clearTimeout(this.timerStartAutoPlay)
        })

        this._eventEmitter.subscribe('resizeWindow', this.resize.bind(this))
    }


    resize () {
        const { deviceMode, htmlFontSize } = this._gameContext.data.windowData

        const h = this._gameContext.components.app.containerDOM.clientHeight
        const w = this._gameContext.components.app.containerDOM.clientWidth


        /**
         * from CSS: 7rem size Spin control
         */
        const halfSpinH = (htmlFontSize * 8.5) / 2

        /**
         * from CSS: leftNormalControl - (widthSpinControl -  widthNormalControl) / 2
         */
        const spinOffset = 0.2

        let bottom, right
        if (deviceMode === 'phone' || deviceMode === 'phoneLong') {
            bottom = h / 2 - halfSpinH + htmlFontSize + 'px'
            right = spinOffset * htmlFontSize  + 'px'
        } else {
            //bottom = this._config.config.phoneTop.offsetSpin.bottom * htmlFontSize + 'px'
            bottom = 8.5 * htmlFontSize + 'px'
            right =  w / 2 - halfSpinH + 'px'
        }

        this.controls['spin'].style.bottom =
        this.controls['stopAutoPlay'].style.bottom =
        this.controls['forceStop'].style.bottom =
            bottom

        this.controls['spin'].style.right =
        this.controls['stopAutoPlay'].style.right =
        this.controls['forceStop'].style.right =
            right




        /** full screen android button */
        //if (this._gameContext.data.windowData.deviceMode !== 'desktop' && this._gameContext.data.windowData.isIphone) {
        if (this._gameContext.data.windowData.deviceMode !== 'desktop' && this._gameContext.data.windowData.isShowFullScreen) {
            // if opened html changer bets not show fullScreen
            if (this._gameContext.components.ui.htmlUi.betSlot.containerHTML.style.display !== 'none') return;
            if (!document.fullscreenElement) {
                this.controls['fullScreen'].classList.remove('hidden')
            } else {
                this.controls['fullScreen'].classList.add('hidden')
            }
        }
    }


    createButton (key, data) {
        let butt = document.createElement('div')
        for (let i = 0; i < data.classList.length; i ++) {
            butt.classList.add(data.classList[i])
            butt.classList.add(this._gameContext.data.windowData.deviceMode)
        }  
        butt.addEventListener('touchend', e => this.onControlClick(e))
        butt.setAttribute('data-name', key)
        return butt
    }


    onControlClick (e) {
        if (this.timerStartAutoPlay) clearTimeout(this.timerStartAutoPlay)

        e.preventDefault()

        if (this.ignoreMouseUpStopAutoPlay === true) {
            this.ignoreMouseUpStopAutoPlay = false
            return
        }
        if (e.target.dataset.name === 'stopAutoPlay') {
            CONTROLS_CONFIG[e.target.dataset.name].action.call(this)
            return;
        }

        if (this.isDisabled
            && !e.target.classList.contains('butt-force-stop')
            && !e.target.classList.contains('butt-sound')
            && !e.target.classList.contains('butt-fullScreen')
            && e.target.isDisabled
        ) {
            return;
        }

        if (e.target.style.opacity === '0.3') {
            return;
        }
        e.target.classList.add('pressed')
        setTimeout(() => e.target.classList.remove('pressed'), 800)
        CONTROLS_CONFIG[e.target.dataset.name].action.call(this)
    }

    disable () {
        for (let i = 0; i < KEYS_DISABLE_WHEN_ROT.length; i++) {
            this.controls[KEYS_DISABLE_WHEN_ROT[i]].style.opacity = DIS_ALPHA
        }
        this.isDisabled = true
    }


    /** NEW METHODS **********************************/

    disableAllControls () {
        for (let key in this.controls) {
            if (key === 'fullScreen') continue;

            this.controls[key].isDisabled = true
            this.controls[key].style.opacity = DIS_ALPHA
        }
    }

    disableControls(arr) {
        for (let i = 0; i < arr.length; ++i) {
            this.controls[arr[i]].isDisabled = true
            this.controls[arr[i]].style.opacity = DIS_ALPHA
        }
    }

    enableAllControls () {
        for (let key in this.controls) {
            this.controls[key].isDisabled = false
            this.controls[key].style.opacity = ENABLE_ALPHA
        }
    }

    enableControls(arr) {
        for (let i = 0; i < arr.length; ++i) {
            this.controls[arr[i]].isDisabled = false
            this.controls[arr[i]].style.opacity = ENABLE_ALPHA
        }
    }

    /** *********************************************/


    enable () {
        for (let i = 0; i < KEYS_DISABLE_WHEN_ROT.length; i++) {
            this.controls[KEYS_DISABLE_WHEN_ROT[i]].style.opacity = ENABLE_ALPHA
        }

        this.controls['bet'].style.opacity = ENABLE_ALPHA
        this.isDisabled = false
        this.isBetDisabled = false
        this.isRulesDisabled = false
    }


    disableBet () {
        this.controls['bet'].style.opacity = DIS_ALPHA
        this.isBetDisabled = true
    }

    disableAutoplay () {
        this.isAutoplayDisabled = true
    }

    enableAutoplay () {
        this.isAutoplayDisabled = false
    }

    disableRules () {
        this.controls['menu'].style.opacity = DIS_ALPHA
        this.isRulesDisabled = true
    }

    hide (arr) {
        if (!arr) {
            for (let key in CONTROLS_CONFIG) this.controls[key].classList.add('hidden')
        } else {
            for (let i = 0; i < arr.length; i++) {
                this.controls[arr[i]].classList.add('hidden')
            }
        }
    }

    show (arr) {
        if (!arr) {
            arr = STANDARD_CONTROLS_SHOW
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 'fullScreen') {
                if (document.fullscreenElement) continue;
                if (this._gameContext.data.windowData.isIphone) continue;
            }
            this.controls[arr[i]].classList.remove('hidden')
        }
    }

    toggleVisible (arr) {
        this.controls[arr[0]].classList.contains('hidden') 
            ? this.show(arr)
            : this.hide(arr)
    }


    toggleForceStopButton (val) {
        if (val) {
            this.controls['forceStop'].classList.remove('hidden')
            this.controls['spin'].classList.add('hidden')
        } else {
            this.controls['forceStop'].classList.add('hidden')
            this.controls['spin'].classList.remove('hidden')
        }
    } 

    clickSound () {
        this.controls['sound'].classList.contains('muted')
            ? this.controls['sound'].classList.remove('muted')
            : this.controls['sound'].classList.add('muted')
        this._eventEmitter.emit('toggleSoundOnOff', !this.controls['sound'].classList.contains('muted'))
    }

    disableForever(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.controls[arr[i]].classList.add('disabled-forever')
        }
    }
} 
