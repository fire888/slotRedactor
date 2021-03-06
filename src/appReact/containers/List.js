import React from 'react'
import { connect } from 'react-redux'
import ItemPreView from "./ItemPreView";
import ItemViewCreate from "./ItemViewCreate";



const mapStateToProps = state => {
    return ({
        currentGameTag: state.app.currentGameTag,
        currentList: state.app.currentList,
        currentItemId: state.app.currentItemId,
        authRole: state.app.authRole,
    })
}



function List (props) {
    return (
        <div
            className='ui-content'>
                <h3>{props.currentGameTag}</h3>
                {props.currentList && props.currentList.map(item =>
                    <ItemPreView
                        isOpened = {props.currentItemId === item.id}
                        key = {item.id}
                        item = {item}
                        callBackClick = {id => {
                            props.dispatch('SET_CURRENT_ITEM_ID', { id })
                        }}
                    />)}
                {props.authRole === 'animator' && props.currentGameTag && <ItemViewCreate />}
        </div>
    )
}



export default connect(mapStateToProps)(List)