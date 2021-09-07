import WidgetCentralMessage from './WidgetCentralMessage'



const TEMPLATES = {
    'GIFT_GAME_INTRO': [
        {
            key: 'firstMess',
            pos: [0, -32],
            font: 'giftMainMessageStyleText',
            text: 'Congratulations!',
            anchor: [0.5, 0.5],
            scale: .6,
        },
        {
            key: 'secondMess',
            pos: [0, 0],
            font: 'centralText',
            text: '\nYou have received\n',
            anchor: [0.5, 0.5],
            scale: .8,
        },
        {
            key: 'mess',
            pos: [0, 50],
            font: 'giftMainMessageStyleText',
            text: '5 GIFT SPINS',
            anchor: [0.5, 0.5],
            scale: .6,
        },
    ],
}




export class ChangerGiftSpins {
    constructor (gameContext, config) {
        this._conf = config
        this._gameContext = gameContext
        this._t = this._gameContext.components['locale']

        this._texts = {}

        this._createBottomWidget()
        this._createSpriteAlertMessageBox()

        this._texts['mess'].on('pointerdown', this._onClickClosePopup.bind(this))
        this._popupMode = 'end' // || 'start'

        this._onClose = () => {}
    }




    /** public ***************************************/

    checkRestoreGiftSpins () {
        return new Promise(resolve => {
            const { gift } = this._gameContext.data.serverResponse

            if (gift && gift.current_giftspin === 0) {
                this._startGiftSpins(gift, resolve)
            } else if (gift && gift.current_giftspin > 0 && gift.current_giftspin < gift.total_giftspins) {
                this._startGiftSpinsNotFromNull(gift, resolve)
            } else if (gift && gift.current_giftspin === gift.total_giftspins) {
                this._removeContainers(gift, resolve)
            } else {
                setTimeout(resolve)
            }
        })
    }


    checkIsStartGiftSpins () {
        return new Promise(resolve => {
            const { gift, currentBalance } = this._gameContext.data.serverResponse

            if (this._popupMode === 'end' && gift && gift.current_giftspin === 1) {
                this._gameContext.components.changerBalance.setBalance(currentBalance - gift.total_win)
                this._startGiftSpins(gift, () => {
                    this._changeWidgetMessage (gift)
                    resolve()
                })
            } else if (this._popupMode === 'start' && gift && gift.current_giftspin > 0 && gift.current_giftspin < gift.total_giftspins + 1) {
                this._changeWidgetMessage(gift)
                resolve()
            } else {
                /** check bugs */

                /** in another browser gifts clicked */
                if (this._popupMode === 'start' && !gift) {
                    this._popupMode = 'end'
                    this._removeBottomWidget()
                }

                /** in another browser get gifts */
                if (this._popupMode === 'end' && gift) {
                    this._popupMode = 'start'
                    this._appendBottomWidget()
                    this._changeWidgetMessage (gift)
                }


                setTimeout(resolve)
            }
        })
    }


    checkIsEndGiftSpins () {
        return new Promise(resolve => {
            const { gift } = this._gameContext.data.serverResponse

            if (gift && gift.current_giftspin === gift.total_giftspins) {
                this._removeContainers(gift, () => {
                    this._gameContext.components.changerBalance.setBalance(this._gameContext.data.serverResponse.currentBalance)
                    this._removeBottomWidget()
                    resolve()
                })
            } else {
                resolve()
            }
        })
    }



    /** internal *************************************************/

    _startGiftSpins (gift, resolve) {
        this._popupMode = 'start'

        this._texts['secondMess'].text = this._t.getPhrase('You have received\n')

        this._gameContext.data.windowData.deviceMode !== 'desktop' && this._gameContext.components.ui.showAllUi(false)
        this._texts['mess'].buttonMode = true
        this._texts['mess'].interactive = true
        this._texts['mess'].text = `${ gift.total_giftspins } ${ this._t.getPhrase('GIFT SPINS') }\n`
        this._alertMess.renderable = true

        this._onClose = resolve
    }


    _startGiftSpinsNotFromNull (gift, resolve) {
        this._popupMode = 'start'

        this._texts['secondMess'].text = ''

        this._gameContext.data.windowData.deviceMode !== 'desktop' && this._gameContext.components.ui.showAllUi(false)
        this._texts['mess'].buttonMode = true
        this._texts['mess'].interactive = true
        this._texts['mess'].text = `${ gift.current_giftspin } ${ this._t.getPhrase('of') } ${ gift.total_giftspins } ${ this._t.getPhrase('GIFT SPINS') }\n\n`
        this._alertMess.renderable = true

        this._onClose = resolve
    }


