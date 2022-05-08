// import logo from './logo.svg';

import React from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import BottomMenu from './BottomMenu/BottomMenu';
import './App.css';

const eventElem = document.createElement('div');

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Header />
                <Body props={{elem: eventElem}}/>
                <BottomMenu defaultPageName="AssignmentList" />
            </div>
        );
    }
}

export default App;
