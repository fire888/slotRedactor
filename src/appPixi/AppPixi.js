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

let app = new Application(root)
let currentItem = null
const factory = DragonBones.PixiFactory.factory
let armatureNames = null
let animationNames = null



export const canvasShow = (mode, id, data, callback) => {
    console.log(mode, data)

    destroyCurrentItem()
    resetApp()
    clearPIXICache()


    let currentFiles = {}



    if (mode === 'dragonBones-view') {
        currentFiles = {
            'dragon-ske': data.files['dragon-ske'],
            'dragon-tex': data.files['dragon-tex'],
            'dragon-img': data.files['dragon-img'],
        }

        loadDragonResources(currentFiles, res => {
            const { sp, animationNames, armatureNames } = createDragonSprite(res, id )
            app.gameScene.addChild(sp)
            currentItem = sp
            callback(animationNames)
        })

    }




    if (mode === 'spine-view') {
        currentFiles = {
            'spine-ske': data.files['spine-ske'],
            'spine-atlas': data.files['spine-atlas'],
            'spine-img': data.files['spine-img'],
        }

        console.log('spineView', currentFiles)
    }




    if (mode === 'image-static' || mode === 'image-blur') {
        const { path, name } = data.files[mode]
        const texture = window.PIXI.Texture.from(`${HOST}/${path}/${name}`);
        currentItem = new window.PIXI.Sprite()
        currentItem.anchor.set(.5)
        currentItem.texture = texture;
        app && app.gameScene && app.gameScene.addChild(currentItem)
        callback()
    }


}


export const playAnimation = ({ animationName, count }) => {
    if (!currentItem) return;
    if (count) {
        currentItem.animation.play(animationName, count)
    } else {
        currentItem.animation.stop()
    }
}



/** ******************************************************************/

const loadDragonResources = (files, callback) => {
    //const keysFiles = ['dragon-ske', 'dragon-tex', 'dragon-img']


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

    for (let key in factory._dragonBonesDataMap) {
        const dataItem = factory._dragonBonesDataMap[key]
        for (let keyArms in dataItem.armatures) {
            console.log('animations: ', dataItem.armatures[keyArms].animationNames)
            animationNames = dataItem.armatures[keyArms].animationNames
        }
        console.log('arm: ', dataItem.armatureNames[0])
        armatureNames = dataItem.armatureNames
    }


    const sp = factory.buildArmatureDisplay(armatureNames[0])
    return { sp, armatureNames, animationNames }
    //app.gameScene.addChild(currentArmature)
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
/** ******************************************/


















/** STATIC IMAGES ************************************************************* */

const showImage = (fileData, callback) => {
    const texture = PIXI.Texture.from(`${HOST}/${fileData.path}/${fileData.name}`);
    if (!currentSprite) {
        currentSprite = new window.PIXI.Sprite()
        currentSprite.anchor.set(.5)
    }
    currentSprite.texture = texture;
    currentSprite.renderable = true
    app && app.gameScene && app.gameScene.addChild(currentSprite)
    callback()
}

const hideImage = () => {
    currentSprite.renderable = false
}


/** DRAGON BONES ************************************************************* */





const createFactory = (files) => {
    const filesByKey = {}

    for (let key in files) {
        const k = key.split('_')[0]
        filesByKey[k] = files[key]
    }

    if (!filesByKey['dragon-ske']) {
        return;
    }


    try {
        factory.parseDragonBonesData(filesByKey['dragon-ske'].data);
    } catch {
        console.log('create factory mistake')
    }

    try {
        factory.parseTextureAtlasData(
            filesByKey['dragon-tex'].data,
            filesByKey['dragon-img'].texture
        )
    } catch {
        console.log('parse factory mistake')
    }


    for (let key in factory._dragonBonesDataMap) {
        const dataItem = factory._dragonBonesDataMap[key]
        for (let keyArms in dataItem.armatures) {
            console.log('animations: ', dataItem.armatures[keyArms].animationNames)
            animationNames = dataItem.armatures[keyArms].animationNames
        }
        console.log('arm: ', dataItem.armatureNames[0])
        armatureNames = dataItem.armatureNames
    }
} 


const showS = () => {
    currentArmature = factory.buildArmatureDisplay(armatureNames[0])
    app.gameScene.addChild(currentArmature)
}


const removeSpr = () => {
    if (!currentArmature) return;
    app.gameScene.removeChild(currentArmature)
    currentArmature.destroy()
}



/************************************************************ */


// const loadDragonResources = (files, callback) => {
//     const keysFiles = ['dragon-ske', 'dragon-tex', 'dragon-img']
//
//     let isFiles = true
//     for (let i = 0; i < keysFiles.length; i++) {
//         if (!files[keysFiles[i]]) isFiles = false
//     }
//     if (!isFiles) return;
//
//     let currentKey = keysFiles[2]
//     const { fileKey, path, name } = files[currentKey]
//     window.PIXI.Loader.shared.add(fileKey, `${HOST}/${path}/${name}`)
//     window.PIXI.Loader.shared.load((loader, res) => {
//
//         currentKey = keysFiles[1]
//         const { fileKey, path, name } = files[currentKey]
//         window.PIXI.Loader.shared.add(fileKey, `${HOST}/${path}/${name}`)
//         window.PIXI.Loader.shared.load((loader, res) => {
//
//             currentKey = keysFiles[0]
//             const { fileKey, path, name } = files[currentKey]
//             window.PIXI.Loader.shared.add(fileKey, `${HOST}/${path}/${name}`)
//             window.PIXI.Loader.shared.load((loader, res) => {
//                 callback(res)
//             })
//         })
//
//     })
// }



let isLoading = false


const showDragonSpr = (filesData, callback) => {
    if (isLoading) return
    isLoading = true
    setTimeout(() => isLoading = false, 1000)

    currentArmature && currentArmature.destroy({ children: true, texture: true, baseTexture: true })
    currentArmature && currentArmature.dispose()
    currentArmature = null

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

    //app && app.destroy()
    //currentSprite = null

    //app = new Application(root)
    loadDragonResources(filesData.files, res => {
        createFactory(res)
        showS()
        callback(animationNames)
    })
}

export {
    showDragonSpr,
    showImage,
    hideImage,
    removeSpr,
}



