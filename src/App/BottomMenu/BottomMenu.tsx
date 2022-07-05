import React from 'react';
import AppDispatcher from '../../flux/AppDispatcher';
import UiStore from '../../flux/UiStore';
import { UiActionCreators } from '../../flux/UiActionCreators';
import Page, { pageList, PageSwitch } from '../../page';
import { ActionKind } from '../../flux/AppConstants';
import './BottomMenu.css';

type BottomMenuProps = {
    defaultPageName: string,
};

class BottomMenu extends React.Component<BottomMenuProps> {
    bottomMenu: React.RefObject<HTMLDivElement>;
    bottomMenuBar: React.RefObject<HTMLDivElement>;

    constructor(props: BottomMenuProps) {
        super(props);
        this.bottomMenu = React.createRef();
        this.bottomMenuBar = React.createRef();

        UiStore.addListener(() => {
            const uiState = UiStore.getState();

            switch (uiState.latestKind) {
                case ActionKind.Signin: {
                    const currentBottomMenu = this.bottomMenu.current;

                    if (currentBottomMenu !== null) {
                        currentBottomMenu.style.top = '0';
                    }
                } break;

                case ActionKind.Signout: {
                    const currentBottomMenu = this.bottomMenu.current;

                    if (currentBottomMenu !== null) {
                        currentBottomMenu.style.top = 'var(--bottom-menu-height)';
                    }
                } break;

                case ActionKind.SwitchPage: {
                    const pageName = uiState.currentPage.name;
                    const bottomItemId = `BottomMenuItem_${pageName}`;
                    const bottomItemElem = document.getElementById(bottomItemId);

                    if (bottomItemElem !== null) {
                        const bottomItemOffset = bottomItemElem.getBoundingClientRect().x;
                        const currentMenuBar = this.bottomMenuBar.current;

                        if (currentMenuBar !== null) {
                            currentMenuBar.style.left = `${bottomItemOffset}px`;
                        }
                    }
                } break;
            }
        });
    }

    render() {
        let items: JSX.Element[] = [];

        Object.entries(pageList).forEach((value: [string, Page]) => {
            const page = value[1];

            if (page.isBodyComponent && page.name !== 'Login') {
                const id = `BottomMenuItem_${page.name}`;
                const newItem = (<div className="bottom-menu-content-item" id={id} style={{
                    backgroundImage: `url(/lib/bottom_menu/${page.name}.svg)`,
                }} onClick={this.onMenuItemClick.bind(this)} key={id} />);
                items.push(newItem);
            }
        });

        return (
            <div className="BottomMenu">
                <div className="bottom-menu" ref={this.bottomMenu}>
                    <div className="bottom-menu-content">
                        {items}
                    </div>
                    <div className="bottom-menu-content-bar-area">
                        <div className="bottom-menu-content-bar" ref={this.bottomMenuBar} />
                    </div>
                </div>
            </div>
        );
    }

    onMenuItemClick(event: React.MouseEvent<HTMLInputElement>) {
        const uiState = UiStore.getState();

        if (event.target === null || !uiState.hasSignedIn) {
            return;
        }

        const target = event.target as HTMLElement;
        const nextPageName = target.id.split('_')[1];

        if (!(nextPageName in pageList)) {
            console.error(`Page Switch Error: Page name \`${nextPageName}\` is not found.`);
            return;
        }

        const nextPage = pageList[nextPageName];
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
