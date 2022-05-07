import React from 'react';
import './BottomMenu.css';

class BottomMenu extends React.Component {
    props: any;

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <div className="BottomMenu">
                <div className="menu">
                    <div className="menu-item" onClick={this.props.props} />
                    <div className="menu-item" />
                    <div className="menu-item" />
                    <div className="menu-item" />
                    <div className="menu-item" />
                </div>
                <div className="menu-bar-area">
                    <div className="menu-bar" />
                </div>
            </div>
        );
    }
}

export default BottomMenu;
