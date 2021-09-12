/**
 *
 * EXAMPLE CONFIG
 *
 export const CANVAS_ROPE_ANIMATION = {
    initState: 'playScreen',
    destroyState: null,
    constructor: SpineRandomAnimations,
    assetsToLoad: {
        'playScreen': {
            'spineAnimations': {
                rope1Json,
                rope2Json,
            },
        },
    },
    showModes: SLOTS_CONTAINER.showModes,
    config: {
        ITEMS_DATA: [
            {
                resourceKey: 'rope1Json',
                x: 0,
                y: 30,
                scaleX: 1,
                scaleY: 1,
                name: '_rope1',
                animationName: ["rope1", "rope2"],
            },
            {
                resourceKey: 'rope2Json',
                x: 0,
                y: 30,
                scaleX: 1,
                scaleY: 1,
                name: '_rope2',
                animationName: ["rope1", "rope2"],
            }
        ],
        minTimer: 6000,
        maxTimer: 10000,
    }
}
 */



export class SpineRandomAnimations {
    constructor(gameContext, config) {
        this._PIXI = gameContext.PIXI
        this._gameContext = gameContext
        this._config = config

        this.container = new this._PIXI.Container()

        const arr = []

        for (let data of config.config.ITEMS_DATA) {
            const { name, x, y, scaleX, scaleY, resourceKey, animationsNames } = data
            const animationName = animationsNames[Math.floor(Math.random()*animationsNames.length)]

            const mesh = new this._PIXI.spine.Spine(this._gameContext.resources[resourceKey].spineData)
            mesh.state.setAnimation('0', animationName, false)
            mesh.x = x
            mesh.y = y
            mesh.scale.set(scaleX, scaleY)

            this.container.addChild(mesh)
            arr.push({ name, mesh, animationsNames })
        }


        this._gameContext.components['deviceResizer'].setElementToResize({
            key: 'ropeAnimation',
            container: this.container,
            config: config.showModes,
        })


        const animate = () => {
            for (let item of arr) {
                const { mesh, animationsNames } = item
                const animationName = animationsNames[Math.floor(Math.random()*animationsNames.length)]
                mesh.state.setAnimation('0', animationName, false)
            }
            const { minTimer, maxTimer } = this._config.config
            setTimeout(animate, minTimer + Math.random() * (maxTimer - minTimer))
        }

        animate()
    }
}


