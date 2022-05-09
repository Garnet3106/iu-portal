import React from 'react';
import AppDispatcher from '../../flux/AppDispatcher';
import { ActionKind } from "../../flux/AppConstants";
import UiStore, { PageSwitch, Page } from '../../flux/UiStore';
import './BottomMenu.css';

type BottomMenuProps = {
    defaultPageName: string,
};

type BottomMenuState = {
    
};

class BottomMenu extends React.Component<BottomMenuProps, BottomMenuState> {
    constructor(props: BottomMenuProps) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <div className="BottomMenu">
                <div className="menu">
                    <div className="menu-item" id="BottomMenuItem_AssignmentList_0" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_Notification_2" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_Statistics_3" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_Settings_4" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_Report_5" onClick={this.onMenuItemClick.bind(this)} />
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
        const id_tokens = target.id.split('_');

        const nextPageName = id_tokens[1];
        const nextPageIndex = parseInt(id_tokens[2]);
        const nextPage = new Page(nextPageIndex, nextPageName);

        const uiState = UiStore.getState();

        if (uiState.currentPage !== nextPage) {
            // todo: create dispatchPageSwitch()
            AppDispatcher.dispatch({
                type: ActionKind.PageSwitch as ActionKind.PageSwitch,
                data: {
                    currentPage: uiState.currentPage,
                    switchPageTo: nextPage,
                    hasAssignmentsUpdated: false,
                    assignments: uiState.assignments,
                },
            });
        }

        AppDispatcher.dispatch({
            type: ActionKind.PageSwitch as ActionKind.PageSwitch,
            data: {
                currentPage: uiState.currentPage,
                switchPageTo: null,
                hasAssignmentsUpdated: true,
                assignments: [
                    {
                        id: 'aid',
                        subjectName: '科目',
                        deadline: '今週金曜日まで',
                    }
                ],
            },
        });
    }

    static getPageSwitch(from: Page, to: Page): PageSwitch | null {
        if (from === to) {
            return null;
        }

        return new PageSwitch(from, to);
    }
}

export default BottomMenu;
