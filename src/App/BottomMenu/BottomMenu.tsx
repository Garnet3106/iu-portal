import React from 'react';
import AppDispatcher from '../../flux/AppDispatcher';
import { ActionKind } from "../../flux/AppConstants";
import UiStore, { PageSwitch } from '../../flux/UiStore';
import './BottomMenu.css';

type BottomMenuProps = {
    defaultPageName: string,
};

type BottomMenuState = {
    latestPageName: string,
};

class BottomMenu extends React.Component<BottomMenuProps, BottomMenuState> {
    constructor(props: BottomMenuProps) {
        super(props);

        this.state = {
            latestPageName: this.props.defaultPageName,
        };
    }

    render() {
        return (
            <div className="BottomMenu">
                <div className="menu">
                    <div className="menu-item" id="BottomMenuItem_AssignmentList" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_Notification" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_Statistics" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_Settings" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_Report" onClick={this.onMenuItemClick.bind(this)} />
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
        const nextPageName = target.id.split('_')[1];
        const pageSwitch = BottomMenu.getPageSwitch(this.state.latestPageName, nextPageName);

        if (this.state.latestPageName !== nextPageName) {
            this.setState({
                latestPageName: nextPageName,
            });
        }

        const uiState = UiStore.getState();

        // todo: create dispatchPageSwitch()
        AppDispatcher.dispatch({
            type: ActionKind.PageSwitch as ActionKind.PageSwitch,
            data: {
                pageSwitch: pageSwitch,
                hasAssignmentsUpdated: false,
                assignments: uiState.assignments,
            },
        });
        AppDispatcher.dispatch({
            type: ActionKind.PageSwitch as ActionKind.PageSwitch,
            data: {
                pageSwitch: null,
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

    static getPageSwitch(from: string, to: string): PageSwitch | null {
        if (from === to) {
            return null;
        }

        return new PageSwitch(from, to);
    }
}

export default BottomMenu;
