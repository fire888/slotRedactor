export default class ButtonForUI {
    constructor (data, PIXI) {
        this._PIXI = PIXI
        this.data = data

        const { x, y, scale, defaultAlpha,clickAlpha, callback, maps } = data

        this.map = maps[0] ? this._PIXI.Texture.from(maps[0]) :  null
        this.mapHover = maps[1] ? this._PIXI.Texture.from(maps[1]) : null
        this.callback = callback

        this.sprite = this.createButton()
        this.sprite.scale.set(scale)
        this.sprite.x = x
        this.sprite.y = y
        this.defaultAlpha = defaultAlpha
        this.sprite.alpha = this.defaultAlpha
        this.clickAlpha = clickAlpha
        this.sprite.anchor.set(0.5)
    }


    createButton() {
        const button = new this._PIXI.Sprite(this.map)
        button.anchor.set(0.5);
        button.buttonMode = true;
        button.interactive = true;
        button
            .on('pointerdown', this.onButtonDown.bind(this))
            .on('pointerup', this.onButtonUp.bind(this))
            .on('pointerover', this.onButtonOver.bind(this))
            .on('pointerout', this.onButtonOut.bind(this));
        return button;
    }


    onButtonDown() {
        this.sprite.alpha = this.clickAlpha;
    }


    onButtonUp() {
        this.callback()
        this.sprite.alpha =  this.defaultAlpha
    }


    onButtonOver() {
        if (this.mapHover) this.sprite.texture = this.mapHover
        this.sprite.alpha = this.data.hoverAlpha
    }

    
    onButtonOut() {
        if (this.map) this.sprite.texture = this.map;
        this.sprite.alpha = this.data.defaultAlpha
    }
}


