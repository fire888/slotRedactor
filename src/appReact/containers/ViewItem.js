import React from 'react'
import { AppButton } from "../components/AppButton";

const startAnimate = (animationName, count) => window.emitter.emit('startAnimate', { animationName, count })

const createArrFromObj = obj => {
    const arr = []
    for (let key in obj) {
        arr.push({ ...obj[key] })
    }
    return arr
}




const setToView = data => setTimeout(() => {
    window.emitter.emit('dragonBonesFiles', data)
})




export function ViewItem(props) {
    setToView(props.currentDataItem)

    const userRole = localStorage.getItem('userRole')

    return (
        <div className='content-tab'>
            <hr />
            <div className="content-stroke">
                <div>{props.currentDataItem.name}</div>
                <div>id: {props.currentDataItem.id}</div>
            </div>
            <hr />
            {/* <div>arm: {props.currentDataItem.armatureName}</div> */}
            <div>
                {props.currentDataItem.animationsNames && 
                props.currentDataItem.animationsNames.length &&
                props.currentDataItem.animationsNames.map((n, i) => n &&
                    <div 
                        className="content-stroke"
                        key={i}>
                        <span>{n}</span>
                        <div className="contrnt-right">
                            <AppButton
                                val='once'
                                callBackClick={()=>startAnimate(n, 1)} />
                            <AppButton
                                val='repeat'
                                callBackClick={()=>startAnimate(n, 1000)} />
                            <AppButton
                                val='stop'
                                callBackClick={()=>startAnimate(n, false)} />

                        </div>       
                    </div>    
                )}
            </div>
            <div>
                {createArrFromObj(props.currentDataItem.files).map((n, i) =>
                    <div 
                        key={i}
                        className='content-stroke' >
                        <span>{n.name}</span>
                        <span>    
                            <a className='AppButton' href={`/${n.path}/${n.name}`} download={n.name}>download</a>
                        </span>
                    </div>)}
            </div>
            <hr />
            { userRole && userRole === 'animator' &&
                <div className="row-space-between">
                    <AppButton
                        val='edit'
                        classNameCustom=''
                        callBackClick={() => props.changeMainTab('edit-item')}
                    />
                </div>}
        </div>
    )
}


