import { SlotMachine } from '../../SlotMachineLib/src/elementsCanvas/SlotMachine/SlotMachine'
import { SlotColumnActionsCustom } from '../elementsCanvas/SlotMachineCustom'
import { SlotItemCustom } from '../elementsCanvas/SlotMachineCustom'
import * as spritesCache from '../../SlotMachineLib/src/elementsCanvas/SlotMachine/SpritesCache'

import { SLOT_MACHINE_CONFIG } from '../../SlotMachineLib/src/constants/canvasElementsConfig'
import { mergeDeep } from '../../SlotMachineLib/src/helpers/helperObj'


import item00_anim02_fr00 from '../assets/symbols/item00_anim02_fr00.png'
import item01_anim02_fr00 from '../assets/symbols/item01_anim02_fr00.png'
import item02_anim02_fr00 from '../assets/symbols/item02_anim02_fr00.png'
import item03_anim02_fr00 from '../assets/symbols/item03_anim02_fr00.png'
import item03_anim05_fr00 from '../assets/symbols/item03_anim05_fr00.png'
import item03_anim12_fr00 from '../assets/symbols/item03_anim12_fr00.png'
import item03_anim15_fr00 from '../assets/symbols/item03_anim15_fr00.png'
import item04_anim02_fr00 from '../assets/symbols/item04_anim02_fr00.png'
import item05_anim02_fr00 from '../assets/symbols/item05_anim02_fr00.png'
import item06_anim02_fr00 from '../assets/symbols/item06_anim02_fr00.png'
import item07_anim02_fr00 from '../assets/symbols/item07_anim02_fr00.png'
import item08_anim02_fr00 from '../assets/symbols/item08_anim02_fr00.png'
import item09_anim02_fr00 from '../assets/symbols/item09_anim02_fr00.png'
import item10_anim02_fr00 from '../assets/symbols/item10_anim02_fr00.png'
import item11_anim02_fr00 from '../assets/symbols/item11_anim02_fr00.png'

import item00_anim01_fr00 from '../assets/symbols/item00_anim01_fr00.png'
import item01_anim01_fr00 from '../assets/symbols/item01_anim01_fr00.png'
import item02_anim01_fr00 from '../assets/symbols/item02_anim01_fr00.png'
import item03_anim01_fr00 from '../assets/symbols/item03_anim01_fr00.png'
import item03_anim11_fr00 from '../assets/symbols/item03_anim11_fr00.png'
import item04_anim01_fr00 from '../assets/symbols/item04_anim01_fr00.png'
import item05_anim01_fr00 from '../assets/symbols/item05_anim01_fr00.png'
import item06_anim01_fr00 from '../assets/symbols/item06_anim01_fr00.png'
import item07_anim01_fr00 from '../assets/symbols/item07_anim01_fr00.png'
import item08_anim01_fr00 from '../assets/symbols/item08_anim01_fr00.png'
import item09_anim01_fr00 from '../assets/symbols/item09_anim01_fr00.png'
import item10_anim01_fr00 from '../assets/symbols/item10_anim01_fr00.png'
import item11_anim01_fr00 from '../assets/symbols/item11_anim01_fr00.png'


import item01_anim00_ske_i from  '../assets/_safariLess_14/symbols/item01_anim00/sun_ske.json'
import item01_anim00_tex_i from '../assets/_safariLess_14/symbols/item01_anim00/sun_tex.json'
import item01_anim00_png_i from '../assets/_safariLess_14/symbols/item01_anim00/sun_tex.png'


import item02_anim00_ske_i from  '../assets/_safariLess_14/symbols/item02_anim00/scatter_ske.json'
import item02_anim00_tex_i from '../assets/_safariLess_14/symbols/item02_anim00/scatter_tex.json'
import item02_anim00_png_i from '../assets/_safariLess_14/symbols/item02_anim00/scatter_tex.png'


import item03_anim00_ske_i from  '../assets/_safariLess_14/symbols/item03_anim00/wild_ske.json'
import item03_anim00_tex_i from '../assets/_safariLess_14/symbols/item03_anim00/wild_tex.json'
import item03_anim00_png_i from '../assets/_safariLess_14/symbols/item03_anim00/wild_tex.png'


import item04_anim00Json_i from '../assets/_safariLess_14/symbols/item04_anim00/scroll.json'
import '../assets/_safariLess_14/symbols/item04_anim00/scroll.png'
import '../assets/_safariLess_14/symbols/item04_anim00/scroll.atlas'


import item05_anim00Json_i from '../assets/_safariLess_14/symbols/item05_anim00/pendullum.json'
import '../assets/_safariLess_14/symbols/item05_anim00/pendullum.png'
import '../assets/_safariLess_14/symbols/item05_anim00/pendullum.atlas'


