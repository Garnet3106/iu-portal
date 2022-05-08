import React from 'react';
import AppDispatcher from '../../flux/AppDispatcher';
import { ActionKind } from "../../flux/AppConstants";
import UiStore, { ComponentSwitch } from '../../flux/UiStore';
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

        const target = event.target as HTMLElement;
        const index = ([].slice.call(target.parentNode?.children) as HTMLElement[]).indexOf(target);
        const componentSwitch = BottomMenu.getComponentSwitch(this.state.latestComponent, index);

        if (this.state.latestComponent !== index) {
            this.setState({
                latestComponent: index,
            });
        }

        const uiState = UiStore.getState();

        // todo: create dispatchComponentSwitch()
        AppDispatcher.dispatch({
            type: ActionKind.ComponentSwitch as ActionKind.ComponentSwitch,
            data: {
                componentSwitch: componentSwitch,
                hasAssignmentsUpdated: false,
                assignments: uiState.assignments,
            },
        });
        AppDispatcher.dispatch({
            type: ActionKind.ComponentSwitch as ActionKind.ComponentSwitch,
            data: {
                componentSwitch: null,
                hasAssignmentsUpdated: true,
                assignments: [
                    {
                        subjectName: '科目',
                        deadline: '今週金曜日まで',
                    }
                ],
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
