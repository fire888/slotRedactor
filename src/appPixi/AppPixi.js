import { Application } from '../src/elementsCommon/Application'
import { EventEmitter } from '../src/helpers/EventEmitter'
import { DeviceResizer } from '../src/helpers/DeviceResizerFixedRatio'
import { LoaderAssets } from './helpers/LoaderPixi'
import { createContainerDragonSprites } from './containers/ContainerDragonSprites'


import sSke from '../assets/testScatter/scatter_ske.json'
import sTex from '../assets/testScatter/scatter_tex.json'
import sImg from '../assets/testScatter/scatter_tex.png'



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
const container = createContainerDragonSprites(root)
app.app.stage.addChild(container)


window.emitter.subscribe('dragonBonesFiles', fileData => {
    console.log(fileData)
    const arrToLoad = []
    for (let key in fileData) {
        if (key === 'skeletonJson') {
            arrToLoad.push({ 'skeletonJson': fileData[key] })
        }
        if (key === 'textureJson') {
            arrToLoad.push({ 'textureJson': fileData[key] })
        }
        if ('image') {
            arrToLoad.push({ 'imageDr': fileData[key] })
        }
    }

    loader.load([ {key: 's', dataKey: fileData['imageDr']} ])

    const s = new PIXI.Sprite.from(fileData.imageDr)

    //app.app.style.addChild([s, )

    // loader.loadAnimated(arrToLoad, res => {
    //     container.createDragonFactory('scatter2', res)
    //     const s = container.createSpByKey('scatter2')
    //     s.x = 400
    //     s.y = 400
    //     console.log(res)
    // })

})


loader.loadAnimated([{ 'skeletonJson': sSke }, { 'textureJson': sTex }, { 'image': sImg },], res => {
    container.createDragonFactory('scatter', res)
    const s = container.createSpByKey('scatter')
    s.x = 300
    s.y = 300
    console.log(res)
})