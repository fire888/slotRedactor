import * as PIXI from 'pixi.js-legacy'

import { Application } from '../src/elementsCommon/Application'
import { EventEmitter } from '../src/helpers/EventEmitter'
import { DeviceResizer } from '../src/helpers/DeviceResizerFixedRatio'


const root = {
    PIXI: PIXI,
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

window.emitter.subscribe('dragonBonesFiles', f => {
    console.log(f)
})

const app = new Application(root)