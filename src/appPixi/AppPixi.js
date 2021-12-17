import { Application } from './SlotMachineLibModified/src/elementsCommon/Application'
import { EventEmitter } from './SlotMachineLibModified/src/helpers/EventEmitter'
import { DeviceResizer } from './SlotMachineLibModified/src/helpers/DeviceResizerFixedRatio'
import { HOST } from "../globals";
import DragonBones from './SlotMachineLibModified/src/libs/dragonBones'
import { Spine } from 'pixi-spine'



let modifySceneValues = { x: 0, y: 0, scale: 1, isFlipX: false, isFlipY: false }


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

let app = new Application(root)
let currentItem = null
const factory = DragonBones.PixiFactory.factory


export const transformScene = (x, y, scale, isFlipX, isFlipY) => {
    modifySceneValues = { x, y, scale, isFlipX, isFlipY }

    if (!app || !app.app || !app.app.stage || !app.gameScene) {
        return;
    }

    app.app.stage.x = x
    app.app.stage.y = y
    app.gameScene.scale.set(scale)

    if (currentItem) {
        currentItem.scale.set(isFlipX ? -1 : 1, isFlipY ? -1 : 1)
    }
}



export const createItemViewByResources = (mode, id, data, callback) => {
    destroyCurrentItem()
    resetApp()
    clearPIXICache()


    if (mode === 'dragon-bones-files') {
        const currentFiles = {
            'dragon-ske': data.files['dragon-ske'],
            'dragon-tex': data.files['dragon-tex'],
            'dragon-img': data.files['dragon-img'],
        }

        loadDragonResources(currentFiles, res => {
            const { sp, animationsData, armatureNames } = createDragonSprite(res, id )
            app.gameScene.addChild(sp)
            currentItem = sp

            transformScene(modifySceneValues.x, modifySceneValues.y, modifySceneValues.scale, modifySceneValues.isFlipX, modifySceneValues.isFlipY)

            callback(animationsData, armatureNames)
        })

    }




    if (mode === 'spines-files') {
        const currentFiles = {
            'spine-ske': data.files['spine-ske'],
            'spine-atlas': data.files['spine-atlas'],
            'spine-img': data.files['spine-img'],
        }

        loadSpineFiles(currentFiles, res => {
            const sp = new Spine(res['spine-ske_' + id].spineData)
            app.gameScene.addChild(sp)
            currentItem = sp

            const animationsData = []
            const arrAnims = sp.spineData.animations
            for (let i = 0; i < arrAnims.length; i++) {
                animationsData.push({ name: arrAnims[i].name, duration: arrAnims[i].duration})
            }

            transformScene(modifySceneValues.x, modifySceneValues.y, modifySceneValues.scale, modifySceneValues.isFlipX, modifySceneValues.isFlipY)

            callback(animationsData)
        })
    }




    if (mode === 'image-static' || mode === 'image-blur') {
        const { path, name } = data.files[mode]
        const texture = window.PIXI.Texture.from(`${HOST}/${path}/${name}`);
        currentItem = new window.PIXI.Sprite()
        currentItem.anchor.set(.5)
        currentItem.texture = texture;
        app.gameScene.addChild(currentItem)

        transformScene(modifySceneValues.x, modifySceneValues.y, modifySceneValues.scale, modifySceneValues.isFlipX, modifySceneValues.isFlipY)

        callback()
    }
}




export const playAnimation = ({ animationName, count }) => {
    if (!currentItem) return;


    /** start spine animation */
    if (currentItem.spineData) {
        if (!count) {
            currentItem.state.setEmptyAnimation(0, 0)
            return;
        }

        if (count === 1) {
            currentItem.state.setAnimation(0, animationName, false)
        } else {
            currentItem.state.setAnimation(0, animationName, true)
        }

        return;
    }

    /** start dragon animation */
    if (count) {
        currentItem.animation.play(animationName, count)
    } else {
        currentItem.animation.stop()
    }
}


export const removeSpr = () => {}



/** ******************************************************************/

const loadDragonResources = (files, callback) => {
    const { fileKey, path, name } = files['dragon-ske']

    window.PIXI.Loader.shared.add(fileKey, `${HOST}/${path}/${name}`)
    window.PIXI.Loader.shared.load((loader, res) => {

        const { fileKey, path, name } = files['dragon-tex']
        window.PIXI.Loader.shared.add(fileKey, `${HOST}/${path}/${name}`)
        window.PIXI.Loader.shared.load((loader, res) => {

            const { fileKey, path, name } = files['dragon-img']
            window.PIXI.Loader.shared.add(fileKey, `${HOST}/${path}/${name}`)
            window.PIXI.Loader.shared.load((loader, res) => {
                callback(res)
            })
        })
    })
}


const createDragonSprite = (filesByKey, id) => {
    factory.parseDragonBonesData(filesByKey['dragon-ske_' + id].data);
    factory.parseTextureAtlasData(
        filesByKey['dragon-tex_' + id].data,
        filesByKey['dragon-img_' + id].texture
    )

    let armatureNames = null
    let animationNames = null

    const animationsData = []

    for (let key in factory._dragonBonesDataMap) {
        const dataItem = factory._dragonBonesDataMap[key]
        for (let keyArms in dataItem.armatures) {
            for (let animKey in dataItem.armatures[keyArms].animations) {
                animationsData.push({ name: animKey, duration: dataItem.armatures[keyArms].animations[animKey].duration })
            }
        }
        armatureNames = dataItem.armatureNames
    }


    const sp = factory.buildArmatureDisplay(armatureNames[0])
    return { sp, armatureNames, animationsData }
}


/** *****************************************************/

const loadSpineFiles = (files, callback) => {
    const loader = new window.PIXI.Loader()

    const { fileKey, path, name } = files['spine-ske']
    loader.add(fileKey, `${HOST}/${path}/${name}`)
    loader.load((loader, res) => {
        callback(res)
    })
}





/** ******************************************/

const resetApp = () => {
    app && app.destroy()
    app = new Application(root)
}


const destroyCurrentItem = () => {
    currentItem && currentItem.destroy({ children: true, texture: true, baseTexture: true })
    currentItem && currentItem.dispose && currentItem.dispose()
    currentItem = null
}

const clearPIXICache = () => {
    if (factory) {
        factory.clear(true)
        DragonBones.TextureData.clearPool()
        DragonBones.TextureAtlasData.clearPool()
        DragonBones.PixiTextureAtlasData.clearPool()
        DragonBones.BaseFactory && DragonBones.BaseFactory.clear && DragonBones.BaseFactory.clear()
    }


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
}

