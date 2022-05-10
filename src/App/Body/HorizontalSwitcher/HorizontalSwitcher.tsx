import React, { Component, RefCallback } from 'react';
import './HorizontalSwitcher.css';

export type HorizontalSwitcherProps = {
    title: string,
    description: string,
    onClickLeftButton: (event: React.MouseEvent) => void,
    onClickRightButton: (event: React.MouseEvent) => void,
};

class HorizontalSwitcher extends Component<HorizontalSwitcherProps> {
    constructor(props: HorizontalSwitcherProps) {
        super(props);
    }

    render() {
        return (
            <div className="HorizontalSwitcher body-subcomponent">
                <div className="switcher-top">
                    <div className="switcher-button" onClick={this.props.onClickLeftButton} />
                    <div className="switcher-title">
                        {this.props.title}
                    </div>
                    <div className="switcher-button" onClick={this.props.onClickRightButton} />
                </div>
                <div className="switcher-description">
                    {this.props.description}
                </div>
            </div>
        );
    }
}

export default HorizontalSwitcher;
