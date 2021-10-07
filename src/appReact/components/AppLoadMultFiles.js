import React, { useState, useEffect, useCallback } from 'react'
import '../stylesheets/AppLoadFile.css'


export function AppLoadMultFiles (props) {
    const [filesNames, setFilesNames] = useState(false)

    const onDragEnter = useCallback((e) => {
        e.stopPropagation()
        e.preventDefault()
        return false;
    }, []);

    const onDragOver = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        return false;
    }, []);

    const onDragLeave = useCallback((e) => {
        e.stopPropagation()
        e.preventDefault()
        return false;
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        console.log('Files dropped: ', files.length)
        const names = []
        for (let i = 0; i < files.length; i++) {
            names.push(files[i].name)
        }
        setFilesNames(names)
        props.callback(files)
        return false
    }, []);

    useEffect(() => {
        window.addEventListener('mouseup', onDragLeave)
        window.addEventListener('dragenter', onDragEnter)
        window.addEventListener('dragover', onDragOver)
        window.addEventListener('drop', onDrop)
        return () => {
            window.removeEventListener('mouseup', onDragLeave)
            window.removeEventListener('dragenter', onDragEnter)
            window.removeEventListener('dragover', onDragOver)
            window.removeEventListener('drop', onDrop)
        };
    }, [onDragEnter, onDragLeave, onDragOver, onDrop])

    return (
        <div>
            <div
                className="bg-green height-min-30"
                onDragLeave={onDragLeave} >
                {filesNames 
                    ? filesNames.map(item => <div key={item}>{item}</div>)
                    : 'Drop files to upload'}
            </div>
        </div>
    )
}
