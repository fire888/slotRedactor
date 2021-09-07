export class PopupsSymbolsInfo {
    constructor(gameContext, config) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this._config = config

        this.container = new this._PIXI.Container()
        gameContext.components.deviceResizer.setElementToResize({
            key: 'popupsSymbolsInfo',
            container: this.container,
            config: config.showModes
        })


        this._openedI = null
        this._openedJ = null

        this._popup = null
        this._contText = null
        this._texts = null

        this._createClickAreas()
        this._createPopup()
    }


    _createClickAreas () {
        const {
            columnsNum,
            symbolsNum,
            symbolWithDividerW,
            symbolWithDividerH,
            halfFullWidth,
            halfFullHeight,
            halfSymbolH,
            halfSymbolW,
            symbolW,
            symbolH,
        } = this._gameContext.data.slotMachine


        const clickAreaData = {
            color: 0xff0000,
            coords: [-halfSymbolW + 5, -halfSymbolH + 5, symbolW - 10, symbolH - 10],
            alpha: 0,
        }


        for (let i = 0; i < columnsNum; ++i) {
            for (let j = 0; j < symbolsNum; ++j) {
                const clickArea = _createRectangleDark(clickAreaData, this._PIXI)

                clickArea.x = -halfFullWidth + (i * symbolWithDividerW) + halfSymbolW
                clickArea.y = -halfFullHeight + (j * symbolWithDividerH) + halfSymbolH
                this.container.addChild(clickArea)

                clickArea.interactive = true
                clickArea.on('pointerup', () => this._onClick(i, j))
            }
        }
    }


    _createPopup () {
        const {
            imgKey,
            imgAnchorX,
            imgAnchorY,
            textX,
            textY,
            lineHeight,
            textLeftStyleKey,
            textRightStyleKey,
            symbolsWords,
            textLeftAnchorX,
            textLeftAnchorY,
            textRightAnchorX,
            textRightAnchorY,
        } = this._config.config


        this._popup = new this._PIXI.Sprite.from(imgKey)
        this._popup.anchor.set(imgAnchorX, imgAnchorY)
        this._popup.renderable = false
        this.container.addChild(this._popup)


        this._contText = new this._PIXI.Container()
        this._contText.x = textX
        this._contText.y = textY
        this._popup.addChild(this._contText)

        let maxTextsLines = 0
        for (let key in symbolsWords) {
            if (symbolsWords[key].length > maxTextsLines) maxTextsLines = symbolsWords[key].length
        }

        const leftStyle = new this._PIXI.TextStyle(this._gameContext.CONSTANTS.TEXT_STYLES[textLeftStyleKey])
        const rightStyle = new this._PIXI.TextStyle(this._gameContext.CONSTANTS.TEXT_STYLES[textRightStyleKey])

        this._texts = []
        for (let i = 0; i < maxTextsLines; ++i) {
            const ob = {}
            ob.left = new this._PIXI.Text('', leftStyle)
            ob.left.anchor.set(textLeftAnchorX, textLeftAnchorY)
            ob.right = new this._PIXI.Text('', rightStyle)
            ob.right.anchor.set(textRightAnchorX, textRightAnchorY)
            ob.left.y = ob.right.y = i * lineHeight
            this._contText.addChild(ob.left)
            this._contText.addChild(ob.right)
            this._texts.push(ob)
        }

        document.addEventListener('mouseup', this._hide.bind(this))
        document.addEventListener('touchend', this._hide.bind(this))
    }


    _onClick (i, j) {
        const { statesCanOpened } = this._config.config

        let isCanOpen = false
        for (let k = 0; k < statesCanOpened.length; ++k) {
            if (this._gameContext.data.state === statesCanOpened[k]) isCanOpen = true
        }
        if (!isCanOpen) return;

        if (
            this._openedI === i &&
            this._openedJ === j
        ) {
            this._popup.renderable = false;
            this._openedI = null
            this._openedJ = null
            return;
        }

        /** In first game open without restore from server not send wheels */
        if (!this._gameContext.data.serverResponse.wheels) return;
        /** ---- */

        setTimeout(() => {
            this._openedI = i
            this._openedJ = j

            this._updateText(i, j)
            this._showPopup(i, j)
        })
    }


    _updateText (i, j) {
        const { lineHeight, textY, symbolsWords, offsetInColumnOrder } = this._config.config

        const symbolNum = this._gameContext.components.slotMachine.getSlot(i, j  + offsetInColumnOrder).currentType
        const worlds = symbolsWords[symbolNum]


        let lines = 0
        for (let k = 0; k < this._texts.length; ++k) {
            const { left , right } = this._texts[k]

            if (worlds[k]) {
                ++lines

                const { s, t } = worlds[k]

                if (t[1]) {
                    left.renderable = true
                    left.text = t[0]
                    right.renderable = true
                    right.text = t[1]
                    right.anchor.x = this._config.config.textRightAnchorX
                } else {
                    left.renderable = false
                    right.renderable = true
                    right.text = t[0]
                    right.anchor.x = this._config.config.textRightAnchorXNoLeft
                }

                const scale = s || 1
                left.scale.set(scale)
                right.scale.set(scale)

            } else {
                left.renderable = false
                right.renderable = false
            }
        }

        this._contText.y = -(lines * lineHeight) / 2 + textY
    }



    _showPopup (i, j) {
        const { textXFlip, textX } = this._config.config

        const {
            symbolWithDividerW,
            symbolWithDividerH,
            halfFullWidth,
            halfFullHeight,
            halfSymbolH,
            halfSymbolW,
        } = this._gameContext.data.slotMachine

        this._popup.x = -halfFullWidth + halfSymbolW + (i * symbolWithDividerW)
        this._popup.y = -halfFullHeight + halfSymbolH + (j * symbolWithDividerH)

        if (i > 2) {
            this._popup.scale.x = -1
            this._contText.scale.x = -1
            this._contText.x = textXFlip
        } else {
            this._popup.scale.x = 1
            this._contText.scale.x = 1
            this._contText.x = textX
        }

        this._popup.renderable = true
    }


    _hide () {
        this._popup.renderable = false
    }
}



const _createRectangleDark = (data, _PIXI) => {
    const { color, coords, alpha } = data

    const rect = new _PIXI.Graphics()
    rect.beginFill(color)
    rect.drawRect(...coords)
    rect.endFill()
    rect.alpha = alpha
    return rect
}
