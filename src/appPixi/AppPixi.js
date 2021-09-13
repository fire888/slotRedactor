import { Application } from './SlotMachineLibModified/src/elementsCommon/Application'
import { EventEmitter } from './SlotMachineLibModified/src/helpers/EventEmitter'
import { DeviceResizer } from './SlotMachineLibModified/src/helpers/DeviceResizerFixedRatio'
import { LoaderAssets } from './helpers/LoaderPixi'
import { HOST } from "../globals";
import DragonBones from './SlotMachineLibModified/src/libs/dragonBones'
import dragonBones from './SlotMachineLibModified/src/libs/dragonBones';






const root = {
    PIXI: window.PIXI,
    container: document.querySelector('.app-container'),
    data: {
        windowData: {
            deviceMode: 'desktop',
        }
    },
    components: {}
}

root.components.eventEmitter = new EventEmitter()
window.emitter = root.components.eventEmitter
root.components.deviceResizer = new DeviceResizer(root, { config: {
    w: 1920,
    h: 1080,
    ratio: 1.5,
    maxHtmlFontSize: 12.5,
    minHtmlFontSize: 5.5,
    appSize: {
        fixedRatio: true,
        'desktop': {
            ratio: 1.5,
        },
        'phone': {
            ratio: 2,
        },
        'phoneLong': {
            ratio: 2,
        },
        'phoneTop': {
            ratio: 0.5,
        },
    },
}})



const app = new Application(root)

/************************************************************ */

const loadDragonResources = (arr, callback) => {
    for (let i = 0; i < arr.length; i++) {
        const { fileKey, path } = arr[i]
        window.PIXI.Loader.shared.add(fileKey, path)
    }
    window.PIXI.Loader.shared.load((loader, res) => callback(res))
}




/************************************************************ */

const factory = DragonBones.PixiFactory.factory
const isFactoryCreated = {}

const createFactory = (files) => {
    const f = {}

    for (let key in files) {
        const k = key.split('_')[0]
        f[k] = files[key]
    }

    factory.parseDragonBonesData(f['dragon-ske'].data);
    factory.parseTextureAtlasData(
        f['dragon-tex'].data,
        f['dragon-img'].texture
    )
} 


const createDragonSprite = armatureName => {
    const s = factory.buildArmatureDisplay(armatureName)
    return s
}

/*************************************************************** */

let currentDragonSprite = null 
let currentData = null
let currentSpriteSheetKey = null


window.emitter.subscribe('startAnimate', animationName => {
    currentDragonSprite && currentDragonSprite.animation.play(animationName, 1)
})





/*************************************************************** */

//let isLoaded = false
const keysFiles = ['dragon-ske', 'dragon-tex', 'dragon-img']


window.emitter.subscribe('dragonBonesFiles', fileData => {

    let isFiles = true
    for (let i = 0; i < keysFiles.length; i++) {
        if (!fileData.files[keysFiles[i]]) isFiles = false
    }
    if (!isFiles) return;

    window.PIXI.Loader.shared.reset()

    const arrToLoad = []
    for (let key in fileData.files) {
        const { fileKey, path, name } = fileData.files[key]
        arrToLoad.push({ fileKey, path: `${HOST}/${path}/${name}` })
    }

    loadDragonResources(arrToLoad, res => {
        if (!isFactoryCreated[fileData.armatureName]) {
            createFactory(res)
            isFactoryCreated[fileData.armatureName] = true
        }

        showS(fileData.armatureName)
    })
})


const showS = (armatureName) => {
    if (currentDragonSprite !== null) {
        app.gameScene.removeChild(currentDragonSprite)
        currentDragonSprite.destroy()
    }


    currentDragonSprite = createDragonSprite(armatureName)
    currentDragonSprite.x = -100
    currentDragonSprite.y = 0
    app.gameScene.addChild(currentDragonSprite)
}
