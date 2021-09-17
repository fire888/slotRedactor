import { Application } from './SlotMachineLibModified/src/elementsCommon/Application'
import { EventEmitter } from './SlotMachineLibModified/src/helpers/EventEmitter'
import { DeviceResizer } from './SlotMachineLibModified/src/helpers/DeviceResizerFixedRatio'
import { HOST } from "../globals";
import DragonBones from './SlotMachineLibModified/src/libs/dragonBones'






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






/************************************************************ */

let app = null
let currentArmature = null 
const factory = DragonBones.PixiFactory.factory





const createFactory = (files) => {
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


const showS = (armatureName) => {
    currentArmature = factory.buildArmatureDisplay(armatureName)
    currentArmature.x = -100
    currentArmature.y = 0
    app.gameScene.addChild(currentArmature)
}

window.emitter.subscribe('startAnimate', ({ animationName, count }) => {
    if (!currentArmature) return;  
    if (count) { 
        currentArmature.animation.play(animationName, count)
    } else {
        currentArmature.animation.stop() 
    }
})



/************************************************************ */

const loadDragonResources = (files, callback) => {
    const keysFiles = ['dragon-ske', 'dragon-tex', 'dragon-img']

    let isFiles = true
    for (let i = 0; i < keysFiles.length; i++) {
        if (!files[keysFiles[i]]) isFiles = false
    }
    if (!isFiles) return;
    
    for (let key in files) {
        const { fileKey, path, name } = files[key]
        window.PIXI.Loader.shared.add(fileKey, `${HOST}/${path}/${name}`)
    }
    window.PIXI.Loader.shared.load((loader, res) => callback(res))
}



/*************************************************************** */

let isLoading = false

window.emitter.subscribe('dragonBonesFiles', fileData => {
    
    if (isLoading) return
    isLoading = true
    setTimeout(() => isLoading = false, 1000)
    
    currentArmature && currentArmature.destroy({ children: true, texture: true, baseTexture: true })
    currentArmature && currentArmature.dispose()

    factory.clear(true)
    DragonBones.TextureData.clearPool()
    DragonBones.TextureAtlasData.clearPool()
    DragonBones.PixiTextureAtlasData.clearPool()
    DragonBones.BaseFactory && DragonBones.BaseFactory.clear && DragonBones.BaseFactory.clear()



    for (var textureUrl in window.PIXI.utils.BaseTextureCache) {
        delete PIXI.utils.BaseTextureCache[textureUrl]
    }
    for (var textureUrl in window.PIXI.utils.TextureCache) {
        delete PIXI.utils.TextureCache[textureUrl]
    }
    for (var url in window.PIXI.Loader.shared.resources) {
        delete window.PIXI.Loader.shared.resources[url]
    }
    PIXI.utils.destroyTextureCache()
    
    app && app.destroy()

    app = new Application(root)
    loadDragonResources(fileData.files, res => {
        if (!fileData.armatureName) return;
        createFactory(res)
        showS(fileData.armatureName)
    })
})


