import { DeviceIphoneSwiper } from '../elementsHTML/IphoneSwiper'


let countResize = 0


export class DeviceResizer {
    constructor (gameContext, config) {
        this._gameContext = gameContext
        this._eventEmitter = gameContext.components.eventEmitter
        this._WINDOW = config.config
        this._gameData = gameContext.data

        this._device = checkDevice() // 'desktop' || 'phone'

        gameContext.data.windowData = {}
        this.dataForComponents = gameContext.data.windowData

        this.dataForComponents.deviceMode = this._device.mode
        this.dataForComponents.isIphone = this._device.isIphone
        this.dataForComponents.isFirefox = this._device.isFirefox
        this.dataForComponents.deviceType = this._device.deviceType
        this.dataForComponents.isShowFullScreen = true

        if (this.dataForComponents.isIphone) {
            this.dataForComponents.isShowFullScreen = false
            // TODO: VERY BAD
            if (this._device.isChrome || this._device.isFirefox || this._device.isFirefoxIOS) {
                this.dataForComponents.isShowFullScreen = false
                this.dataForComponents.isIphone = this._device.isIphone = false
                this.dataForComponents.deviceType = this._device.deviceType = 'Android_phone'
            }
        }


        this._appContainer = gameContext.container

        if (!this._device.isIphone) {
            document.body.style.height = '100vh'
            document.body.style.overflow = 'hidden'
        }
        const iosVersion = checkIOSVersion()
        this.dataForComponents.isIOSLess14 = iosVersion && iosVersion < 14

        this._appContainer.classList.add(this._device.mode)

        if (this._device.mode === 'phone') {
            this._eventEmitter.subscribe('clickStartButton', e => {
                this._openAppFullScreenIfMobile(e)
            })
        }
        this._eventEmitter.subscribe('clickFullScreen', is => { is && this._openAppFullScreenIfMobile() })


        this._elementsToResize = []


        window.addEventListener('resize', () => {
            this.resize()
            /** fix iPhone Chrome, Opera.. canvas not resized */
            if (this.dataForComponents.isShowFullScreen === false) {
                 setTimeout(() => {
                     this.resize()
                     this._gameContext.components.app.app.resize()
                 }, 500)
            }
            /** */
        })
        this.resize()


        /** Disable iphone swipe if in iFrame */
        // if (this._device.isIphone && window !== window.parent) {
        if (this._device.isIphone) {
            if (window === window.parent) {
                this._deviceIphoneSwiper = new DeviceIphoneSwiper(gameContext)
            }
        }

    }

    startIphone () {
        this._deviceIphoneSwiper && this._deviceIphoneSwiper.start()
    }


