import {createAuto} from "../../helpers/tween";

const PI = Math.PI
const halfPI = PI / 2
const PI2 = PI * 2

export class MoneyContainer {
    constructor(gameContext, config) {
        this._PIXI = gameContext.PIXI
        this._gameContext = gameContext
        this._config = config

        this.container = new this._PIXI.Container()

        const { y, num, minHeight, maxHeight, width } = this._config.config.money

        this.container.y = y

        const practiceData = {
            position: true,
            scale: true,
            rotation: true,
            alpha: true,
        }

        this._containerM = new this._PIXI.ParticleContainer(num, practiceData)
        this._containerM.blendmode = this._PIXI.BLEND_MODES.ADD
        this.container.addChild(this._containerM)

        this._spritesM = []
        this._sDataM = []

        this._fullDist = 2 * PI2 // длина которую красиво проходит за 3 секунды

        for (let i = 0; i < 150; i ++) {
            const spr = new this._PIXI.Sprite.from('money.png')
            spr.anchor.set(0.5)
            spr.scale.set(Math.random() * 0.2 + 0.5)
            spr.alpha = 0
            this._containerM.addChild(spr)
            this._spritesM.push(spr)

            this._sDataM.push({
                h: Math.random() * (maxHeight - minHeight) + minHeight,
                w: (Math.random() * 2. - 1.) * width,
            })
        }

        this._updater = null
    }


    start ({ time }) {
        this.container.renderable = true
        this._gameContext.components.audioManager.loopMoneyMore(time)
        this._fullDist = Math.floor(time / 3000) * PI

        const tweenData = {
            tweenType: 'linear',
            fromValue: 0,
            toValue: this._fullDist,
            duration: time,
            actionWithValue: this._update.bind(this),
        }

        this._updater = createAuto(tweenData)
        this._updater.start()
        this.container.renderable = true

        return new Promise(resolve => resolve())
    }


    stop () {
        this._gameContext.components.audioManager.loopMoneyStop()
        this._updater.stop()
        this.container.renderable = false
    }


    reset() {
        this._update(0)
    }


    _update (distance) {
        // все спрайты будут расставлены от 0 до ПИ/2
        const step = halfPI / this._spritesM.length

        for (let i = 0; i < this._spritesM.length; i ++) {
            const sp = this._spritesM[i]
            const { h, w } = this._sDataM[i]

            // текущая фаза конкретного спрайта
            const dist = distance + (step * i)

            // движение влево каждое ПИ
            const phaseX = Math.sin(dist % halfPI)
            sp.x = w * phaseX

            // движение вверх низ каждое ПИ
            const phaseY = (dist * 2) % PI
            // -yPhase * 0.2 - опускает завершающюю часть
            sp.y = h * (Math.sin(phaseY) - (phaseY * 0.5))

            // рандом(w) + (повернуться 4 раза) пока проходится ПИ
            sp.rotation = w + (dist * 4)

            // масштаб х меняем пока проходим ПИ
            sp.scale.x = phaseX + 0.3
            // масштаб у меняем в семь раз быстрее пока проходим дистанцию
            sp.scale.y = sp.scale.x * Math.sin(dist * 7)

            // начинаем показ с последнего спрайта
            sp.alpha = dist > halfPI ? 1 : 0
            // заканчиваем показ c последнего спрайта прошедшего дистанцию
            if (sp.alpha === 1) sp.alpha = dist < this._fullDist ? 1 : 0
        }
    }
}

