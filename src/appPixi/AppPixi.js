import { Application } from './SlotMachineLibModified/src/elementsCommon/Application'
import { EventEmitter } from './SlotMachineLibModified/src/helpers/EventEmitter'
import { DeviceResizer } from './SlotMachineLibModified/src/helpers/DeviceResizerFixedRatio'
import { LoaderAssets } from './helpers/LoaderPixi'
import { createContainerDragonSprites } from './containers/ContainerDragonSprites'
import { HOST } from "../globals";
import DragonBones from './SlotMachineLibModified/src/libs/dragonBones'


// import sSke from '../assets/testScatter/scatter_ske.json'
// import sTex from '../assets/testScatter/scatter_tex.json'
// import sImg from '../assets/testScatter/scatter_tex.png'



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
//app.app.stage.addChild(container)



/************************************************************ */

const factory = DragonBones.PixiFactory.factory

const createFactory = (files) => {
    factory.parseDragonBonesData(files['skeletonJson'].data);
    factory.parseTextureAtlasData(
        files['textureJson'].data,
        files['image'].texture
    )
} 


const createDragonSprite = (armatureName, animationName) => {
    const s = factory.buildArmatureDisplay(armatureName)
    s.animation.play(animationName, 30)
    return s
}










/*************************************************************** */

let isLoaded = false

window.emitter.subscribe('dragonBonesFiles', fileData => {

    if(isLoaded) return;
    isLoaded = true

    console.log(fileData)
    const dataSke = {'skeletonJson': `${ HOST }/${fileData.files['dragon-ske'].path}/${fileData.files['dragon-ske'].name}`}
    const dataTex = {'textureJson': `${ HOST }/${fileData.files['dragon-tex'].path}/${fileData.files['dragon-tex'].name}`}
    const img = {'image': `${ HOST }/${fileData.files['dragon-img'].path}/${fileData.files['dragon-img'].name}`}

    console.log(dataSke, dataTex, img)

    loader.loadAnimated([dataSke, dataTex, img],
        res => {
            createFactory(res)
            const s = createDragonSprite(fileData.armatureName, fileData.animationsNames[0])
            s.x = 300
            s.y = 300
            app.app.stage.addChild(s)
        })
})
