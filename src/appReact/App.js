import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import './stylesheets/App.css';

import { Provider } from 'react-redux'
import { store } from './store/createStore'
import { connect } from 'react-redux'


import ContainerMainTabs from "./containers/ContainerMainTabs";
import ContainerAuth from './containers/ContainerAuth'
import ContainerGamesNames from './containers/ContainerGamesNames'

const mapStateToProps = state => {
    return ({
        authRole: state.app.authRole
    })
}

const App = connect(mapStateToProps)(function (props) {
        return (
            <div>
                <div className="App">
                    <ContainerAuth />
                    {props.authRole && <ContainerMainTabs />}
                </div>
                {props.authRole && <ContainerGamesNames />}
            </div>    
        )
})


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
        <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
