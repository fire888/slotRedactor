import React, { useState, useEffect, useCallback, useRef } from 'react'
import '../stylesheets/AppLoadFile.css'


export function AppLoadMultFiles (props) {
    const [filesNames, setFilesNames] = useState(false)
    const ref = useRef(null)

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

        if (e.target === ref.current || isDescendant(ref.current, e.target)) {
            const files = e.dataTransfer.files
            console.log('Files dropped: ', files.length)
            const names = []
            for (let i = 0; i < files.length; i++) {
                names.push(files[i].name)
            }
            setFilesNames(names)
            props.callback(props.inputKey, files)
        }

        return false;
    }, []);

    useEffect(() => {
        setFilesNames(false)
        window.addEventListener('mouseup', onDragLeave)
        window.addEventListener('dragenter', onDragEnter)
        window.addEventListener('dragover', onDragOver)
        window.addEventListener('drop', onDrop)
        return () => {
            setFilesNames(false)
            window.removeEventListener('mouseup', onDragLeave)
            window.removeEventListener('dragenter', onDragEnter)
            window.removeEventListener('dragover', onDragOver)
            window.removeEventListener('drop', onDrop)
        };
    }, [onDragEnter, onDragLeave, onDragOver, onDrop, filesNames])

    return (
        <div>
            <div
                ref={ref}
                className="bg-green height-min-30"
                onDragLeave={onDragLeave} >
                {filesNames
                    ? filesNames.map(item => <div key={item}>{item}</div>)
                    : props.val}
            </div>
        </div>
    )
}


function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}
