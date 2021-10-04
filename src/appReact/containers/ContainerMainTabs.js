import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { RedactDragonResources } from './RedactDragonResources'
import { ListDragonResources } from './ListDragonResourses'
//import { ListSets } from './ListSets'
import { List } from './List'
//import { ViewItem } from './ViewItem'



export function ContainerMainTabs() {
    const [ currentTab, changeMainTab ] = useState('sets-list')
    const [ currentDataItem, setDataItemToCurrent ] = useState(null)


    const setToViewItem = (type, data) => {
        if (type === 'sets-list') {
            console.log('111111')
        }
        if (type === 'items-list') {
            setDataItemToCurrent(data)
            changeMainTab('view-item')
        }
    }
    

    return (
        <div
            className='ui-content'>

            <AppButton
                val="sets-list"
                classNameCustom = {currentTab === 'sets-list' && "current"}
                callBackClick = {() => changeMainTab('sets-list')}/>


            <AppButton
                val="all-items"
                classNameCustom = {currentTab === 'items-list' && "current"}
                callBackClick = {() => changeMainTab('items-list')}/>


            {/** TABS  *******************************/}

            {/*{currentTab==="sets-list" &&*/}
            {/*<div>*/}
            {/*    <List*/}
            {/*        type="sets-list"*/}
            {/*        callBackClick={setToViewItem}*/}
            {/*        changeMainTab={changeMainTab}/>*/}
            {/*</div>}*/}


            {currentTab==="items-list" &&
                <List />}

            {/* {currentTab==="view-item" &&
                <ViewItem
                    mode="view-item"
                    currentDataItem={currentDataItem}
                    changeMainTab={changeMainTab}/>} */}

            {currentTab==="add-item" && 
                <RedactDragonResources
                    mode="add-item"
                    dataItem={null}
                    changeMainTab={changeMainTab}/>}

            {currentTab==="edit-item" &&
                <RedactDragonResources
                    mode="edit-item"
                    dataItem={currentDataItem}
                    changeMainTab={changeMainTab}/>}
        </div>
    )
}

