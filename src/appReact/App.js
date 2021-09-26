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
                <ContainerAuth callback={toggleAuth}/>
                {isAuth && <ContainerMainTabs />}
            </div>    
        )
}


ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)