    resize () {
        if (this._deviceIphoneSwiper) this._deviceIphoneSwiper.update()


        if (this._device.mode === 'phone' || this._device.mode === 'phoneLong' || this._device.mode === 'phoneTop') {
            this._device.mode = 'phone'
            const maxScreenSize = Math.max(window.innerWidth, window.innerHeight)
            const minScreenSize = Math.min(window.innerWidth, window.innerHeight)
            if (maxScreenSize / minScreenSize > 1.9) {
                this._device.mode = 'phoneLong'
            }

            let orientation = window.innerWidth > window.innerHeight * 1.1 ? 'horizontal' : 'vertical'
            if (orientation === 'vertical') {
                this._device.mode = 'phoneTop'
            }
        }



        let wApp, hApp


        if (this._device.mode === 'desktop') {
            const currentRatio = window.innerWidth / window.innerHeight
            if (currentRatio > this._WINDOW.ratio) {
                hApp = Math.min(this._WINDOW.h, window.innerHeight)
                wApp = hApp * this._WINDOW.ratio
            } else {
                wApp = Math.min(this._WINDOW.w, window.innerWidth)
                hApp = wApp / this._WINDOW.ratio
            }

            if (window.innerWidth > 1100 && window.innerHeight > 800) {
                hApp *= .85
                wApp *= .85
            }
        } else if (this._device.mode === 'phone' || this._device.mode === 'phoneLong') {
            hApp = Math.min(this._WINDOW.h, window.innerHeight)
            wApp = hApp * 2.

            wApp > window.innerWidth && (wApp = window.innerWidth)
            hApp = window.innerHeight
        } else if (this._device.mode === 'phoneTop') {
            wApp = window.innerWidth
            hApp = Math.min(wApp * 2, window.innerHeight)
        }


        const wStep = wApp / 10
        const hStep = hApp / 10

        this.dataForComponents.deviceMode = this._device.mode

        const scaleGame =
            (Math.min(wApp, hApp) / Math.min(this._WINDOW.w, this._WINDOW.h)) * this._WINDOW.ratio


        const wUi = (() => {
            let wUi = null
            if (this._device.mode === 'phoneLong') {
                wUi = Math.min(2 * window.innerHeight, window.innerWidth )
            }
            if (this._device.mode === 'phone') {
                wUi = Math.min(1.79 * window.innerWidth, window.innerWidth )
            }
            if (this._device.mode === 'phoneTop') {
                wUi = window.innerWidth
            }
            return wUi
        })()

        this.dataForComponents.wApp = wApp
        this.dataForComponents.wStep = wStep
        this.dataForComponents.hApp = hApp
        this.dataForComponents.hStep = hStep
        this.dataForComponents.scaleGame = scaleGame
        this.dataForComponents.wUi = wUi

        const { maxHtmlFontSize, minHtmlFontSize } = this._WINDOW
        const fontSizeByMinScreenSize = 0.033
        this.dataForComponents.htmlFontSize = Math.min(fontSizeByMinScreenSize * Math.min(hApp, wApp), maxHtmlFontSize)
        this.dataForComponents.htmlFontSize = Math.max(this.dataForComponents.htmlFontSize, minHtmlFontSize)

        this._appContainer.classList.remove('desktop', 'phone', 'phoneLong', 'phoneTop')
        this._appContainer.classList.add(this._device.mode)

        this._resizeElements()
        this._eventEmitter.emit('resizeWindow', this.dataForComponents)
    }


    setElementToResize(item) {
        this._elementsToResize.push(item)
        this._resizeElement(item)
        return () => {
            this._elementsToResize.filter(obj => obj !== item)
        }
    }

    removeElementFromResize (key) {
        this._elementsToResize = this._elementsToResize.filter(item => item.key !== key)
    }


    _resizeElements () {
        for (let i = 0; i < this._elementsToResize.length; i ++) {
            this._resizeElement(this._elementsToResize[i])
        }
    }

    _resizeElement (item) {
        const { container, config, key } = item

        if (!container) { // TODO: REMOVE FROM ARRAY
            return;
        }

        const screen = this.dataForComponents

        if (
            config.hasOwnProperty(this._gameData.view) &&
            config[this._gameData.view].hasOwnProperty(screen.deviceMode)
        ) {
            config[this._gameData.view][screen.deviceMode].hasOwnProperty('x') &&
            (container.x = config[this._gameData.view][screen.deviceMode].x * screen.wStep)

            config[this._gameData.view][screen.deviceMode].hasOwnProperty('y') &&
            (container.y = config[this._gameData.view][screen.deviceMode].y * screen.hStep)

            config[this._gameData.view][screen.deviceMode].hasOwnProperty('scale') &&
            container.scale.set(config[this._gameData.view][screen.deviceMode].scale * screen.scaleGame)

            config[this._gameData.view][screen.deviceMode].hasOwnProperty('rotation') &&
            (container.rotation = config[this._gameData.view][screen.deviceMode].rotation)
        }
    }


    _openAppFullScreenIfMobile () {
        countResize ++;

        if (document.fullscreenElement) { return; }

        if (this._appContainer.requestFullscreen) {
            this._appContainer.requestFullscreen()
        } else if (this._appContainer.mozRequestFullScreen) {
            this._appContainer.mozRequestFullScreen()
        } else if (this._appContainer.webkitRequestFullscreen) {
            this._appContainer.webkitRequestFullscreen()
        } else if (this._appContainer.msRequestFullscreen) {
            this._appContainer.msRequestFullscreen()
        }
    }
}



