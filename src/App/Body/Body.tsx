import { Component } from 'react';
import Login from './Login/Login';
import AssignmentPreview from './AssignmentPreview/AssignmentPreview';
import AssignmentList from './AssignmentList/AssignmentList';
import Statistics from './Statistics/Statistics';
import { EventSubscription } from 'fbemitter';
import AppDispatcher from '../../flux/AppDispatcher';
import UiStore, { Page, PageSwitch } from '../../flux/UiStore';
import { UiActionCreators } from '../../flux/UiActionCreators';
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
                <Login page={new Page(0, 'Login')} style={{}} />
                <AssignmentList page={new Page(1, 'AssignmentList')} style={newBodyComponentStyle} />
                <AssignmentPreview bodyProps={
                    {
                        page: new Page(2, 'AssignmentPreview'),
                        style: newBodyComponentStyle,
                    }
                } />
                <Statistics page={new Page(3, 'Notification')} style={newBodyComponentStyle} />
                <Statistics page={new Page(4, 'Statistics')} style={newBodyComponentStyle} />
                <Statistics page={new Page(5, 'Settings')} style={newBodyComponentStyle} />
                <Statistics page={new Page(6, 'Report')} style={newBodyComponentStyle} />
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
        let currentComponent = document.getElementById(pageSwitch.from.toId());
        let newComponent = document.getElementById(pageSwitch.to.toId());

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
