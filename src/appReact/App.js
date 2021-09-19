import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import './stylesheets/App.css';
import { ContainerMainTabs } from "./containers/ContainerMainTabs";
import { ContainerAuth } from './containers/ContainerAuth'


function App() {
        const [ isAuth, toggleAuth ] = useState(false)

        return (
            <div className="App">
                {isAuth 
                    ? <ContainerMainTabs /> 
                    : <ContainerAuth callback={() => toggleAuth(true)}/>}
            </div>    
        )
}


ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)
