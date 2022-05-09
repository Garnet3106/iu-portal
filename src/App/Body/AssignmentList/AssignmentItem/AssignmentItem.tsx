import React from "react";
import ReactDOM from 'react-dom/client';
import { ActionKind } from "../../../../flux/AppConstants";
import AppDispatcher from "../../../../flux/AppDispatcher";
import UiStore, { Page, PageSwitch } from "../../../../flux/UiStore";
import { BodyProps } from '../../Body';
import { Assignment } from "../AssignmentList";
import './AssignmentItem.css';

type AssignmentItemProps = {
    assignment: Assignment,
}

class AssignmentItem extends React.Component<AssignmentItemProps> {
    constructor(props: AssignmentItemProps) {
        super(props); 
    }

    render() {
        return (
            <div className="assignment-item" id={'assignmentItem_' + this.props.assignment.id} onClick={this.onClickItem}>
                <div>
                    <div className="assignment-item-operation" />
                    <div className="assignment-item-content">
                        <div className="assignment-item-subject">
                            {this.props.assignment.subjectName}
                        </div>
                        <div className="assignment-item-deadline">
                            {this.props.assignment.deadline}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="assignment-item-button-item" />
                    <div className="assignment-item-button-item" />
                </div>
            </div>
        );
    }

    onClickItem(event: React.MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        const assignmentId = target.id.split('_')[1];
        const uiState = UiStore.getState();

        AppDispatcher.dispatch({
            type: ActionKind.PageSwitch as ActionKind.PageSwitch,
            data: {
                currentPage: uiState.currentPage,
                switchPageTo: new Page(1, 'AssignmentDetail'),
                hasAssignmentsUpdated: false,
                assignments: uiState.assignments,
                previewingAssignmentId: assignmentId,
            },
        });
    }
}

export default AssignmentItem;
