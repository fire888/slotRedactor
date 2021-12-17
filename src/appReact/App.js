import React from 'react'
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import './stylesheets/App.css';

import { Provider } from 'react-redux'
import { store } from './store/createStore'
import { connect } from 'react-redux'


import List from "./containers/List";
import ContainerAuth from './containers/ContainerAuth'
import ContainerGamesNames from './containers/ContainerGamesNames'
import ItemView from "./containers/ItemView";
import ItemViewResources from "./containers/ItemViewResources";
import { GifSpinner } from './components/GifLoading'

const mapStateToProps = state => {
    return ({
        authRole: state.app.authRole,
        currentItemId: state.app.currentItemId,
        currentGameTag: state.app.currentGameTag,
        isShowLoadingSpinner: state.app.isShowLoadingSpinner,
    })
}

const App = connect(mapStateToProps)(function (props) {
        return (
            <div>
                {props.isShowLoadingSpinner && <GifSpinner />}
                <div className="App">
                    {props.authRole && props.currentItemId && <ItemView />}
                    {props.authRole && props.currentItemId && <ItemViewResources />}
                </div>
                <div className="main-panel-left">
                    <ContainerAuth />
                    <div className="choose-item-sector">
                        {props.authRole && <ContainerGamesNames />}
                        {props.authRole && <List />}
                    </div>
                </div>
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
