import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { AppButton } from '../components/AppButton'
import '../stylesheets/ContainerZoomScroll.css'
import { transformScene } from '../../appPixi/AppPixi'



const mapStateToProps = state => {
    return ({
        isShowLoadingSpinner: state.app.isShowLoadingSpinner
    })
}



function ContainerZoomScroll (props) {

    const [isMouseDown, toggleMouseDown] = useState(false)
    const [startX, changeStartX] = useState(0)
    const [startY, changeStartY] = useState(0)
    const [difX, changeDifX ] = useState(0)
    const [difY, changeDifY ] = useState(0)
    const [accumX, changeAccumX] = useState(0)
    const [accumY, changeAccumY] = useState(0)
    const [accumScale, changeScale] = useState(1)
    const [isFlipX, changeFlipX] = useState(false)
    const [isFlipY, changeFlipY] = useState(false)

    const resetValues = () => {
        changeAccumX(0)
        changeAccumY(0)
        changeScale(1)
        changeFlipX(false)
        changeFlipY(false)
        transformScene(0, 0, 1, false)
    }



    useEffect(() => {
        const onMouseWheel = e => {
            changeScale(Math.max(accumScale - (e.deltaY / 1000), 0.01))
            transformScene(accumX, accumY, accumScale, isFlipX, isFlipY)
        }
        document.addEventListener('mousewheel', onMouseWheel)


        const onMouseDown = e => {
            changeStartX(e.clientX)
            changeStartY(e.clientY)
            toggleMouseDown(true)
        }
        document.addEventListener('mousedown', onMouseDown)


        const onMouseUp = () => {
            changeAccumX(accumX + difX)
            changeAccumY(accumY + difY)
            changeDifX(0)
            changeDifY(0)
            toggleMouseDown(false)
        }
        document.addEventListener('mouseup', onMouseUp)


        const onMouseMove = e => {
            if (!isMouseDown) {
                return;
            }

            e.preventDefault()
            e.stopPropagation()

            changeDifX(e.clientX - startX)
            changeDifY(e.clientY - startY)
            transformScene(accumX + difX, accumY + difY, accumScale, isFlipX, isFlipY)
        }
        document.addEventListener('mousemove', onMouseMove)


        return () => {
            document.removeEventListener('mousewheel', onMouseWheel)
            document.removeEventListener('mousedown', onMouseDown)
            document.removeEventListener('mouseup', onMouseUp)
            document.removeEventListener('mousemove', onMouseMove)
        }
    }, )


    return (
        <div className='container-zoom-scroll'>
            <span className="num-widget">x: { accumX + difX }</span>
            <span className="num-widget">y: { accumY + difY }</span>
            <span className="num-widget">zoom: {(accumScale * 100).toFixed(0)}%</span>
            <AppButton
                key='flipX'
                val='-x'
                classNameCustom={isFlipX ? 'current' : null}
                callBackClick = {() => {
                    changeFlipX(!isFlipX)
                    transformScene(accumX, accumY, accumScale, !isFlipX, isFlipY)
                }}
            />
            <AppButton
                key='flipY'
                val='-y'
                classNameCustom={isFlipY ? 'current' : null}
                callBackClick = {() => {
                    changeFlipY(!isFlipY)
                    transformScene(accumX, accumY, accumScale, isFlipX, !isFlipY)
                }}
            />
            <AppButton
                key='zoom'
                val='reset'
                classNameCustom='zoom'
                callBackClick={resetValues}
            />
        </div>)
}

export default connect(mapStateToProps)(ContainerZoomScroll)

