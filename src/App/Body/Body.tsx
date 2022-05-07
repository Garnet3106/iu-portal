import { Component } from 'react';
import AssignmentList from './AssignmentList/AssignmentList';
import Statistics from '../Statistics/Statistics';
import UiStore from '../../flux/UiStore';
import './Body.css';

export type BodyProps = {
    style: object,
    pageNumber: number,
};

const newBodyComponentStyle = {
    left: '100%',
    width: '0',
};

UiStore.addListener(() => {
    let componentSwitch = UiStore.getState().componentSwitch;

    if (componentSwitch === null) {
        return;
    }

    let currentComponent = document.getElementById("component" + componentSwitch.from);
    let newComponent = document.getElementById("component" + componentSwitch.to);

    if (currentComponent === null || newComponent === null) {
        return;
    }

    if (componentSwitch.isToRight()) {
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
    props: any;

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="Body">
                <AssignmentList pageNumber={0} style={{}} />
                <Statistics pageNumber={1} style={newBodyComponentStyle} />
                <Statistics pageNumber={2} style={newBodyComponentStyle} />
                <Statistics pageNumber={3} style={newBodyComponentStyle} />
                <Statistics pageNumber={4} style={newBodyComponentStyle} />
            </div>
        );
    }
}

export default Body;
