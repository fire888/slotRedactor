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

    factory.parseDragonBonesData(files['skeletonJson'].data);
    factory.parseTextureAtlasData(
        files['textureJson'].data,
        files['image'].texture
    )
} 


const createDragonSprite = armatureName => {
    const s = factory.buildArmatureDisplay(armatureName)
    return s
}

/*************************************************************** */

let currentDragonSprite = null 

window.emitter.subscribe('startAnimate', animationName => {
    console.log(animationName)
    currentDragonSprite && currentDragonSprite.animation.play(animationName, 1)
})





/*************************************************************** */

let isLoaded = false

window.emitter.subscribe('dragonBonesFiles', fileData => {

    if(isLoaded) return;
    isLoaded = true
    setTimeout(() => isLoaded = false, 2000)


    const dataSke = {"skeletonJson": `${ HOST }/${fileData.files['dragon-ske'].path}/${fileData.files['dragon-ske'].name}`}
    const dataTex = {"textureJson": `${ HOST }/${fileData.files['dragon-tex'].path}/${fileData.files['dragon-tex'].name}`}
    const img = {"image": `${ HOST }/${fileData.files['dragon-img'].path}/${fileData.files['dragon-img'].name}`}

    loader.loadAnimated([dataSke, dataTex, img],
        res => {
            if (!isFactoryCreated[fileData.armatureName]) {
                createFactory(res)
                isFactoryCreated[fileData.armatureName] = true
            }

            if (currentDragonSprite !== null) {
                app.app.stage.removeChild(currentDragonSprite)
                currentDragonSprite.destroy()
            }


            currentDragonSprite = createDragonSprite(fileData.armatureName)
            currentDragonSprite.x = 300
            currentDragonSprite.y = 300
            app.app.stage.addChild(currentDragonSprite)
        })
})
