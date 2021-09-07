import '../stylesheets/deviceIphoneSwiperStyle.css'


export class DeviceIphoneSwiper {
    constructor (gameContext) {
        this._gameContext = gameContext
        this._parent = document.body

        //this._gameContext.debugPanel && gameContext.debugPanel.addInfo(`init ${window.innerWidth}, ${window.innerHeight}`)
        document.body.style.overflow = 'visible'

        this._disablerZoom = new DisablerZoom()
        this._disablerZoom.disableZoom()
        this._isRulesOpened = false
        this._gameContext.components.eventEmitter.subscribe('openRules', () => {
            this._isRulesOpened = true
            this._disablerZoom.enableZoom()
        })
        this._gameContext.components.eventEmitter.subscribe('closeRules', () => {
            this._isRulesOpened = false
            this._disablerZoom.disableZoom()
            this.update()
        })

        const pageOverlay = document.createElement('div')
        pageOverlay.classList.add('overlay')
        this._parent.appendChild(pageOverlay)

        this.container = document.createElement('div')
        this.container.classList.add('iphone-resizer')
        this.container.innerHTML += SVG

        if (isTopOrientation()) {
            this.hInV = window.innerHeight + 5
            this.hInG = window.innerWidth - 5
            //this._gameContext.debugPanel &&  gameContext.debugPanel.addInfo(`topOrient  hInV: ${this.hInV}, hInG: ${this.hInG}`)
        } else {
            this.hInV = window.innerWidth - 60 // NOT DELETE
            this.hInG = window.innerHeight - 5
            //this._gameContext.debugPanel &&  gameContext.debugPanel.addInfo(`gorOrient  hInV: ${this.hInV}, hInG: ${this.hInG}`)
        }

        window.addEventListener('resize', () => {
            isTopOrientation() && this._parent.contains(this.container) && this._parent.removeChild(this.container)
        })

        this._isStart = false
    }


    start () {
        this._isStart = true
        this.update()
    }


    update () {
        if (this._isRulesOpened) return;
        if (!this._isStart) return;

        window.scrollTo(0, 0)

        if (isTopOrientation()) {
            if (window.innerHeight < this.hInV) {
                setTimeout(() => {
                    this._disablerZoom.enableZoom()
                    !this._parent.contains(this.container) && this._parent.appendChild(this.container)
                }, 10)
            } else {
                this._parent.contains(this.container) && this._parent.removeChild(this.container)
                this._disablerZoom.disableZoom()
            }
        } else {
            if (window.innerHeight < this.hInG) {
                this._disablerZoom.enableZoom()
                !this._parent.contains(this.container) && this._parent.appendChild(this.container)
            } else {
                this._disablerZoom.disableZoom()
                this._parent.contains(this.container) && this._parent.removeChild(this.container)
            }
        }
    }
}


const isTopOrientation = () => window.innerHeight > window.innerWidth



class DisablerZoom {
    constructor() {
        this._disablerZoom = function disZoom (e) { e.preventDefault(); }
    }

    disableZoom() {
        document.addEventListener("touchstart", this._disablerZoom, { passive: false } )
    }

    enableZoom() {
        document.removeEventListener("touchstart", this._disablerZoom)
    }
}


