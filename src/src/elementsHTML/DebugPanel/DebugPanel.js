import './debugPanelStyle.css'

export class DebugPanel {
    constructor(gameContext) {
        this._gameContext = gameContext

        this._container = document.createElement('div')
        this._container.classList.add('debug-container')
        this._container.classList.add('opened')
        gameContext.container.appendChild(this._container)

        this._openButton = document.createElement('div')
        this._openButton.innerText = '<='
        this._openButton.classList.add('debug')
        this._openButton.classList.add('toggleButton')
        this._container.appendChild(this._openButton)
        this._openButton.addEventListener('click', () => {
            this._container.classList.contains('opened')
                ? this._container.classList.remove('opened')
                : this._container.classList.add('opened')
            this._container.classList.contains('opened')
                ? this._openButton.innerText = '=>'
                : this._openButton.innerText = '<='
        })

        this._debugData = document.createElement('div')
        this._debugData.classList.add('debugData', 'debug')
        this._container.appendChild(this._debugData)

        this.addInfo(`${window.innerWidth} x ${window.innerHeight}`)

        window.addEventListener('resize', () => {
            this.addInfo(`window: ${ window.innerWidth } x ${ window.innerHeight }`)
        })
    }

    addInfo(info) {
        const newInfo = document.createElement('div')
        newInfo.classList.add('info')
        newInfo.innerText = info
        this._debugData.appendChild(newInfo)
    }
}
