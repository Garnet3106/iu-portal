import React from "react";
import ReactDOM from 'react-dom/client';
import UiStore from "../../../flux/UiStore";
import { root } from "../../../index";
import { BodyProps } from '../Body';
import AssignmentGroup from './AssignmentGroup/AssignmentGroup';
import './AssignmentList.css';

export type Assignment = {
    id: string,
    subjectName: string,
    deadline: string,
};

type AssignmentListState = {
    assignments: Assignment[],
}

class AssignmentList extends React.Component<BodyProps, AssignmentListState> {
    private _isMounted: boolean;

    constructor(props: BodyProps) {
        super(props);

        this.state = {
            assignments: [],
        };

        this._isMounted = false;

        UiStore.addListener(() => {
            const uiState = UiStore.getState();

            if (uiState.hasAssignmentsUpdated) {
                this.updateAssignmentList(uiState.assignments);
            }
        });
    }

    render() {
        const assignmentGroup = (
            <AssignmentGroup assignments={this.state.assignments} title="すべて" />
        );

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
                <div className="assignment-list" id="assignmentList">
                    {assignmentGroup}
                </div>
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;
    }

    updateAssignmentList(assignments: Assignment[]) {
        if (this._isMounted) {
            this.setState({
                assignments: assignments,
            });
        }
    }
}

export default AssignmentList;
