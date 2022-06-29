import React from 'react';
import AppDispatcher from '../../flux/AppDispatcher';
import UiStore from '../../flux/UiStore';
import { UiActionCreators } from '../../flux/UiActionCreators';
import Page, { pageList, PageSwitch } from '../../page';
import './BottomMenu.css';

type BottomMenuProps = {
    defaultPageName: string,
};

class BottomMenu extends React.Component<BottomMenuProps> {
    constructor(props: BottomMenuProps) {
        super(props);
    }

    render() {
        let items: JSX.Element[] = [];

        Object.entries(pageList).forEach((value: [string, Page]) => {
            const page = value[1];

            if (page.isBodyComponent && page.name !== 'Login') {
                const id = `BottomMenuItem_${page.name}`;
                const newItem = (<div className="menu-item" id={id} onClick={this.onMenuItemClick.bind(this)} key={id} />);
                items.push(newItem);
            }
        });

        return (
            <div className="BottomMenu">
                <div className="menu">
                    {items}
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

        if (!(nextPageName in pageList)) {
            console.error(`Page Switch Error: Page name \`${nextPageName}\` is not found.`);
            return;
        }

        const nextPage = pageList[nextPageName];
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