    _appendBottomWidget () {
        this.container.renderable = true
        this._widget.setText(this._t.getPhrase(`Press Spin to start`))

        this._gameContext.components.ui.centralMessage.container.scale.set(.7)
        this._gameContext.components.ui.centralMessage.container.y -= 28
        this._gameContext.components.ui.centralMessage.container.renderable = true
    }


    _removeBottomWidget () {
        this._gameContext.components.ui.centralMessage.container.scale.set(1)
        this._gameContext.components.ui.centralMessage.container.y += 28

        this.container.renderable = false
        this._gameContext.components['ui'].centralMessage.container.renderable = true
    }




    _changeWidgetMessage (gift) {
        this._widget.setText(`${gift.current_giftspin} ${ this._t.getPhrase('of') } ${gift.total_giftspins} ${ this._t.getPhrase('gift spins') }`)
    }




    _removeContainers (gift, resolve) {
        this._popupMode = 'end'

        this._alertMess.renderable = true
        this._gameContext.data.windowData.deviceMode !== 'desktop' && this._gameContext.components.ui.showAllUi(false)
        this._texts['mess'].buttonMode = true
        this._texts['mess'].interactive = true
        this._texts['mess'].text = `${ gift.total_giftspins } ${ this._t.getPhrase('GIFT SPINS') }\n`

        this._texts['secondMess'].text = this._t.getPhrase('Completed all of\n')

        this._onClose = resolve
    }



    /** click popup ******************************************/

    _onClickClosePopup () {
        this._texts['mess'].buttonMode = false
        this._texts['mess'].interactive = false
        this._alertMess.renderable = false

        if (this._popupMode === 'start') {
            this._gameContext.data.windowData.deviceMode !== 'desktop' && this._gameContext.components.ui.showAllUi(true)
            this._appendBottomWidget(this._gameContext.data.serverResponse.gift)
        } else if (this._popupMode === 'end') {
            this._gameContext.components.ui.setWinValue('0.00')
            this._gameContext.data.windowData.deviceMode !== 'desktop' && this._gameContext.components.ui.showAllUi(true)
            delete this._gameContext.data.serverResponse.gift
        }

        this._gameContext.components.ui.enableButtons()
        this._onClose()
    }





    /** create widget **************************************/

    _createBottomWidget () {
        const uiConfig = this._gameContext.layers.filter(item => item.key === 'ui')[0].data
        this._widget = new WidgetCentralMessage(this._gameContext, uiConfig)
        this._widget.container.scale.set(.7)
        this._widget.container.y += 10

        this.container = new this._gameContext.PIXI.Container()
        this.container.addChild(this._widget.container)

        this.container.renderable = false

        this._gameContext.components.deviceResizer.setElementToResize({
            key: 'changerGiftSpins',
            container: this.container,
            config: uiConfig.showModes
        })
    }




    /** create popups *************************************/

    _createSpriteAlertMessageBox () {
        const { srcImgBack, srcImgBtn } = this._conf.config


        this._alertMess = new this._gameContext.PIXI.Container()
        this._alertMess.renderable = false

        const backSpr = new this._gameContext.PIXI.Sprite.from( srcImgBack)
        backSpr.anchor.set(.5)
        backSpr.scale.set(1.2)
        this._alertMess.addChild(backSpr)

        const btnSpr = new this._gameContext.PIXI.Sprite.from(srcImgBtn)
        btnSpr.anchor.set(.5)
        btnSpr.scale.set(.7)
        btnSpr.y = 75
        this._alertMess.addChild(btnSpr)

        this._gameContext.components.gameScene.addChild(this._alertMess)


        this._createTemplate('GIFT_GAME_INTRO', this._alertMess)

        this._gameContext.components.deviceResizer.setElementToResize({
            key: 'changerGiftSpinsAlertMess',
            container: this._alertMess,
            config: this._conf.showModes
        })
    }



    _createTemplate (key, container) {
        const template = TEMPLATES[key]

        for (let i = 0; i < template.length; i++) {
            const stroke = this._createText(template[i])
            container.addChild(stroke)
        }

        return container
    }


    _createText (textData) {
        const textItem = new this._gameContext.PIXI.Text(this._t.getPhrase(textData.text) + '\n', this._gameContext.CONSTANTS.TEXT_STYLES[textData.font])
        textItem.anchor.set(textData.anchor[0], textData.anchor[1])
        textItem.position.x = textData.pos[0]
        textItem.position.y = textData.pos[1]
        textItem.scale.set(textData.scale)

        this._texts[textData.key] = textItem
        return textItem
    }
}