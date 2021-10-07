import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { List } from './List'

import { ALL_LIST } from "../constants/constants";


const LISTS = [
    {
        tabName: "spells",
        request: 'get-list',
        requestParams: { tag: 'spells' },
    },
    {
        tabName: "eagles",
        request: 'get-list',
        requestParams: { tag: 'eagles' },
    },
    {
        tabName: "cleo",
        request: '',
        requestParams: { tag: 'cleo' },
    },
    {
        tabName: "all",
        request: 'get-list',
        requestParams: {},
    },
]


export function ContainerMainTabs() {
<<<<<<< HEAD
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
=======
    const [ currentTabIndex, changeTabIndex ] = useState(0)


    const arrButtons = LISTS.map((item, i) =>
        <AppButton
            key = {i}
            val = {LISTS[i].tabName}
            classNameCustom = {currentTabIndex === i && "current"}
            callBackClick = {() => changeTabIndex(i)}/>)

>>>>>>> 1cbf2c032af0d1d5f55b66b2cba027174a6f3e65

    return (
        <div
            className='ui-content'>
<<<<<<< HEAD
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

=======
                {arrButtons}
                {LISTS[currentTabIndex] &&
                    <List
                        key = {currentTabIndex}
                        request = {LISTS[currentTabIndex]['request']}
                        requestParams = {LISTS[currentTabIndex]['requestParams']}
                        changeMainTab = {() => {
                            const s = currentTabIndex
                            changeTabIndex(null)
                            changeTabIndex(s)}
                    }/>}
>>>>>>> 1cbf2c032af0d1d5f55b66b2cba027174a6f3e65
        </div>
    )
}

