import React, { Component } from 'react';
import './HorizontalSwitcher.css';

export type HorizontalSwitcherProps = {
    title: string,
    description: string | null,
    onClickLeftButton: (event: React.MouseEvent) => void,
    onClickRightButton: (event: React.MouseEvent) => void,
};

class HorizontalSwitcher extends Component<HorizontalSwitcherProps> {
    constructor(props: HorizontalSwitcherProps) {
        super(props);
    }

    render() {
        const description = (
            <div className="switcher-description">
                {this.props.description}
            </div>
        );

        return (
            <div className="HorizontalSwitcher body-subcomponent">
                <div className="switcher-top">
                    <div className="switcher-button" onClick={this.props.onClickLeftButton} />
                    <div className="switcher-title">
                        {this.props.title}
                    </div>
                    <div className="switcher-button" onClick={this.props.onClickRightButton} />
                </div>
                {this.props.description !== null ? description : (<></>)}
            </div>
        );
    }
}

export default HorizontalSwitcher;
