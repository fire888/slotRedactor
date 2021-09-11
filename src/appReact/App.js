import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import './App.css';
import { AppButton } from "./components/AppButton";
import { RedactDragonResources } from './containers/RedactDragonResources'
import { ListDragonResources } from './containers/ListDragonResourses'
import { sendResponse } from '../toServerApi/requests'


function App() {
      const [ isOpen, changeOpen ] = useState(true)
      const [ currentTab, changeCurrentTab ] = useState(false)
      const [ dataRedactItem, setRedactItem ] = useState(null) 

      const prepareToDedactItem = data => {
          setRedactItem(data)
          changeCurrentTab('edit-item')
      }  
    

      return (
            <div
                className={`App ${!isOpen && 'closed'}`}>

                <AppButton
                    val = {isOpen ? 'close' : 'open'}
                    classNameCustom = 'closeOpenApp'
                    callBackClick = {() => changeOpen(!isOpen)}/>


                <div
                    className='ui-content '
                    style={{'display':  isOpen ? 'block' : 'none'}}>

                    <AppButton
                        val = "add item"
                        classNameCustom = {currentTab === 'add-item' && "current"}
                        callBackClick = {() => {
                            changeCurrentTab('add-item')}
                        }/>

                    <AppButton
                        val = "items-list"
                        classNameCustom = {currentTab === 'items-list' && "current"}
                        callBackClick = {() => changeCurrentTab('items-list')}/>

                    {currentTab === "add-item" && 
                        <RedactDragonResources mode="add-item"/>}
                    
                    {currentTab === "items-list" && 
                        <ListDragonResources callBackClick={prepareToDedactItem}/>}
                    
                    {currentTab === "edit-item" && 
                        <RedactDragonResources mode="edit-item" dataItem={dataRedactItem} />}
                </div>

            </div>
      );
}



ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
