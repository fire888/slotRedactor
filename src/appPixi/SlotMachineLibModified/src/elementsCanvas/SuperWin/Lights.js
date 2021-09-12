const PI = Math.PI
const halfPI = PI / 2
const PI2 = PI * 2

export class LightsContainer {
    constructor(gameContext, config) {
        this._PIXI = gameContext.PIXI
        this._gameContext = gameContext

        const { num, keyTexture, blendMode, r } = config.config.lights

        this._r = r

        const practiceLData = {
            position: true,
            rotation: true,
            alpha: true,
        }

        this.container = new this._PIXI.ParticleContainer(num, practiceLData)
        this.container.blendmode = this._PIXI.BLEND_MODES[blendMode]

        this._sprites = []
        this._sData = []



        for (let i = 0; i < num; i ++) {
            const spr = new this._PIXI.Sprite.from(keyTexture)
            spr.anchor.set(0.5)
            spr.rotation = (Math.PI * 2 / num) * i
            this.container.addChild(spr)
            this._sprites.push(spr)

            this._sData.push({ f: Math.random() * PI2 })
        }
    }


    update (distance) {
        const step = PI2 / this._sprites.length

        for (let i = 0; i < this._sprites.length; i ++) {
            const phaseDist = Math.sin(((distance * 2 + this._sData[i].f)) % 0.5)

            // радиус
            const offset =  phaseDist * this._r
            // угол
            const rad = step * i

            this._sprites[i].x = Math.cos(rad) * offset
            this._sprites[i].y = Math.sin(rad) * offset
            this._sprites[i].alpha = 0.5 - phaseDist
        }
    }
}
