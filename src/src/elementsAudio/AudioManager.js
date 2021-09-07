import sound from 'pixi-sound';

const LINES_SOUNDS_KEYS = ['winLine1', 'winLine2', 'winLine3', 'winLine4', 'winLine5', 'winLine6', 'winLine6End', 'moneyCount']

export class AudioManager {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI

        this.audio_vals = config.config.AUDIO_VAL_FOR_RULE_CONFIG

        this._l = {}
        for (let key in config.config.AUDIO_CONFIG) {
            this._l[key] = this._gameContext.data.audioList[config.config.AUDIO_CONFIG[key]]
        }


        gameContext.PIXI.sound = sound
        this._timers = {}
        this._groups = config.config.GROUPS

        this._timerPlayEnd = null

        this._eventEmitter = this._gameContext.components.eventEmitter


        if (this.audio_vals) {
            this._PIXI.sound.volumeAll = (localStorage.hasOwnProperty(APP_NAME + 'allVolume') && localStorage.getItem(APP_NAME + 'allVolume')) || this.audio_vals.allVolume
            this._changeGroupVolume('gameSound', (localStorage.hasOwnProperty(APP_NAME + 'gameSound') && localStorage.getItem(APP_NAME + 'gameSound')) || this.audio_vals['gameSound'])
            this._changeGroupVolume('controlsSound', (localStorage.hasOwnProperty(APP_NAME + 'controlsSound') && localStorage.getItem(APP_NAME + 'controlsSound')) || this.audio_vals['controlsSound'])
            this._changeGroupVolume('backSound', (localStorage.hasOwnProperty(APP_NAME + 'backSound') && localStorage.getItem(APP_NAME + 'backSound')) || this.audio_vals['backSound'])
        }


        this._l['moneyLoop'] && (this._l['moneyLoop'].sound.loop = true)
        this._l['freeLoop'] && (this._l['freeLoop'].sound.loop = true)
        this._l['miniGameLoop'] && (this._l['miniGameLoop'].sound.loop = true)
        this._l['music1'] && (this._l['music1'].sound.loop = true)



        this._countScatters = 0
        this._isSoundOn = true

        this._eventEmitter.subscribe('toggleSoundOnOff', is => {
            this._PIXI.sound.toggleMuteAll()
            this._isSoundOn = is
        })

        this._addListenerSingleColumnRotComplete()

        this._eventEmitter.subscribe('clickSpin', () => {
            this._easyPlay('clickSpin')
        })

        this._eventEmitter.subscribe('betValueChanged', () => {
            this._easyPlay('clickBet')
        })

        this._eventEmitter.subscribe('clickHtmlBet', () => {
            this._easyPlay('clickBet')
        })


        this._eventEmitter.subscribe('toggleAutoPlay', () => {
            this._easyPlay('clickAutoPlay')
        })


        this._eventEmitter.subscribe('soundVolumeChanged', data => {
            if (!this.audio_vals) return;

            localStorage.setItem(APP_NAME + data.group, +data.val)
            this.audio_vals[data.group] = +data.val

            if (data.group === 'allVolume') {
                this._PIXI.sound.volumeAll = this.audio_vals.allVolume
            } else {
                this._changeGroupVolume(data.group, +data.val)
            }
        })

        this._initNoVisibleTabListener()

