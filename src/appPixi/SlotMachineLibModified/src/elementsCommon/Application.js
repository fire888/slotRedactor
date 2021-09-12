import '../stylesheets/appWrapperStyle.css'
import { messPhoneFirefox } from '../elementsHTML/messPhoneFirefox'


export class Application {
    constructor(gameContext) {
        this.containerDOM = document.createElement('div')
        this.containerDOM.classList.add('app-wrapper')
        gameContext.container.appendChild(this.containerDOM)

        const mode = gameContext.data.windowData.deviceMode
        const resolution = mode === 'desktop' ? 1 : 3

        this.app = new gameContext.PIXI.Application({
            resizeTo: this.containerDOM,
            autoResize: true,
            autoDensity: false,
            resolution,
            autoStart: true,
            antialias: false,
            transparent: false,
        })

        if (this.app.renderer.context instanceof CanvasRenderingContext2D) {
            messPhoneFirefox(gameContext)
        } else {
            this.containerDOM.appendChild(this.app.view)
        }

        this.gameScene = new gameContext.PIXI.Container()
        this.gameScene.x = gameContext.data.windowData.wApp / 2
        this.gameScene.y = gameContext.data.windowData.hApp / 2
        this.app.stage.addChild(this.gameScene)

        gameContext.components.eventEmitter.subscribe('resizeWindow', data => {
            this.containerDOM.style.width = data.wApp + 'px'
            this.containerDOM.style.height = data.hApp + 'px'
            this.containerDOM.style.fontSize = data.htmlFontSize + 'px'

            this.containerDOM.classList.remove('phone')
            this.containerDOM.classList.remove('phoneLong')
            this.containerDOM.classList.remove('phoneTop')

            const { deviceMode } = gameContext.data.windowData
            this.containerDOM.classList.add(deviceMode)

            this.gameScene.x = data.wApp / 2
            this.gameScene.y = data.hApp / 2
        })

        gameContext.components.deviceResizer.resize()
        this.app.resize()
        this.app.render()
    }
}
