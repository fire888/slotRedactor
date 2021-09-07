import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { AppLoadFile } from "../components/AppLoadFile";


const fileData = {}


export function LoadDragonResources() {

    const isStart = fileData.textureJson && fileData.skeletonJson && fileData.image

    return (
        <div>
                <AppLoadFile
                    type='textureJson'
                    val='textureJson'
                    callBackClick = {v => {
                        fileData[v.type] = v.file
                    }}/>

                <AppLoadFile
                    type='skeletonJson'
                    val='skeletonJson'
                    callBackClick = {v => {
                        fileData[v.type] = v.file
                    }}/>

                <AppLoadFile
                    type='image'
                    val='image'
                    callBackClick = {v => {
                        fileData[v.type] = v.file
                    }}/>

                <AppButton
                    val = 'start'
                    classNameCustom = ''
                    callBackClick = {() =>
                        window.emitter && window.emitter.emit('dragonBonesFiles', fileData)
                    }/>

            </div>
    );
}


