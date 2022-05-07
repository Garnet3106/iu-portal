import React from 'react';
import AppDispatcher from '../../../flux/AppDispatcher';
import { ActionKind } from "../../../flux/AppConstants";
import { ComponentSwitch } from '../../../flux/UiStore';
import './BottomMenu.css';

class BottomMenu extends React.Component<any, { latestComponent: number }> {
    constructor(props: any) {
        super(props);
        this.state = {latestComponent: 0};
    }

    render() {
        return (
            <div className="BottomMenu">
                <div className="menu">
                    <div className="menu-item" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" onClick={this.onMenuItemClick.bind(this)} />
                </div>
                <div className="menu-bar-area">
                    <div className="menu-bar" />
                </div>
            </div>
        );
    }

    onMenuItemClick(event: React.MouseEvent<HTMLInputElement>) {
        if (event.target === null) {
            return;
        }

        let target = event.target as HTMLElement;
        let index = ([].slice.call(target.parentNode?.children) as HTMLElement[]).indexOf(target);

        let componentSwitch = BottomMenu.getComponentSwitch(this.state.latestComponent, index);

        if (this.state.latestComponent !== index) {
            this.setState({
                latestComponent: index,
            });
        }

        AppDispatcher.dispatch({
            type: ActionKind.ComponentSwitch as ActionKind.ComponentSwitch,
            data: {
                componentSwitch: componentSwitch,
            },
        });
    }

    static getComponentSwitch(from: number, to: number): ComponentSwitch | null {
        if (from === to) {
            return null;
        }

        return new ComponentSwitch(from, to);
    }
}

export default BottomMenu;
