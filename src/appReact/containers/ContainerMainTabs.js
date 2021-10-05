import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
//import { ListSets } from './ListSets'
import { List } from './List'

import { ALL_LIST } from "../constants/constants";




export function ContainerMainTabs() {
    const [ currentTab, changeMainTab ] = useState(null)
    const [ tabData, changeTabContent ] = useState(null)

    const arrTabs = [ALL_LIST, ALL_LIST]

    
    const showTab = name => {
        const tab = arrTabs.filter(item => name === item.tabName)[0]
        changeTabContent(tab)
        changeMainTab(name)
    }
    
    
    const tabButtons = arrTabs.map(item => 
        <AppButton 
            val={item.tabName}
            classNameCustom = {currentTab === item.tabName && "current"}
            callBackClick = {() => showTab(item.tabName)}/>)

    return (
        <div
            className='ui-content'>
                {tabButtons}
                {currentTab && 
                    <List 
                        reguest={tabData.reguest}
                        requestParams={tabData.requestParams}
                        changeMainTab={() => {
                            changeMainTab(null)
                            setTimeout(() => changeMainTab(currentTab))}
                    }/>}
                
            {/*<AppButton*/}
            {/*    val="sets-list"*/}
            {/*    classNameCustom = {currentTab === 'sets-list' && "current"}*/}
            {/*    callBackClick = {() => changeMainTab('sets-list')}/>*/}


            {/* <AppButton
                val="all-items"
                classNameCustom = {currentTab === 'all-items' && "current"}
                callBackClick = {() => changeMainTab('all-items')}/> */}


            {/** TABS  *******************************/}

            {/*{currentTab==="sets-list" &&*/}
            {/*<div>*/}
            {/*    <List*/}
            {/*        type="sets-list"*/}
            {/*        callBackClick={setToViewItem}*/}
            {/*        changeMainTab={changeMainTab}/>*/}
            {/*</div>}*/}


            {/* {currentTab==="all-items" &&
                <List changeMainTab={() => {
                    changeMainTab(null)
                    setTimeout(() => changeMainTab('all-items'))}
                }/>} */}

        </div>
    )
}

