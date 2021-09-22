import React, { useState, useEffect } from 'react'
import '../stylesheets/AppLoadFile.css'
import { AppButton } from './AppButton'


import { uploadFile } from "../../toServerApi/requests";


export function AppLoadFile (props) {
    
    const [currentFile, setCurrentFile] = useState(null)
    const [isShowUploadButton, toggleUploadButton] = useState(false)
    const [message, changeMessage] = useState(null)


    /**
     * create timeout to reset messages after time  
     * remove timeout of reset messages if component unmounted 
     */
    useEffect(() => {
        let timeout = null
        if (message !== null) {
            timeout = setTimeout(() => changeMessage(null), 3000)
        } 
        return () => { 
            timeout && clearTimeout(timeout)
        }
    })


    return (
        <div className={`AppLoadFile`}>
                {props.val}
                <br/>

                <div className="drop_zone">Drop files here</div>
                <output className='list'></output>




                <input 
                    type="file" 
                    name="file" 
                    onChange={e => { 
                        setCurrentFile(e.target.files[0])
                        toggleUploadButton(true)
                    }} />
                {isShowUploadButton && <AppButton
                    val="upload"
                    callBackClick={() => {
                        toggleUploadButton(false)
                        uploadFile(
                            'upload-file',
                            { type: props.type, file: currentFile, id: props.itemId }, 
                            resp=>{
                                const mess = resp.mess[0] === 'loaded'
                                    ? `loaded ${resp.mess[1]}`
                                    : 'denied'
                                changeMessage(mess)      
                            }
                        )
                        
                    }} />
                }
                {message}
        </div>
    )
}

/*
https://stackoverflow.com/questions/38689741/how-to-attach-drag-drop-event-listeners-to-a-react-component

const DragBox = styled.div(({ isVisible }: { isVisible }) =>
    isVisible
        ? `
        position: fixed;
        display: flex;
        border: 15px dashed white;
        width: 100%;
        height: 100%;
        z-index: 2000;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        flex: 1;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 30px;
        font-weight: 600;
        color: white;
        letter-spacing: 1px;
        margin: auto;
`
        : 'display: none;'
);

const DropZone = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);

    const onDragEnter = useCallback((e) => {
        setIsVisible(true);
        e.stopPropagation();
        e.preventDefault();
        return false;
    }, []);
    const onDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, []);
    const onDragLeave = useCallback((e) => {
        setIsVisible(false);
        e.stopPropagation();
        e.preventDefault();
        return false;
    }, []);
    const onDrop = useCallback((e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        console.log('Files dropped: ', files);
        // Upload files
        setIsVisible(false);
        return false;
    }, []);

    useEffect(() => {
        window.addEventListener('mouseup', onDragLeave);
        window.addEventListener('dragenter', onDragEnter);
        window.addEventListener('dragover', onDragOver);
        window.addEventListener('drop', onDrop);
        return () => {
            window.removeEventListener('mouseup', onDragLeave);
            window.removeEventListener('dragenter', onDragEnter);
            window.removeEventListener('dragover', onDragOver);
            window.removeEventListener('drop', onDrop);
        };
    }, [onDragEnter, onDragLeave, onDragOver, onDrop]);

    return (
        <div>
            {children}
            <DragBox
                className="bg-secondary"
                isVisible={isVisible}
                onDragLeave={onDragLeave}
            >
                Drop files to Upload
            </DragBox>
        </div>
    );
};
 */


/**
 <div id="drop_zone">Drop files here</div>
 <output id="list"></output>

 <script>
 function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  }

 function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

 // Setup the dnd listeners.
 var dropZone = document.getElementById('drop_zone');
 dropZone.addEventListener('dragover', handleDragOver, false);
 dropZone.addEventListener('drop', handleFileSelect, false);
 </script>
 */

