// import logo from './logo.svg';

import React from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import BottomMenu from './BottomMenu/BottomMenu';
import './App.css';

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Header />
                <Body />
                <BottomMenu defaultPageName="AssignmentList" />
            </div>
        );
    }
}

export default App;
