import React, { useState, useEffect, useCallback } from 'react'
import '../stylesheets/AppLoadFile.css'
import { AppButton } from './AppButton'


import { uploadFile } from "../../toServerApi/requests";




export function AppLoadMultFiles ({ children }) {
    const [isVisible, setIsVisible] = useState(false);

    const onDragEnter = useCallback((e) => {
        setIsVisible(true);
        e.stopPropagation();
        e.preventDefault();
        return false;
    }, []);

    const onDragOver = useCallback((e) => {
        console.log('!---!')
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
        console.log('!!!!')
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
            {isVisible &&
                <div
                    className="bg-green"
                    onDragLeave={onDragLeave} >
                    Drop files to Upload
                </div>}
        </div>
    )
}


/*
https://stackoverflow.com/questions/68416563/make-file-uploader-preview-handle-multiple-files
https://codepen.io/pauljohnknight/pen/JjNNyzO
 */

/*
// hidden on the form, but has drag & drop files assigned to it
var fileUploader = document.getElementById("standard-upload-files");

var dropZone = document.getElementById("drop-zone");
var showSelectedImages = document.getElementById("show-selected-images");

dropZone.addEventListener("click", (e) => {
//assigns the dropzone to the hidden input element so when you click 'select files' it brings up a file picker window
  fileUploader.click();
});

fileUploader.addEventListener("change", (e) => {
  if (fileUploader.files.length) {
    // this function is further down but declared here and shows a thumbnail of the image
    updateThumbnail(dropZone, fileUploader.files[0]);
  }
});

dropZone.addEventListener('dragover', e => {
    e.preventDefault()
})

dropZone.addEventListener('dragend', e => {
    e.preventDefault()
})

// When the files are dropped in the 'drop-zone'

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();

  // assign dropped files to the hidden input element
  if (e.dataTransfer.files.length) {
    fileUploader.files = e.dataTransfer.files;
  }
  // function is declared here but written further down
  updateThumbnail(dropZone, e.dataTransfer.files[0]);
});

// updateThumbnail function that needs to be able to handle multiple files
function updateThumbnail(dropZone, file) {
  var thumbnailElement = document.querySelector(".drop-zone__thumb");

  if (!thumbnailElement) {
    thumbnailElement = document.createElement("img");
    thumbnailElement.classList.add("drop-zone__thumb");

    // append to showSelectedImages div
    showSelectedImages.appendChild(thumbnailElement);
  }

  if (file.type.startsWith("image/")) {
    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      thumbnailElement.src = reader.result;
    };
  } else {
    thumbnailElement.src = null;
  }

} // end of 'updateThumbnail' function
 */
