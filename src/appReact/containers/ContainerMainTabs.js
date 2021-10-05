import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { RedactDragonResources } from './RedactDragonResources'
import { ListDragonResources } from './ListDragonResourses'
//import { ListSets } from './ListSets'
import { List } from './List'
//import { ViewItem } from './ViewItem'



export function ContainerMainTabs() {
    const [ currentTab, changeMainTab ] = useState('items-list')

    

    return (
        <div
            className='ui-content'>

            {/*<AppButton*/}
            {/*    val="sets-list"*/}
            {/*    classNameCustom = {currentTab === 'sets-list' && "current"}*/}
            {/*    callBackClick = {() => changeMainTab('sets-list')}/>*/}


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
                <List changeMainTab={() => {
                    changeMainTab(null)
                    setTimeout(() => changeMainTab('items-list'))}
                }/>}


        </div>
    )
}

