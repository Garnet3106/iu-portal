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

    constructor(props: {}) {
        super(props);
        this.uiStoreListener = UiStore.addListener(this.onUpdateUiState.bind(this));
    }

    render() {
        return (
            <div className="Body">
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

    onUpdateUiState() {
        const uiState = UiStore.getState();

        if (uiState.switchPageTo !== null) {
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
            currentComponent.style.left = '-100%';
            newComponent.style.left = '0';
            newComponent.style.width = '100%';
        } else {
            currentComponent.style.left = '100%';
            currentComponent.style.width = '0';
            newComponent.style.left = '0';
            newComponent.style.width = '100%';
        }

        AppDispatcher.dispatch(UiActionCreators.updateCurrentPage(pageSwitch.to));
    }
}

export default Body;
