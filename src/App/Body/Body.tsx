import { Component } from 'react';
import AssignmentDetail from './AssignmentDetail/AssignmentDetail';
import AssignmentList from './AssignmentList/AssignmentList';
import Statistics from './Statistics/Statistics';
import UiStore from '../../flux/UiStore';
import './Body.css';

export type BodyProps = {
    style: object,
    pageName: string,
};

const newBodyComponentStyle = {
    left: '100%',
    width: '0',
};

// page sliding procedure
UiStore.addListener(() => {
    let pageSwitch = UiStore.getState().pageSwitch;

    if (pageSwitch === null) {
        return;
    }

    let currentComponent = document.getElementById('page_' + pageSwitch.from);
    let newComponent = document.getElementById('page_' + pageSwitch.to);

    if (currentComponent === null || newComponent === null) {
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
});

class Body extends Component {
    render() {
        return (
            <div className="Body">
                <AssignmentList pageName="AssignmentList" style={{}} />
                <AssignmentDetail bodyProps={
                    {
                        pageName: 'AssignmentDetail',
                        style: newBodyComponentStyle,
                    }
                } subjectName="教科名" teacherName="AA BB 教員" />
                <Statistics pageName="Notification" style={newBodyComponentStyle} />
                <Statistics pageName="Statistics" style={newBodyComponentStyle} />
                <Statistics pageName="Settings" style={newBodyComponentStyle} />
                <Statistics pageName="Report" style={newBodyComponentStyle} />
            </div>
        );
    }
}

export default Body;
