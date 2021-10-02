import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { showDragonSpr, playAnimation } from '../../appPixi/AppPixi'

const startAnimate = (animationName, count) => playAnimation({ animationName, count })

const createArrFromObj = obj => {
    const arr = []
    for (let key in obj) {
        arr.push({ ...obj[key] })
    }
    return arr
}



export function ViewItem(props) {
    const [animations, setAnimations] = useState([])
    setTimeout(() => showDragonSpr(props.currentDataItem, setAnimations))



    const userRole = localStorage.getItem('userRole')

    return (
        <div className='content-tab'>
            <hr />
            <div className="content-stroke">
                <div>{props.currentDataItem.name}</div>
                <div>id: {props.currentDataItem.id}</div>
            </div>
            <hr />
            <div>
                {animations.map((n, i) => n &&
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
            {userRole && userRole === 'animator' &&
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
                </div>}
            <hr />
            {userRole && userRole === 'animator' &&
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


