import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { AppLoadFile } from "../components/AppLoadFile";


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


