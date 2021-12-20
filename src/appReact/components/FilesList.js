import React, { useState, useEffect } from 'react'
import { AppButton } from './AppButton'
import { HOST } from '../../globals'



export function FilesList (props) {
    const [isOpenedFilesList, toggleOpenedFilesList] = useState(false)

    useEffect(() => {
        toggleOpenedFilesList(isOpenedFilesList)
        return () => {
            toggleOpenedFilesList(false)
        }
    })


    return  (
    <div>

        <div className='offset-top' />
        <hr />


        {<AppButton
            val='files'
            classNameCustom={isOpenedFilesList && 'current'}
            callBackClick={() => {
                toggleOpenedFilesList(!isOpenedFilesList)
            }}
        />}

        {isOpenedFilesList && createArrFromObj(props.fileNames).map((n, i) =>
            <div
                key={i}
                className='content-stroke'>
                <span>{n.key}:</span>
                <span>{n.name}</span>
                <span>
                    <a
                        className='AppButton'
                        target="_blank"
                        href={`${HOST}/${n.path}/${n.name}`}
                        rel="noopener noreferrer"
                        download>
                        download
                    </a>
                </span>
            </div>
        )}
    </div>)
}



const createArrFromObj = obj => {
    const arr = []
    for (let key in obj) {
        arr.push({ key: key, ...obj[key] })
    }
    return arr
}