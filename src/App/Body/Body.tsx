import { Component } from 'react';
import AssignmentDetail from './AssignmentDetail/AssignmentDetail';
import AssignmentList from './AssignmentList/AssignmentList';
import Statistics from './Statistics/Statistics';
import { EventSubscription } from 'fbemitter';
import AppDispatcher from '../../flux/AppDispatcher';
import { ActionKind } from '../../flux/AppConstants';
import UiStore, { Page, PageSwitch, UiState } from '../../flux/UiStore';
import './Body.css';

export type BodyProps = {
    style: object,
    page: Page,
};

const newBodyComponentStyle = {
    left: '100%',
    width: '0',
};

class Body extends Component {
    uiStoreListener: EventSubscription;

    constructor(props: {}) {
        super(props);

        this.uiStoreListener = UiStore.addListener(() => {
            const uiState = UiStore.getState();

            if (uiState.switchPageTo !== null) {
                const pageSwitch = new PageSwitch(uiState.currentPage, uiState.switchPageTo);
                this.switchPage(uiState, pageSwitch);
            }
        });
    }

    render() {
        return (
            <div className="Body">
                <AssignmentList page={new Page(0, 'AssignmentList')} style={{}} />
                <AssignmentDetail bodyProps={
                    {
                        page: new Page(1, 'AssignmentDetail'),
                        style: newBodyComponentStyle,
                    }
                } subjectName="教科名" teacherName="AA BB 教員" />
                <Statistics page={new Page(2, 'Notification')} style={newBodyComponentStyle} />
                <Statistics page={new Page(3, 'Statistics')} style={newBodyComponentStyle} />
                <Statistics page={new Page(4, 'Settings')} style={newBodyComponentStyle} />
                <Statistics page={new Page(5, 'Report')} style={newBodyComponentStyle} />
            </div>
        );
    }

    componentWillUnmount() {
        this.uiStoreListener.remove();
    }

    switchPage(uiState: UiState, pageSwitch: PageSwitch) {
        let currentComponent = document.getElementById(pageSwitch.from.toId());
        let newComponent = document.getElementById(pageSwitch.to.toId());

        if (currentComponent === null || newComponent === null) {
            console.error('Page Switch Error: Page element not found.');
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

        // update currentPage
        AppDispatcher.dispatch({
            type: ActionKind.PageSwitch as ActionKind.PageSwitch,
            data: {
                currentPage: pageSwitch.to,
                switchPageTo: null,
                hasAssignmentsUpdated: false,
                assignments: uiState.assignments,
            },
        });
    }
}

export default Body;
