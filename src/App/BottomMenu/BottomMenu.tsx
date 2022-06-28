import React from 'react';
import AppDispatcher from '../../flux/AppDispatcher';
import UiStore, { PageSwitch, Page } from '../../flux/UiStore';
import { UiActionCreators } from '../../flux/UiActionCreators';
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
                    <div className="menu-item" id="BottomMenuItem_AssignmentList_1" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_NotificationList_3" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_Statistics_4" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_Settings_5" onClick={this.onMenuItemClick.bind(this)} />
                    <div className="menu-item" id="BottomMenuItem_Report_7" onClick={this.onMenuItemClick.bind(this)} />
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
        const switchPageTo = uiState.currentPage === nextPage ? null : nextPage;

        // CurrentPage will be updated to the next page at Body.switchPage().
        AppDispatcher.dispatch(UiActionCreators.updateSwitchTargetPage(switchPageTo));
    }

    static getPageSwitch(from: Page, to: Page): PageSwitch | null {
        if (from === to) {
            return null;
        }

        return new PageSwitch(from, to);
    }
}

export default BottomMenu;
