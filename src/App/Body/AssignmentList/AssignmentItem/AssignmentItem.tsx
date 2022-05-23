import React from "react";
import AppDispatcher from "../../../../flux/AppDispatcher";
import { UiActionCreators } from "../../../../flux/UiActionCreators";
import { Assignment, formatDate } from "../../../../assignment";
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
                        <div className="assignment-item-course">
                            {this.props.assignment.course.name}
                        </div>
                        <div className="assignment-item-deadline">
                            {formatDate(this.props.assignment.deadline, 'yyyy/M/d', '期限なし')}
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
        AppDispatcher.dispatch(UiActionCreators.previewAssignment(assignmentId));
    }
}

export default AssignmentItem;
