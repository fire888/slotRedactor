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

const factory = DragonBones.PixiFactory.factory
const isFactoryCreated = {}


const createFactory = (files, armatureName) => {
    if (!isFactoryCreated[armatureName]) {
        isFactoryCreated[armatureName] = true
    } else {
        return;
    }

    const filesByKey = {}

    for (let key in files) {
        const k = key.split('_')[0]
        filesByKey[k] = files[key]
    }

    factory.parseDragonBonesData(filesByKey['dragon-ske'].data);
    factory.parseTextureAtlasData(
        filesByKey['dragon-tex'].data,
        filesByKey['dragon-img'].texture
    )
} 


const createDragonSprite = armatureName => {
    const s = factory.buildArmatureDisplay(armatureName)
    return s
}





/*************************************************************** */

let currentDragonSprite = null 

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

window.emitter.subscribe('startAnimate', animationName => {
    currentDragonSprite && currentDragonSprite.animation.play(animationName, 1)
})



/************************************************************ */

const loadDragonResources = (files, callback) => {
    const keysFiles = ['dragon-ske', 'dragon-tex', 'dragon-img']

    let isFiles = true
    for (let i = 0; i < keysFiles.length; i++) {
        if (!files[keysFiles[i]]) isFiles = false
    }
    if (!isFiles) return;

    PIXI.Loader.shared.reset()
    
    for (let key in files) {
        const { fileKey, path, name } = files[key]
        PIXI.Loader.shared.add(fileKey, `${HOST}/${path}/${name}`)
    }
    PIXI.Loader.shared.load((loader, res) => callback(res))
}



/*************************************************************** */

window.emitter.subscribe('dragonBonesFiles', fileData => {
    loadDragonResources(fileData.files, res => {
        if (!fileData.armatureName) return;
        createFactory(res, fileData.armatureName)
        showS(fileData.armatureName)
    })
})


