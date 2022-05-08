import { Component, RefCallback } from 'react';
import './HorizontalSwitcher.css';

export type HorizontalSwitcherProps = {
    title: string,
    description: string,
    onClickLeftButton: () => void,
    onClickRightButton: () => void,
};

class HorizontalSwitcher extends Component<HorizontalSwitcherProps> {
    constructor(props: HorizontalSwitcherProps) {
        super(props);
    }

    render() {
        return (
            <div className="HorizontalSwitcher">
                <div className="switcher-top">
                    <div className="switcher-button" />
                    <div className="switcher-title">
                        {this.props.title}
                    </div>
                    <div className="switcher-button" />
                </div>
                <div className="switcher-description">
                    {this.props.description}
                </div>
            </div>
        );
    }
}

export default HorizontalSwitcher;
