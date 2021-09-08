import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import './App.css';
import { AppButton } from "./components/AppButton";
import { LoadDragonResources } from './containers/LoadDragonResources'



function App() {
      const [ isOpen, changeOpen ] = useState(true)

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


                    <LoadDragonResources />
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
