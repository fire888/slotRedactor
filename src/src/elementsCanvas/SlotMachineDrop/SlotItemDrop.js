import { SlotItem } from '../SlotMachine/SlotItem'



export class SlotItemDrop extends SlotItem {
    constructor (gameContext, symbolsConfig, num) {
        super(gameContext, symbolsConfig, num)

        gameContext.components.eventEmitter.subscribe('onEnterPlaceBet', () => {
           setTimeout(this.setIdleBetView.bind(this), 400)
        })
    }



    setNormalView (type) {
        if (type !== undefined) this.currentType = type
        this.currentMode = this._symbolsConfig[this.currentType].modeNormalAnimation || '2'
        this._changeCurrentSprite()
    }



    setDropView (type = null) {
        if (type !== null) this.currentType = type
        this.currentMode = this._symbolsConfig[this.currentType].modeDropAnimation || this._symbolsConfig[this.currentType].modeNormalAnimation || '2'
        this._changeCurrentSprite()
    }



    setWinView (type = null) {
        if (type !== null) this.currentType = type
        this.currentMode = this._symbolsConfig[this.currentType].modeWinAnimation ||  this._symbolsConfig[this.currentType].modeNormalAnimation || '2'
        this._changeCurrentSprite()
    }



    // setCustomView (type = null) {
    //     if (type !== null) this.currentType = type
    //     this.currentMode = this._symbolsConfig[this.currentType].modeCustomAnimation || '2'
    //     this._changeCurrentSprite()
    // }



    setIdleBetView (type) {
        if (type) this.currentType = type
        this.currentMode = this._symbolsConfig[this.currentType].modeNormalAnimationIdleBet || '2'
        this._changeCurrentSprite()
    }



    _changeCurrentSprite () {
        clearTimeout(this._timerAnimation)

        if (this.currentSprite) {
            if (this.currentSprite.stop) this.currentSprite.stop()
            if (this._tweenScale) {
                this._tweenScale = null
                clearTimeout(this._transformTick)
                this._transformSprite(0)
            }
            const spr = this.currentSprite
            this.container.removeChild(this.currentSprite)
            if (spr.spineData) {
                spr.destroy()
            }
        }


         if (this.currentMode === 'spineWin') {

             const type = this.currentType < 10 ? '0' + this.currentType : this.currentType
             this.currentSprite = new this._PIXI.spine.Spine(this._gameContext.resources[`item${ type }_00_Json`].spineData);
             const animation = this.currentSprite.state.setAnimation(0, this._symbolsConfig[this.currentType].spineWinAnimationName, false)


         } else if (this.currentMode === 'spineDrop') {

             const type = this.currentType < 10 ? '0' + this.currentType : this.currentType
             this.currentSprite = new this._PIXI.spine.Spine(this._gameContext.resources[`item${ type }_00_Json`].spineData);
             this.currentSprite.state.setAnimation(0, this._symbolsConfig[this.currentType].spineDropAnimationName, false)


         } else if (this.currentMode === 'spineNormalBet') {

             const type = this.currentType < 10 ? '0' + this.currentType : this.currentType
             this.currentSprite = new this._PIXI.spine.Spine(this._gameContext.resources[`item${ type }_00_Json`].spineData)
             this.currentType === 0 && (this.currentSprite.y = -1)

             const startAnimate = () => {
                 this.currentSprite.state.setAnimation(0, this._symbolsConfig[this.currentType].spineNormalAnimationNameBet, false)
                 clearTimeout(this._timerAnimation)
                 this._timerAnimation = setTimeout(startAnimate, Math.random() * 5000 + 2000)
             }

             if (type === '00') {
                 startAnimate()
             } else {
                 clearTimeout(this._timerAnimation)
                 this._timerAnimation = setTimeout(startAnimate, Math.random() * 3000)
             }


         } else {

             const imgToShow = this.currentMode === '3' ? '2' : this.currentMode
             this.currentSprite = this._cacheSprites[this.currentType][imgToShow]


        }

        this.container.addChild(this.currentSprite)



        if (this.currentMode === '0') {
            this._animateFrames()
        }



        if (this.currentMode === '3') {
            this._animateScale()
        }
    }
}