const checkDevice = () => {
    const isCanTouch = checkTouch()
    const isCanChangeOrientation = checkIsCanOrientation()

    let deviceByBrowserProps = 'desktop'
    if (isCanTouch && isCanChangeOrientation) {
        deviceByBrowserProps = 'phone'
    }

    const deviceByUserAgent = checkDeviceByUserAgent()


    //let mode = deviceByUserAgent.mode === deviceByBrowserProps
    //    ? deviceByUserAgent.mode
    //    : deviceByBrowserProps

    let deviceType
    if (deviceByBrowserProps === 'desktop') {
        deviceType = 'desktop'
    } else {
        if (deviceByUserAgent.mode === 'tablet') {
            deviceType = 'tablet'
        }
        if (deviceByUserAgent.mode === 'phone') {
            if (deviceByUserAgent.isIphone) {
                deviceType = 'iOS_phone'
            } else {
                deviceType = 'Android_phone'
            }
        }
    }


    return {
        mode: deviceByBrowserProps,
        isIphone: deviceByUserAgent.isIphone,
        isChrome: deviceByUserAgent.isChrome,
        isFirefox: deviceByUserAgent.isFirefox,
        isFirefoxIOS: deviceByUserAgent.isFirefoxIOS,
        deviceType,
    }
}



const checkTouch = () =>
navigator.maxTouchPoints || 'ontouchstart' in document.documentElement



const checkIsCanOrientation = () =>
typeof window.orientation !== 'undefined'



const checkDeviceByUserAgent = () => {
    let mode = null
    let isIphone = false

    if (window.navigator.userAgent.match(/iPhone/i)) {
        isIphone = true
    }

    if (window.navigator.userAgent.match(/Mobile/i)
        || window.navigator.userAgent.match(/iPhone/i)
        || window.navigator.userAgent.match(/iPod/i)
        || window.navigator.userAgent.match(/IEMobile/i)
        || window.navigator.userAgent.match(/Windows Phone/i)
        || window.navigator.userAgent.match(/Android/i)
        || window.navigator.userAgent.match(/BlackBerry/i)
        || window.navigator.userAgent.match(/webOS/i)) {
        mode = 'phone';
    }

    if (window.navigator.userAgent.match(/Tablet/i)
        || window.navigator.userAgent.match(/iPad/i)
        || window.navigator.userAgent.match(/Nexus 7/i)
        || window.navigator.userAgent.match(/Nexus 10/i)
        || window.navigator.userAgent.match(/KFAPWI/i)) {
        mode = 'tablet'
    }

    if (window.navigator.userAgent.match(/Intel Mac/i)) {
        mode = 'desktop'
    }

    let isChrome = false
    if (navigator.userAgent.match('CriOS')) {
        isChrome = true
    }

    let isFirefoxIOS = false
    if (navigator.userAgent.match("FxiOS")) {
        isFirefoxIOS = true
    }

    let isFirefox = false
    if (navigator.userAgent.indexOf("Firefox") > 0) {
        isFirefox = true
    }


    return { mode, isIphone, isChrome, isFirefox, isFirefoxIOS }
}

const checkerIsMobileFireFox = () => {
    const agent = navigator.userAgent.toLowerCase()
    return agent.indexOf('firefox') >= 0 && agent.indexOf("android") >= 0
}

const checkIOSVersion = () => {
    const agent = window.navigator.userAgent, start = agent.indexOf( `OS ` );

    if ((agent.indexOf(`iPhone`) > -1 || agent.indexOf(`iPad`) > -1) && start > -1) {
        return window.Number(agent.substr(start + 3, 3).replace(`_`, `.`));
    }
    if ((agent.indexOf(`Mac`) > -1) && start > -1) {
        console.log(agent.substr(start + 4, 3))
        return window.Number(agent.substr(start + 4, 3).replace(`_`, `.`));
    }
    return false;
}



