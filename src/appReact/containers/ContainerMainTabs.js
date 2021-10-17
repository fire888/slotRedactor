import React, { useState } from 'react'
import { AppButton } from "../components/AppButton";
import { List } from './List'

import { ALL_LIST } from "../constants/constants";


const LISTS = [
    {
        tabName: "spells",
        request: 'get-list',
        requestParams: { gameTag: 'spells' },
    },
    {
        tabName: "eagles",
        request: 'get-list',
        requestParams: { gameTag: 'eagles' },
    },
    {
        tabName: "cleo",
        request: 'get-list',
        requestParams: { gameTag: 'cleo' },
    },
    {
        tabName: "all",
        request: 'get-list',
        requestParams: {},
    },
    {
        tabName: "none",
        request: 'get-list',
        requestParams: { gameTag: 'none' },
    },
]


export function ContainerMainTabs() {
    const [ currentTabIndex, changeTabIndex ] = useState(0)


    const arrButtons = LISTS.map((item, i) =>
        <AppButton
            key = {i}
            val = {LISTS[i].tabName}
            classNameCustom = {currentTabIndex === i && "current"}
            callBackClick = {() => changeTabIndex(i)}/>)


    return (
        <div
            className='ui-content'>
                {arrButtons}
                {LISTS[currentTabIndex] &&
                    <List
                        key = {currentTabIndex}
                        tabName={LISTS[currentTabIndex]['tabName']}
                        request = {LISTS[currentTabIndex]['request']}
                        requestParams = {LISTS[currentTabIndex]['requestParams']}
                        changeMainTab = {() => {
                            const s = currentTabIndex
                            changeTabIndex(null)
                            changeTabIndex(s)}
                    }/>}
        </div>
    )
}