import item06_anim00Json_i from '../assets/_safariLess_14/symbols/item06_anim00/bottle.json'
import '../assets/_safariLess_14/symbols/item06_anim00/bottle.png'
import '../assets/_safariLess_14/symbols/item06_anim00/bottle.atlas'

import item07_anim00Json_i from '../assets/_safariLess_14/symbols/item07_anim00/cup.json'
import '../assets/_safariLess_14/symbols/item07_anim00/cup.png'
import '../assets/_safariLess_14/symbols/item07_anim00/cup.atlas'

import item08_anim00Json_i from '../assets/_safariLess_14/symbols/item08_anim00/j.json'
import '../assets/_safariLess_14/symbols/item08_anim00/j.png'
import '../assets/_safariLess_14/symbols/item08_anim00/j.atlas'

import item09_anim00Json_i from '../assets/_safariLess_14/symbols/item09_anim00/a.json'
import '../assets/_safariLess_14/symbols/item09_anim00/a.png'
import '../assets/_safariLess_14/symbols/item09_anim00/a.atlas'

import item10_anim00Json_i from '../assets/_safariLess_14/symbols/item10_anim00/k.json'
import '../assets/_safariLess_14/symbols/item10_anim00/k.png'
import '../assets/_safariLess_14/symbols/item10_anim00/k.atlas'

import item11_anim00Json_i from '../assets/_safariLess_14/symbols/item11_anim00/q.json'
import '../assets/_safariLess_14/symbols/item11_anim00/q.png'
import '../assets/_safariLess_14/symbols/item11_anim00/q.atlas'


import winJson_i from '../assets/_safariLess_14/symbols/win/win_frame.json'
import '../assets/_safariLess_14/symbols/win/win_frame.png'
import '../assets/_safariLess_14/symbols/win/win_frame.atlas'



//import symbolsJson from '../assets/symbols/symbolsJson.json'
//import '../assets/symbols/symbolsJson.webp'

//import symbolsJson_i from '../assets/_safariLess_14/symbols/symbolsJson.json'
//import '../assets/_safariLess_14/symbols/symbolsJson.png'




