import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
//import { ListSets } from './ListSets'
import { List } from './List'


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
        request: 'get-list',
        requestParams: { tag: 'cleo' },
    },
    {
        tabName: "all",
        request: 'get-list',
        requestParams: {},
    },
]


export function ContainerMainTabs() {
    const [ currentTabIndex, changeTabIndex ] = useState(0)


    return (
        <div
            className='ui-content'>

            {LISTS.map(item => {
                let listTabIndex
                for (let i = 0; i < LISTS.length; i++) {
                    LISTS[i].tabName === item.tabName && (listTabIndex = i)
                }
                return (
                    <AppButton
                        key={listTabIndex}
                        val={item.tabName}
                        classNameCustom={currentTabIndex === listTabIndex && "current"}
                        callBackClick={() => changeTabIndex(listTabIndex)}/>
                )}
            )}


            {/** TABS  *******************************/}


            {LISTS[currentTabIndex] &&
                <List
                    request = {LISTS[currentTabIndex]['request']}
                    requestParams = {LISTS[currentTabIndex]['requestParams']}
                    changeMainTab = {() => {
                        const savedTab = currentTabIndex
                        //changeTabIndex(null)
                        changeTabIndex(savedTab)}
                }/>}

        </div>
    )
}

