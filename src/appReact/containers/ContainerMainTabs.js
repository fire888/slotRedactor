import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { RedactDragonResources } from './RedactDragonResources'
import { ListDragonResources } from './ListDragonResourses'
import { ViewItem } from './ViewItem'


export function ContainerMainTabs() {
    const [ currentTab, changeMainTab ] = useState('items-list')
    const [ currentDataItem, setDataItemToCurrent ] = useState(null)


    const setToViewItem = data => {
        setDataItemToCurrent(data)
        changeMainTab('view-item')
    }
    

    return (
        <div
            className='ui-content'>

            <AppButton
                val="items-list"
                classNameCustom = {currentTab === 'items-list' && "current"}
                callBackClick = {() => changeMainTab('items-list')}/>


            {/** TABS  *******************************/} 

            {currentTab==="items-list" &&
                <ListDragonResources
                    callBackClick={setToViewItem}
                    changeMainTab={changeMainTab}/>}

            {currentTab==="view-item" &&
                <ViewItem
                    mode="view-item"
                    currentDataItem={currentDataItem}
                    changeMainTab={changeMainTab}/>}

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