export const SLOT_MACHINE_CONSTRUCTOR = {
    initState: 'playScreen',
    destroyState: null,
    constructor: SlotMachine,

    assetsToLoad: {
        'playScreen': {
            'textures': {
                'item00_anim02_fr00.png': item00_anim02_fr00,
                'item01_anim02_fr00.png': item01_anim02_fr00,
                'item02_anim02_fr00.png': item02_anim02_fr00,
                'item03_anim02_fr00.png': item03_anim02_fr00,
                'item03_anim05_fr00.png': item03_anim05_fr00,
                'item03_anim12_fr00.png': item03_anim12_fr00,
                'item03_anim15_fr00.png': item03_anim15_fr00,
                'item04_anim02_fr00.png': item04_anim02_fr00,
                'item05_anim02_fr00.png': item05_anim02_fr00,
                'item06_anim02_fr00.png': item06_anim02_fr00,
                'item07_anim02_fr00.png': item07_anim02_fr00,
                'item08_anim02_fr00.png': item08_anim02_fr00,
                'item09_anim02_fr00.png': item09_anim02_fr00,
                'item10_anim02_fr00.png': item10_anim02_fr00,
                'item11_anim02_fr00.png': item11_anim02_fr00,

                'item00_anim01_fr00.png': item00_anim01_fr00,
                'item01_anim01_fr00.png': item01_anim01_fr00,
                'item02_anim01_fr00.png': item02_anim01_fr00,
                'item03_anim01_fr00.png': item03_anim01_fr00,
                'item03_anim11_fr00.png': item03_anim11_fr00,
                'item04_anim01_fr00.png': item04_anim01_fr00,
                'item05_anim01_fr00.png': item05_anim01_fr00,
                'item06_anim01_fr00.png': item06_anim01_fr00,
                'item07_anim01_fr00.png': item07_anim01_fr00,
                'item08_anim01_fr00.png': item08_anim01_fr00,
                'item09_anim01_fr00.png': item09_anim01_fr00,
                'item10_anim01_fr00.png': item10_anim01_fr00,
                'item11_anim01_fr00.png': item11_anim01_fr00,
                //symbolsJson,
            },
             'spineAnimations': {
                 'item04_00_Json': item04_anim00Json_i,
                 'item05_00_Json': item05_anim00Json_i,
                 'item06_00_Json': item06_anim00Json_i,
                 'item07_00_Json': item07_anim00Json_i,
                 'item08_00_Json': item08_anim00Json_i,
                 'item09_00_Json': item09_anim00Json_i,
                 'item10_00_Json': item10_anim00Json_i,
                 'item11_00_Json': item11_anim00Json_i,
                 'winJson': winJson_i,
            },
            'dragonAnimations': {
                'item03_anim00': {
                    'item03_anim00_ske_json': item03_anim00_ske_i,
                    'item03_anim00_tex_json': item03_anim00_tex_i,
                    'item03_anim00_tex': item03_anim00_png_i,
                },
                'item02_anim00': {
                    'item02_anim00_ske_json': item02_anim00_ske_i,
                    'item02_anim00_tex_json': item02_anim00_tex_i,
                    'item02_anim00_tex': item02_anim00_png_i,
                },
                'item01_anim00': {
                    'item01_anim00_ske_json': item01_anim00_ske_i,
                    'item01_anim00_tex_json': item01_anim00_tex_i,
                    'item01_anim00_tex': item01_anim00_png_i,
                },
            }
        }
    },

    assetsToLoad_iOS: {
        'playScreen': {
            'textures': {
                'item00_anim02_fr00.png': item00_anim02_fr00,
                'item01_anim02_fr00.png': item01_anim02_fr00,
                'item02_anim02_fr00.png': item02_anim02_fr00,

                'item03_anim02_fr00.png': item03_anim02_fr00,
                'item03_anim05_fr00.png': item03_anim05_fr00,


                'item04_anim02_fr00.png': item04_anim02_fr00,
                'item05_anim02_fr00.png': item05_anim02_fr00,
                'item06_anim02_fr00.png': item06_anim02_fr00,
                'item07_anim02_fr00.png': item07_anim02_fr00,
                'item08_anim02_fr00.png': item08_anim02_fr00,
                'item09_anim02_fr00.png': item09_anim02_fr00,
                'item10_anim02_fr00.png': item10_anim02_fr00,

                'item00_anim01_fr00.png': item00_anim01_fr00,
                'item01_anim01_fr00.png': item01_anim01_fr00,
                'item02_anim01_fr00.png': item02_anim01_fr00,
                'item03_anim01_fr00.png': item03_anim01_fr00,
                'item04_anim01_fr00.png': item04_anim01_fr00,
                'item05_anim01_fr00.png': item05_anim01_fr00,
                'item06_anim01_fr00.png': item06_anim01_fr00,
                'item07_anim01_fr00.png': item07_anim01_fr00,
                'item08_anim01_fr00.png': item08_anim01_fr00,
                'item09_anim01_fr00.png': item09_anim01_fr00,
                'item10_anim01_fr00.png': item10_anim01_fr00,
                //'symbolsJson': symbolsJson_i,
            },
            'spineAnimations': {
                'item04_00_Json': item04_anim00Json_i,
                'item05_00_Json': item05_anim00Json_i,
                'item06_00_Json': item06_anim00Json_i,
                'item07_00_Json': item07_anim00Json_i,
                'item08_00_Json': item08_anim00Json_i,
                'item09_00_Json': item09_anim00Json_i,
                'item10_00_Json': item10_anim00Json_i,
                'item11_00_Json': item11_anim00Json_i,
                'winJson': winJson_i,
            },
            'dragonAnimations': {
                'item02_anim00': {
                    'item02_anim00_ske_json': item02_anim00_ske_i,
                    'item02_anim00_tex_json': item02_anim00_tex_i,
                    'item02_anim00_tex': item02_anim00_png_i,
                },
                'item03_anim00': {
                    'item03_anim00_ske_json': item03_anim00_ske_i,
                    'item03_anim00_tex_json': item03_anim00_tex_i,
                    'item03_anim00_tex': item03_anim00_png_i,
                },
                'item01_anim00': {
                    'item01_anim00_ske_json': item01_anim00_ske_i,
                    'item01_anim00_tex_json': item01_anim00_tex_i,
                    'item01_anim00_tex': item01_anim00_png_i,
                },
            }
        }
    },

    config: {
        'SlotColumnActions': SlotColumnActionsCustom,
        'SlotItem': SlotItemCustom,
        'spritesCache': spritesCache,
        'config': mergeDeep(SLOT_MACHINE_CONFIG, {
            symbol: {
                width: 252,
                height: 222,
            },
            frameTop: 0,
            frameBottom: 2,

            verticalDivider: 10,
            ANIMATION_SLOTS: {
                playStates: {
                    scattersOffset: 40,
                },
            },

        }),
        'SYMBOLS': [
            {
                //name: 'lepricon', // 0
                frames: 0,
                animationSpeed: 0.65,
                //modeWinAnimation: '3',
                notBlur: false,

                modeWinAnimation: '3',
                //spineWinAnimationName: 'indeec',
                //winAnimationTime: 3000,
                winAnimationTime: 1500,
            },
            {
                //name: 'sphere', // 1
                frames: 0,
                animationSpeed: 0.65,
                //modeWinAnimation: '3',
                notBlur: false,


                dragonArmatureName: 'sun_arm',

                modeNormalAnimation: 'dragonNormal',
                normalAnimationName: 'sun_idle',

                modeAppearAnimation: 'dragonAppear',
                nameAppearAnimation: 'sun_show',

                modeWinAnimation: 'dragonWin',
                winAnimationName: 'sun_basic',



    //sun_basic — выигрыш



                //modeWinAnimation: 'spineWin',
                //modeWinAnimation: '3',
                //modeWinAnimation: 'dragonWin',
                //winAnimationName: 'scatter_on',

                //spineWinAnimationName: 'colt',
                //winAnimationTime: 3000,
                winAnimationTime: 1500,
            },
            {
                // 2 book
                frames: 0,
                notBlur: false,

                dragonArmatureName: 'Armature02',

                modeAppearAnimation: 'dragonAppear',
                nameAppearAnimation: 'scatter_stop',

                modeWinAnimation: 'dragonWin',
                winAnimationName: 'scatter_on',

                winAnimationTime: 3000,

                //modeWinAnimation: 'spineWin',
                //spineWinAnimationName: 'knife',
                //winAnimationTime: 3000,

            },
            {
                // 3 boy
                frames: 0,
                notBlur: false,


                dragonArmatureName: 'wild_arm',

                modeWinAnimation: 'dragonWin',
                winAnimationName: 'wild_normal_small',
                winAnimationNameDouble: 'wild_normal_big',
                winAnimationNameDoubleFree: 'wild_freespin_big',
                winAnimationNameFree: 'wild_freespin_small',

                winAnimationTime: 3000,

                //modeWinAnimation: 'spineWin',
                //spineWinAnimationName: 'shotgun',
                //winAnimationTime: 3000,
                //winAnimationTime: 1500,
            },
            {
                // name: 'tomahawk', // 4
                frames: 0,
                animationSpeed: 0.65,
                //modeWinAnimation: '3',
                notBlur: false,

                modeWinAnimation: 'spineWin',
                spineWinAnimationName: 'skroll',
                //winAnimationTime: 1500,
                winAnimationTime: 1166,
            },
            {
                name: 'bottle', // 5
                frames: 0,
                animationSpeed: 0.65,
                //modeWinAnimation: '3',
                notBlur: false,

                modeWinAnimation: 'spineWin',
                spineWinAnimationName: 'pendullum',
                //winAnimationTime: 1500,
                winAnimationTime: 1166,
            },
            {
                name: 'A', // 6
                frames: 0,
                animationSpeed: 0.65,
                //modeWinAnimation: '3',
                notBlur: false,

                modeWinAnimation: 'spineWin',
                spineWinAnimationName: 'bottle',
                //winAnimationTime: 1500,
                winAnimationTime: 1166,
            },
            {
                name: 'K', // 7
                frames: 0,
                animationSpeed: 0.65,
                //modeWinAnimation: '3',
                notBlur: false,

                modeWinAnimation: 'spineWin',
                spineWinAnimationName: 'cup',
                //winAnimationTime: 1500,
                winAnimationTime: 1166,
            },
            {
                name: 'spears', // 8
                frames: 0,
                animationSpeed: 0.65,
                //modeWinAnimation: '3',
                notBlur: false,

                modeWinAnimation: 'spineWin',
                spineWinAnimationName: 'animation',
                winAnimationTime: 1166,
                //winAnimationTime: 1500,
            },
            {
                name: 'J', // 9
                frames: 0,
                animationSpeed: 0.65,
                //modeWinAnimation: '3',
                notBlur: false,


                modeWinAnimation: 'spineWin',
                spineWinAnimationName: 'animation',
                //winAnimationTime: 3000,
                //winAnimationTime: 1500,
                winAnimationTime: 1200,
            },
            {
                name: '10', // 10
                frames: 0,
                animationSpeed: 0.65,
                //modeWinAnimation: '3',
                notBlur: false,

                modeWinAnimation: 'spineWin',
                spineWinAnimationName: 'animation',
                winAnimationTime: 1166,
            },

            {
                name: '11', // 10
                frames: 0,
                animationSpeed: 0.65,
                //modeWinAnimation: '3',
                notBlur: false,

                modeWinAnimation: 'spineWin',
                spineWinAnimationName: 'animation',
                winAnimationTime: 1166,
            },
        ],
    }
}