const SVG = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 100 150" style="enable-background:new 0 0 100 150;" xml:space="preserve" width="100px" height="230px">
<style type="text/css">.st1{fill:#FFFFFF;}</style>


<g>
    <animateTransform 
        id="idle"
        attributeName="transform"
        type="translate"
        values="0,15;0,15;0,15;0,35;0,-45; 0,-45;"
        dur="3s"
        repeatCount="indefinite"
    />
	
	<circle cx="51" cy="35" r="12" stroke="white" stroke-width="3" fill="none">
		<animate attributeName="opacity"
             values="0;0;1;1;1;1;1" dur="3s"
             repeatCount="indefinite"/>
	</circle>

	<path class="st1" d="M45.9,34.8c0,0,0.9-3.5,5.5-3.2s5.5,3.2,5.5,3.2v24.4l23.6-0.3c0,0,1.7,0.3,2.7,1.7c1,1.4,1.3,2.4,1.3,2.4
		v31.6c0,0-0.2,0.7-1.6,2.4s-3.3,1.4-3.3,1.4l-27.6,0l-25.7-17c0,0-2.2-3.7,0-5.9s5.4-1.7,5.4-1.7l13.3,7.3L45.9,34.8z"/>
	<path class="st1" d="M52.9,101h28.4c0,0,3.6,1.2,3.3,5.4s-3.3,5.6-3.3,5.6l-29-0.3c0,0-2.6-0.8-2.8-5.2
		C49.3,102.2,52.9,101,52.9,101z"/>
</g>



<g transform="translate(0, 50)">
	<path class="st1" d="M17.4,136.3v-17.9h6.8c1.2,0,2.1,0.1,2.7,0.2c0.9,0.1,1.6,0.4,2.2,0.8c0.6,0.4,1.1,1,1.4,1.7
		c0.4,0.7,0.5,1.6,0.5,2.4c0,1.5-0.5,2.8-1.5,3.9c-1,1.1-2.7,1.6-5.2,1.6h-4.6v7.3H17.4z M19.8,127h4.6c1.5,0,2.6-0.3,3.3-0.9
		c0.6-0.6,1-1.4,1-2.4c0-0.7-0.2-1.4-0.6-1.9c-0.4-0.5-0.9-0.9-1.5-1.1c-0.4-0.1-1.1-0.2-2.2-0.2h-4.6V127z"/>
	<path class="st1" d="M42.3,136.3v-1.9c-1,1.5-2.4,2.2-4.1,2.2c-0.8,0-1.5-0.1-2.1-0.4c-0.7-0.3-1.2-0.7-1.5-1.1
		c-0.3-0.4-0.5-1-0.7-1.6c-0.1-0.4-0.1-1.1-0.1-2.1v-8h2.2v7.2c0,1.1,0,1.9,0.1,2.3c0.1,0.6,0.4,1,0.9,1.4c0.4,0.3,1,0.5,1.7,0.5
		s1.3-0.2,1.9-0.5c0.6-0.3,1-0.8,1.2-1.4c0.2-0.6,0.4-1.4,0.4-2.5v-6.9h2.2v13H42.3z"/>
	<path class="st1" d="M47.6,136.3v-17.9h2.2v17.9H47.6z"/>
	<path class="st1" d="M53.2,136.3v-17.9h2.2v17.9H53.2z"/>
	<path class="st1" d="M74.2,136.3v-1.9c-1,1.5-2.4,2.2-4.1,2.2c-0.8,0-1.5-0.1-2.1-0.4s-1.2-0.7-1.5-1.1c-0.3-0.4-0.5-1-0.7-1.6
		c-0.1-0.4-0.1-1.1-0.1-2.1v-8h2.2v7.2c0,1.1,0,1.9,0.1,2.3c0.1,0.6,0.4,1,0.9,1.4c0.4,0.3,1,0.5,1.7,0.5s1.3-0.2,1.9-0.5
		s1-0.8,1.2-1.4c0.2-0.6,0.4-1.4,0.4-2.5v-6.9h2.2v13H74.2z"/>
	<path class="st1" d="M79.6,141.3v-17.9h2v1.7c0.5-0.7,1-1.2,1.6-1.5c0.6-0.3,1.3-0.5,2.2-0.5c1.1,0,2.1,0.3,2.9,0.9
		c0.8,0.6,1.5,1.4,1.9,2.4c0.4,1,0.6,2.2,0.6,3.4c0,1.3-0.2,2.5-0.7,3.6c-0.5,1.1-1.2,1.9-2.1,2.4s-1.9,0.8-2.9,0.8
		c-0.7,0-1.4-0.2-2-0.5s-1.1-0.7-1.4-1.2v6.3H79.6z M81.6,129.9c0,1.7,0.3,2.9,1,3.7c0.7,0.8,1.5,1.2,2.5,1.2c1,0,1.8-0.4,2.5-1.2
		c0.7-0.8,1-2.1,1-3.8c0-1.7-0.3-2.9-1-3.7c-0.7-0.8-1.5-1.2-2.4-1.2c-0.9,0-1.8,0.4-2.5,1.3C82,127,81.6,128.3,81.6,129.9z"/>
</g>
</svg>`

