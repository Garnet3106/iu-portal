// import logo from './logo.svg';

import React from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import BottomMenu from './BottomMenu/BottomMenu';
import './App.css';

const clickComponentIconEvent = new CustomEvent('clickComponentIconEvent');
const eventElem = document.createElement('div');

class App extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <Header />
                <Body props={{elem: eventElem}}/>
                <BottomMenu props={this.onClickComponentIcon} />
            </div>
        );
    }

    onClickComponentIcon(e: any) {
        console.log("click");
        console.log(this);
        eventElem.dispatchEvent(clickComponentIconEvent);
    }
}

export default App;
