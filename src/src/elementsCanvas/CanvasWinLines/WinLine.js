

export class WinLine {
    constructor (id, gameContext) {
        this._PIXI = gameContext.PIXI
        this._linePath = gameContext.data.lines.points[id]
        this._id = id

        this.container = new this._PIXI.Container()

        this.beginIndex = this._linePath.nums
        this.speed = 0

        this.points = []
        for (let i = 0; i < this._linePath.nums; i++) {
            this.points.push(new this._PIXI.Point(this._linePath.points[this.beginIndex + i][0], this._linePath.points[this.beginIndex + i][1]))
        }
        this.line = new this._PIXI.SimpleRope(this._PIXI.Texture.from('trailAnimLong.png'), this.points)
        this.line.blendmode = this._PIXI.BLEND_MODES.ADD
        this.container.alpha = 0

        this.container.addChild(this.line)

        this.state = 'none' // || 'start' || 'moreAnimation' || 'pause' || 'lessAnimation'

        this.oldTime = Date.now()
    }


    show (duration = 1000) {
        this.speed = (this._linePath.points.length / 3) / (duration / 1000) / 30 //TODO: move duration to config
        this.state = 'start'
    }


    hide () {
        this.state = 'none'
        this.container.alpha = 0
    }


    update (count) {
        if (this.state === 'start') {
            this.container.alpha = 0
            this.beginIndex = this._linePath.nums
            this.state = 'moreAnimation'
        }

        if (this.state === 'moreAnimation') {
            this.moreAnimate(count)
        }

        if (this.state === 'pause') {
            return;
        }

        if (this.state === 'lessAnimation') {
            this.lessAnimate(count)
        }
    }


    moreAnimate (count) {
        if (this.beginIndex >= this._linePath.nums * 2) {
            this.state = 'pause'
            setTimeout(() => this.state = 'lessAnimation', 0)
            return
        }

        const solidBeginIndex = Math.floor(this.beginIndex)

        for (let i = 0; i < this.points.length; i++) {
            this.points[i].x = this._linePath.points[solidBeginIndex - i][0]
            this.points[i].y = this._linePath.points[solidBeginIndex - i][1]
        }
        this.beginIndex += (this.speed * count)

        if (this.container.alpha < 1 ) {
            this.container.alpha += 0.05
        }
    }

    lessAnimate (count) {
        if (this.beginIndex >= this._linePath.points.length - 2) {
            this.container.alpha = 0
            this.state = 'none'
            return
        }

        const solidBeginIndex = Math.floor(this.beginIndex)

        for (let i = 0; i < this.points.length; i++) {
            this.points[i].x = this._linePath.points[solidBeginIndex - i][0]
            this.points[i].y = this._linePath.points[solidBeginIndex - i][1]
        }

        this.beginIndex += (this.speed * count)

        if (this.beginIndex > this._linePath.points.length - 80) {
            this.container.alpha -= 0.03
        }
    }
}

