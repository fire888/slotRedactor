import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import './stylesheets/App.css';
import { AppButton } from "./components/AppButton";
import { RedactDragonResources } from './containers/RedactDragonResources'
import { ListDragonResources } from './containers/ListDragonResourses'
import { ViewItem } from './containers/ViewItem'


function App() {
      const [ isOpen, changeOpen ] = useState(true)
      const [ currentTab, changeMainTab ] = useState('items-list')
      const [ currentDataItem, setDataItemToCurrent ] = useState(null)

      const setToViewItem = data => {
          setDataItemToCurrent(data)
          changeMainTab('view-item')
      }
    

      return (
            <div
                className={`App ${!isOpen && 'closed'}`}>

                <AppButton
                    val = {isOpen ? 'close' : 'open'}
                    classNameCustom = 'closeOpenApp'
                    callBackClick = {() => changeOpen(!isOpen)}/>


                <div
                    className='ui-content'
                    style={{'display':  isOpen ? 'block' : 'none'}}>

                    <AppButton
                        val="items-list"
                        classNameCustom = {currentTab === 'items-list' && "current"}
                        callBackClick = {() => changeMainTab('items-list')}/>

                    {currentTab==="add-item" && 
                        <RedactDragonResources
                            mode="add-item"
                            changeMainTab={changeMainTab}/>}

                    {currentTab==="view-item" &&
                    <ViewItem
                        mode="view-item"
                        currentDataItem={currentDataItem}
                        changeMainTab={changeMainTab}/>}


                    {currentTab==="edit-item" &&
                        <RedactDragonResources
                            mode="edit-item"
                            dataItem={currentDataItem}
                            changeMainTab={changeMainTab}/>}


                    {currentTab==="items-list" &&
                        <ListDragonResources
                            callBackClick={setToViewItem}
                            changeMainTab={changeMainTab}/>}
                </div>

            </div>
      );
}



ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)