        this.loopAmbientStart('playStates', 'noIntro')
    }


    _addListenerSingleColumnRotComplete () {
        this._eventEmitter.subscribe('playAudioColumnRotationComplete', sound => {
            if (!this._isSoundOn) return;

            const { idColumnStopped, isScatter } = sound
            if (isScatter) {
                this._countScatters ++
                const keySound = 'scatterReelStop' + isScatter.scatterCount
                this._easyPlay(keySound)
            } else {
                this._easyPlay('reelsStop')
            }
            if (this._countScatters == 4) { // MAX COLUMNS LENGTH
                this._countScatters = 0
                this._easyStop('reelsRotation')
            }
            if (idColumnStopped == 4) {
                this._countScatters = 0
            }
        })
    }


    play (key, num) {
        if (!this._isSoundOn) return;

        if (key === 'winLine') {
            this._easyPlay(`winLine${ num }`)
            if (num === 6) {
                this._timerPlayEnd = setTimeout(() => {
                    this._easyStop('winLine6')
                    this._easyPlay('winLine6End')
                }, 3500)
            }
            return;
        }

        this._easyPlay(key)
    }


    stop (data) {
        if (typeof data === 'object') {
            for (let i = 0; i < data.length; i++) {
                this._easyStop(data[i])
            }
        } else {
            this._easyStop(data)
        }
    }


    stopWin () {
        for (let i = 0; i < LINES_SOUNDS_KEYS.length; i++) {
            this._easyStop(LINES_SOUNDS_KEYS[i])
        }
        for (let key in this._timers) {
            clearTimeout(this._timers[key])
        }

        clearTimeout(this._timerPlayEnd)
    }


    /**
     * @param {string} key "playStates" || "freeStates" || "miniGame"
     * @param {boolean} noIntro
     */
    loopAmbientStart (key, noIntro) {
        return new Promise(resolve => {
            this._easyStop('freeLoop')
            this._easyStop('music1')
            this._easyStop('miniGameLoop')

            let keySoundLoop = null
            let keySoundStart = null

            if (key === 'playStates') {
                keySoundLoop = 'music1'
            } else if (key === 'freeStates') {
                keySoundLoop = 'freeLoop'
                keySoundStart = 'freeStart'
            } else if (key === 'miniGame') {
                keySoundLoop = 'miniGameLoop'
                keySoundStart = 'miniGameStart'
            }

            if (!this._l[keySoundLoop]) {
                return resolve();
            }

            if (noIntro) {
                this._l[keySoundLoop].sound.play({ loop: true });
            } else {
                this._l[keySoundStart].sound.play({
                    start: 0,
                    complete: function () {
                        this._l[keySoundLoop].sound.play({ loop: true })
                    }.bind(this),
                })
            }

            return resolve();
        })
    }


    setPause (key) {
        this._l[key].sound.pause()
    }


    /**
     * @param {string} key "playStates" || "freeStates" || "miniGame"
     * @param {string} noEnd
     * @returns {Promise}
     */
    loopAmbientStop (key, noEnd) {
        return new Promise(resolve => {
            this._easyStop('freeLoop')
            this._easyStop('music1')
            this._easyStop('miniGameLoop')

            if (!key) return resolve();
            if (noEnd) return resolve();

            let keySoundEnd = null
            if (key === 'playStates' || key === 'autoPlayStates') {
                keySoundEnd = null
            } else if (key === 'freeStates') {
                keySoundEnd = 'freeEnd'
            } else if (key === 'miniGame') {
                keySoundEnd = 'miniGameEnd'
            }

            if (this._l[keySoundEnd]) {
                this._l[keySoundEnd].sound.play({
                    start: 0,
                    complete: resolve
                })
            }
        })
    }


    loopMoneyMore(duration) {
        if (!this._l['moneyCount']) return;

        this._l['moneyCount'].sound.play({
            start: 0,
            loop: true,
        })

        this._timers['moneyCount'] = setTimeout(this.loopMoneyStop.bind(this), duration)
    }


    loopMoneyStop () {
        if (!this._l['moneyCount']) return;

        clearTimeout(this._timers['moneyCount'])
        this._l['moneyCount'].sound.stop()
        this._l['moneyCountEnd'] && this._l['moneyCountEnd'].sound.play({ start: 0 })
    }


    _easyPlay (key) {
        if (!this._isSoundOn || !this._l[key]) return;

        this._l[key].sound.currentTime = 0

        if (key === 'miniGameBoxWin') {
            const val =  this._l['miniGameLoop'].sound.volume
            this._l['miniGameLoop'].sound.volume = val > 0.3 ? 0.2 : 0

            this._l[key].sound.play({ start: 0, })
            setTimeout(() => this._l['miniGameLoop'].sound.volume = val, 1500)
        }

        this._l[key].sound.play({ start: 0, })
    }


    _easyStop(key) {
        if (!this._l[key]) return;

        this._l[key].sound.stop()
        this._l[key].sound.currentTime = 0
    }


    _changeGroupVolume(key, val) {
        if (!this._groups[key]) return;

        for (let i = 0; i < this._groups[key].length; i ++) {
            this._l[this._groups[key][i]].sound.volume = val
        }
    }


    _initNoVisibleTabListener() {
        const handleVisibilityChange = () => {
            if (document.visibilityState == "hidden") {
                this._PIXI.sound.volumeAll = 0
            } else {
                this.audio_vals && (this._PIXI.sound.volumeAll = this.audio_vals.allVolume)
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange, false);
    }
}



