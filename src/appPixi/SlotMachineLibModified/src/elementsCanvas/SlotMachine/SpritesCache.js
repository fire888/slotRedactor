let SYMBOLS, PIXI

export function setContext (config, pixi) {
    SYMBOLS = config
    PIXI = pixi
}


export function prepare (slotCache) {
    for (let i = 0; i < SYMBOLS.length; i ++) {
        prepareCacheByMode(i, '0', slotCache)
        prepareCacheByMode(i, '1', slotCache)
        prepareCacheByMode(i, '2', slotCache)
    }
}


const prepareCacheByMode = (type, mode, cache) => {
     if (!cache[ type ]) cache[ type ] = {}
     if (!cache[ type ][ mode ]) {
        if (mode === '2' || mode === '1') {
            cache[ type ][ mode ] = new PIXI.Sprite(getTexture(type, mode))
            cache[ type ][ mode ].anchor.set(0.5)
        }
        if (mode === '0') {
            cache[ type ][ mode ] = createAnimatedSprite(type)
            cache[ type ][ mode ].anchor.set(0.5)
        }
     }
}



const getTexture = (typeItem, typeTexture) => {
    const type = typeItem < 10 ? '0' + typeItem : typeItem
    if (typeTexture == 1) typeTexture = SYMBOLS[typeItem].notBlur ? 2 : 1
    return PIXI.Texture.from(`item${ type }_anim0${ typeTexture }_fr00.png`)
}


const createAnimatedSprite = type => {
    let arrTexturesFrames = getFramesForAnimation(type)
    let sprite = arrTexturesFrames
        ? new PIXI.AnimatedSprite(arrTexturesFrames)
        : new PIXI.Sprite(getTexture(type, 2))
    sprite.animationSpeed = SYMBOLS[type].animationSpeed
    return sprite
}


const TEXTURES_ANIMATION = {
    '0': [],
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': [],
    '7': [],
    '8': [],
    '9': [],
    '10': [],
    '11': [],
    '12': [],
    '13': [],
}


const getFramesForAnimation = type => {
    if (TEXTURES_ANIMATION[ type ].length > 0) {
        return TEXTURES_ANIMATION[ type ]
    }
    if (SYMBOLS[type].frames === 0) {
        return null
    }
    for (let i = 0; i < SYMBOLS[type].frames - 1; i++) {
        let val = i < 10 ? `0${ i }` : `${ i }`
        TEXTURES_ANIMATION[ type ].push(PIXI.Texture.from(`item0${ type }_anim00_fr${ val }.png`))
    }
    return TEXTURES_ANIMATION[ type ]
}

