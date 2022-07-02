import { Component } from 'react';
import Login from './Login/Login';
import AssignmentPreview from './AssignmentPreview/AssignmentPreview';
import AssignmentList from './AssignmentList/AssignmentList';
import NotificationList from './NotificationList/NotificationList';
import Statistics from './Statistics/Statistics';
import Settings from './Settings/Settings';
import SettingValueList from './SettingValueList/SettingValueList';
import Report from './Report/Report';
import { EventSubscription } from 'fbemitter';
import AppDispatcher from '../../flux/AppDispatcher';
import UiStore from '../../flux/UiStore';
import { UiActionCreators } from '../../flux/UiActionCreators';
import Page, { pageList, PageSwitch } from '../../page';
import './Body.css';

export type BodyProps = {
    style: object,
    page: Page,
};

const newBodyComponentStyle = {
    left: '100%',
    width: '0',
};

class Body extends Component<{}> {
    uiStoreListener: EventSubscription;
    static _detectDrag: boolean = false;
    static _touchStartX: number = 0;

    constructor(props: {}) {
        super(props);
        this.uiStoreListener = UiStore.addListener(this.onUpdateUiState.bind(this));
    }

    render() {
        return (
            <div className="Body" onTouchStart={this.onMouseDown.bind(this)} onTouchEnd={this.onMouseUp.bind(this)} onTouchMove={this.onMouseMove.bind(this)}>
                <Login page={pageList['Login']} style={{}} />
                <AssignmentList page={pageList['AssignmentList']} style={newBodyComponentStyle} />
                <AssignmentPreview bodyProps={
                    {
                        page: pageList['AssignmentPreview'],
                        style: newBodyComponentStyle,
                    }
                } />
                <NotificationList page={pageList['NotificationList']} style={newBodyComponentStyle} />
                <Statistics page={pageList['Statistics']} style={newBodyComponentStyle} />
                <Settings page={pageList['Settings']} style={newBodyComponentStyle} />
                <SettingValueList page={pageList['SettingValueList']} style={newBodyComponentStyle} />
                <Report page={pageList['Report']} style={newBodyComponentStyle} />
            </div>
        );
    }

    onMouseDown(event: React.TouchEvent) {
        Body._detectDrag = true;
        Body._touchStartX = event.touches[0].clientX;
    }

    onMouseUp() {
        Body._detectDrag = false;
    }

    onMouseMove(event: React.TouchEvent) {
        if (Body._detectDrag) {
            const diff = event.touches[0].clientX - Body._touchStartX;
            const diffPivot = 30;

            if (diff > diffPivot) {
                this.switchPageByDrag(false);
            } else if (diff * -1 > diffPivot) {
                this.switchPageByDrag(true);
            }
        }
    }

    switchPageByDrag(isToRight: boolean) {
        Body._detectDrag = false;

        const uiState = UiStore.getState();
        const currentPageIndex = uiState.currentPage.index;
        const pages = Object.entries(pageList);
        const slicedPages = isToRight ? pages.slice(currentPageIndex + 1) : pages.slice(0, currentPageIndex).reverse();
        let targetPage: Page | null = null;

        slicedPages.some((value: [string, Page]) => {
            const page = value[1];

            if (page.isBodyComponent) {
                targetPage = page;
                return true;
            }

            return false;
        });

        AppDispatcher.dispatch(UiActionCreators.updateSwitchTargetPage(targetPage));
    }

    onUpdateUiState() {
        const uiState = UiStore.getState();

        if (uiState.switchPageTo !== undefined && uiState.switchPageTo !== null) {
            const pageSwitch = new PageSwitch(uiState.currentPage, uiState.switchPageTo);
            this.switchPage(pageSwitch);
        }
    }

    switchPage(pageSwitch: PageSwitch) {
        let currentComponent = document.getElementById(pageSwitch.from.name);
        let newComponent = document.getElementById(pageSwitch.to.name);

        if (currentComponent === null || newComponent === null) {
            console.error('Page Switch Error: Page element is not found.');
            return;
        }

        if (pageSwitch.isToRight()) {
            // Return a new component to left.
            newComponent.style.transition = 'none';
            newComponent.style.left = '100%';
            newComponent.style.width = '0';

            // Prevent from conflicting transition settings.
            setTimeout(() => {
                currentComponent!.style.left = '-100%';
                newComponent!.style.transition = 'left var(--page-switch-transition-duration) var(--basic-transition-cubic-bezier), width var(--page-switch-transition-duration) var(--basic-transition-cubic-bezier)';
                newComponent!.style.left = '0';
                newComponent!.style.width = '100%';
            }, 0);
        } else {
            // Return a new component to right.
            newComponent.style.transition = 'none';
            newComponent.style.left = '0';
            newComponent.style.width = '0';

            // Prevent from conflicting transition settings.
            setTimeout(() => {
                currentComponent!.style.left = '100%';
                currentComponent!.style.width = '0';
                newComponent!.style.transition = 'left var(--page-switch-transition-duration) var(--basic-transition-cubic-bezier), width var(--page-switch-transition-duration) var(--basic-transition-cubic-bezier)';
                newComponent!.style.left = '0';
                newComponent!.style.width = '100%';
            }, 0);
        }

        AppDispatcher.dispatch(UiActionCreators.updateCurrentPage(pageSwitch.to));
    }
}

export default Body;
