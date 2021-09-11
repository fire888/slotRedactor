import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { AppLoadFile } from "../components/AppLoadFile";
import {AppInput} from "../components/AppInput";

import {sendResponse} from "../../toServerApi/requests";


const arrKeys = [ 'skeletonJson', 'textureJson', 'imageDr' ]
const fileData = {}


export function LoadDragonResources() {

    const [isShowStartButton, showStartButton] = useState(false)


    const checkAllLoaded = v => {
        fileData[v.type] = v.file
        let isAllFiles = true
        for (let i = 0; i < arrKeys.length; i++) {
            if (!fileData[arrKeys[i]]) isAllFiles = false
        }
        isAllFiles && showStartButton(true)
    }


    return (
        <div>

                <AppInput
                    val="name"
                    type={"item_name"}
                    callBackClick = {e => {
                        console.log(e)
                        const data = {
                            'type-exec': 'dragonBones',
                            'type-view': 'slot-item',
                            name: e.val,
                            animationsNames: [e.val, e.val],
                            armatureName: 'Arm' + e.val,
                            files: [
                                { 'type-file': 'dragon-ske', path: '././', name: 'aaaa.json', file: '--' },
                                { 'type-file': 'dragon-tex', path: '././', name: 'bbb.json', file: '--' },
                                { 'type-file': 'dragon-img', path: '././', name: 'bbb.png', file: '--' }
                            ]
                        }




                        sendResponse('add-item', data)
                    }}/>

                <AppLoadFile
                    type='skeletonJson'
                    val='skeletonJson'
                    callBackClick = {checkAllLoaded} />


                <AppLoadFile
                    type='textureJson'
                    val='textureJson'
                    callBackClick = {checkAllLoaded}/>


                <AppLoadFile
                    type='imageDr'
                    val='image'
                    callBackClick = {checkAllLoaded} />


                {/*isShowStartButton &&*/ <AppButton
                    val = 'start'
                    classNameCustom = ''
                    callBackClick = {() =>
                        window.emitter && window.emitter.emit('dragonBonesFiles', fileData)
                    }/>}

            </div>
    );
}


