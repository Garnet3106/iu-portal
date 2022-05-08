import React from "react";
import ReactDOM from 'react-dom/client';
import UiStore from "../../../flux/UiStore";
import { BodyProps } from '../Body';
import AssignmentGroup from './AssignmentGroup/AssignmentGroup';
import './AssignmentList.css';

export type Assignment = {
    subjectName: string,
    deadline: string,
};

class AssignmentList extends React.Component<BodyProps> {
    constructor(props: BodyProps) {
        super(props);

        UiStore.addListener(() => {
            const uiState = UiStore.getState();

            if (uiState.hasAssignmentsUpdated) {
                this.updateAssignmentList(uiState.assignments);
            }
        });
    }

    render() {
        return (
            <div className="AssignmentList body-component" id={'page_' + this.props.pageName} style={this.props.style}>
                <div className="display-order">
                    <div className="display-order-item">
                        すべて
                    </div>
                    <div className="display-order-item">
                        期限が早い順
                    </div>
                    <div className="display-order-item">
                        出題が早い順
                    </div>
                </div>
                <hr className="division-line" />
                <div className="assignment-list" id="assignmentList" />
            </div>
        );
    }

    updateAssignmentList(assignments: Assignment[]) {
        const assignmentList = document.getElementById('assignmentList');

        if (assignmentList === null) {
            return;
        }

        const newGroup = (
            <AssignmentGroup assignments={assignments} title="すべて" />
        );

        const newGroupRoot = ReactDOM.createRoot(assignmentList!);
        newGroupRoot.render(newGroup);
    }
}

export default AssignmentList;
