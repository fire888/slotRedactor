import { Application } from './SlotMachineLibModified/src/elementsCommon/Application'
import { EventEmitter } from './SlotMachineLibModified/src/helpers/EventEmitter'
import { DeviceResizer } from './SlotMachineLibModified/src/helpers/DeviceResizerFixedRatio'
import { LoaderAssets } from './helpers/LoaderPixi'
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
    ratio: 1.85,
    maxHtmlFontSize: 12.5,
    minHtmlFontSize: 5.5,
    appSize: {
        fixedRatio: true,
        'desktop': {
            ratio: 1.85
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
const loader = new LoaderAssets(root)




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

window.emitter.subscribe('startAnimate', animationName => {
    currentDragonSprite && currentDragonSprite.animation.play(animationName, 1)
})





/*************************************************************** */

let isLoaded = false
const keysFiles = ['dragon-ske', 'dragon-tex', 'dragon-img']

window.emitter.subscribe('dragonBonesFiles', fileData => {

    let isFiles = true
    for (let i = 0; i < keysFiles.length; i++) {
        if (!fileData.files[keysFiles[i]]) isFiles = false
    }
    if (!isFiles) return;

    if(isLoaded) return;
    isLoaded = true
    setTimeout(() => isLoaded = false, 2000)


    const arrUnicKeysFiles = []
    const arrKeys = []
    for (let key in fileData.files) {
        arrUnicKeysFiles.push(fileData.files[key].fileKey)
        if (loader._resources && loader._resources[fileData.files[key].fileKey]) {
            console.log('already exists')
            showS(fileData.armatureName)
            return;
        }
        arrKeys.push(key)
    }
    const objToLoad = {}
    for (let i = 0; i < arrUnicKeysFiles.length; i++) {
         objToLoad[i] = {}
         const path = fileData.files[arrKeys[i]].path
         const name = fileData.files[arrKeys[i]].name
         objToLoad[i][arrUnicKeysFiles[i]] = `${ HOST }/${path}/${name}`
    }
    const arrToLoad = []
    for (let key in objToLoad) {
        arrToLoad.push(objToLoad[key])
    }



    loader.loadAnimated(arrToLoad,
        res => {
            if (!isFactoryCreated[fileData.armatureName]) {
                createFactory(res)
                isFactoryCreated[fileData.armatureName] = true
            }

            showS(fileData.armatureName)

            // if (currentDragonSprite !== null) {
            //     app.app.stage.removeChild(currentDragonSprite)
            //     currentDragonSprite.destroy()
            // }


            // currentDragonSprite = createDragonSprite(fileData.armatureName)
            // currentDragonSprite.x = 300
            // currentDragonSprite.y = 300
            // app.app.stage.addChild(currentDragonSprite)
        })
})


const showS = (armatureName) => {
    if (currentDragonSprite !== null) {
        app.app.stage.removeChild(currentDragonSprite)
        currentDragonSprite.destroy()
    }


    currentDragonSprite = createDragonSprite(armatureName)
    currentDragonSprite.x = 300
    currentDragonSprite.y = 300
    app.app.stage.addChild(currentDragonSprite)
}
