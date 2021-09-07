import * as TWEEN from '../helpers/tween'


/**
 * Класс контейнер-менеджер еффектов подложки длительного вращения
 */
export class EffectFlashColumnContainer {
    constructor(gameContext) {
        this._gameContext = gameContext
        this._PIXI = gameContext.PIXI
        this.container = new this._PIXI.Container()

        /**данные слот машины ( количество колонок, полная высота в пикселях, ширина ) */
        const {
            columnsNum,
            halfFullWidth,
            halfFullHeight,
            symbolWithDividerW,
            halfSymbolW,
        } = this._gameContext.data.slotMachine

        /** колонка с которой эффект длмтельного вращения начинается */
        const {
            columnIdStartEffect
        } = gameContext.CONSTANTS.COLUMN_EFFECT_CONFIG


        /** обьект а не массив чтобы сразу обращаться по ключу к 3-ему еффекту и не создавать ненужные первые 2 */
        this._effects = {}
        for (let i = columnIdStartEffect; i < columnsNum; i++) {
            const effect = new EffectFlashColumn(gameContext)
            effect.container.x = -halfFullWidth + [i] * symbolWithDividerW + halfSymbolW
            effect.container.y = -halfFullHeight
            this.container.addChild(effect.container)
            this._effects[i] = effect
        }

        /** добавление ресайза при изменении размера экрана */
        this._gameContext.components.deviceResizer.setElementToResize({
            container: this.container,
            config: {
                playScreen: gameContext.CONSTANTS.PLAY_SCREEN_CONFIG.slotMachine,
            }
        })

        /** сохраняется массив колонок с данными есть ли в них длинное вращение или нет. */
        this._effectsData = null
        gameContext.components.eventEmitter.subscribe('onEnterStoppingWheels', data => this._effectsData = data)

        /** при остановки вращения колонки скрывается текущий эффект и включается следующий */
        gameContext.components.eventEmitter.subscribe('singleColumnRotationComplete', data => {
            if (this._effects[data.idColumnStopped] && this._effects[data.idColumnStopped].container.renderable === true) {
                this._effects[data.idColumnStopped].render(false)
            }
            if (this._effectsData) {
                 if (this._effectsData[data.idColumnStopped + 1] && this._effectsData[data.idColumnStopped + 1].mode === 'scattersLong') {
                    this._effects[data.idColumnStopped + 1].render(true)
                 }
            }
            if (data.idColumnStopped === 4) {
                this._effectsData = null
            }
        })
        gameContext.components.eventEmitter.subscribe('clickForceStop', this._forceStop.bind(this))
        gameContext.components.eventEmitter.subscribe('drawNewFrame', this._update.bind(this))
    }


    /**
     * Обновление каждого эффекта если он видим
     * @param {number} data
     * @private
     */
    _update (data) {
        for (let key in this._effects)
            this._effects[key].container.renderable && this._effects[key].update(data)
    }


    /**
     * Отключение видимости всех эффектов
     * @private
     */
    _forceStop() {
        this._effectsData = null
        for (let key in this._effectsData) {
            this._effects[key].render(false)
        }
    }
}



/**
 * Класс еффект с анимированными партиклами и подложкой
 */
class EffectFlashColumn {
    constructor(gameContext) {
        this._gameContext = gameContext
        this._PIXI = this._gameContext.PIXI

        this.container = new this._PIXI.Container()
        this.container.blendmode = this._PIXI.BLEND_MODES.ADD
        this.container.renderable = false
        this.container.alpha = 0

        const { fullHeight, halfSymbolW, symbolW } = this._gameContext.data.slotMachine

        const {
            offsetTop,
            offsetBottom,
            num,
            configParticleContainer,
            xFrom,
            xTo,
            scaleFrom,
            scaleTo,
            tint,
            anchor,
            speedFrom,
            speedTo,
            keyImg,
            back,
            isMask,

        } = this._gameContext.CONSTANTS.COLUMN_EFFECT_CONFIG

        /** генерим маску если нужно */
        if (isMask) {
            const mask = new this._PIXI.Graphics()
            mask.beginFill()
            mask.drawRect(-halfSymbolW, 0, symbolW, fullHeight)
            mask.endFill()
            this.container.mask = mask
            this.container.addChild(mask)
        }

        /** генерится подложка если нужна */
        if (back) {
            const { offsetX, offsetTop, scaleX, scaleY, keyImg, anchorX, anchorY, alpha } = back
            const sp = this._PIXI.Sprite.from(keyImg)
            sp.anchor.set(anchorX, anchorY)
            sp.x = offsetX
            sp.y = offsetTop
            sp.alpha = alpha
            sp.tint = tint
            sp.scale.set(scaleX, scaleY)
            this.container.addChild(sp)
        }

        /** генерится контейнер с партиклами */
        this._sprites = []
        this._speeds = []
        this._startPosition = fullHeight + offsetBottom
        this._endPosition = offsetTop
        const spritesContainer = new this._PIXI.ParticleContainer(num, configParticleContainer)
        for (let i = 0; i < num; i++) {
            const spr = new this._PIXI.Sprite.from(keyImg)
            spr.x = xFrom + Math.random() * (xTo - xFrom)
            spr.y = this._startPosition - i * fullHeight / num
            spr.anchor.set(anchor)
            spr.scale.set(scaleFrom + Math.random() * (scaleTo - scaleFrom))
            spr.tint = tint
            spritesContainer.addChild(spr)
            this._sprites.push(spr)

            this._speeds.push(speedFrom + Math.random() * (speedTo - speedFrom))
        }
        this.container.addChild(spritesContainer)
    }


    /**
     * Включение старта уменьшения или увеличения прозрачности и установка флага видимости
     * @param {boolean} is
     */
    render (is) {
        if (!is && !this.container.renderable) { return; }

        const {
            durationAlpha,
            maxAlpha,
            timerUpdateTween
        } = this._gameContext.CONSTANTS.COLUMN_EFFECT_CONFIG

        if (is) {
            this._gameContext.components.audioManager.play('longRotation')

            this.container.renderable = true
            this._tween = TWEEN.create({
                fromValue: 0,
                toValue: maxAlpha,
                duration: durationAlpha,
            })
        } else {
            this._tween = TWEEN.create({
                fromValue: maxAlpha,
                toValue: 0,
                duration: durationAlpha,
            })
        }


        const updateTween = () => {
            const {isDone, value} = this._tween.update(Date.now())

            this.container.alpha = value
            if (isDone && value === 0) this.container.renderable = false
            if (isDone) {return ;}

            setTimeout(updateTween, timerUpdateTween)
        }
        updateTween()
    }


    /**
     * Обновление партиклов
     * @param {number} count
     */
    update (count) {
        if (!this._sprites.length) { return; }

        const h = (this._startPosition - this._endPosition)

        for (let i = 0; i < this._sprites.length; i ++) {
            const sp = this._sprites[i]
            sp.y -= this._speeds[i] * count

            const f = (sp.y - this._endPosition) / h * Math.PI
            sp.alpha = Math.sin(f > 0 ? f : 0)

            if (sp.y < this._endPosition) sp.y = this._startPosition
        }
    }
}