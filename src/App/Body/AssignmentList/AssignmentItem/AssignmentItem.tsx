import React from "react";
import AppDispatcher from "../../../../flux/AppDispatcher";
import { UiActionCreators } from "../../../../flux/UiActionCreators";
import { Assignment, formatDate } from "../../../../assignment";
import { AssignmentDisplayOrder } from "../AssignmentList";
import UiStore from "../../../../flux/UiStore";
import { JsonApi, JsonApiRequestActionKind } from "../../../../jsonapi";
import './AssignmentItem.css';

type AssignmentItemProps = {
    assignment: Assignment,
    displayOrder: AssignmentDisplayOrder,
}

class AssignmentItem extends React.Component<AssignmentItemProps> {
    constructor(props: AssignmentItemProps) {
        super(props); 
    }

    render() {
        return (
            <div className="assignment-item" id={'assignmentItem_' + this.props.assignment.id} onClick={this.onClickItem.bind(this)}>
                <div>
                    <div className={AssignmentItem.getOperationButtonClassName(this.props.assignment.completed)} onClick={this.onClickOperationButton.bind(this)} />
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

    static getOperationButtonClassName(isComplete: boolean): string {
        let className = 'assignment-item-operation ';
        className += isComplete ? 'assignment-item-operation-make-incomplete' : 'assignment-item-operation-make-complete';
        return className;
    }

    onClickItem(event: React.MouseEvent) {
        const target = event.target as HTMLElement;

        if (target.className.includes('assignment-item-operation')) {
            return;
        }

        const currentTarget = event.currentTarget as HTMLElement;
        const assignmentId = currentTarget.id.split('_')[1];
        AppDispatcher.dispatch(UiActionCreators.previewAssignment(assignmentId));
    }

    onClickOperationButton(event: React.MouseEvent) {
        const target = event.currentTarget as HTMLElement;
        const assignmentItem = target.closest('.assignment-item') as HTMLElement;
        const assignmentId = assignmentItem.id.split('_')[1];
        let dispatchTimeout = 0;

        switch (this.props.displayOrder) {
            case AssignmentDisplayOrder.Completed:
            case AssignmentDisplayOrder.EarlierDeadline: {
                if (assignmentItem !== null) {
                    assignmentItem.style.opacity = '0';
                }

                dispatchTimeout = 300;
            } break;
        }

        setTimeout(() => {
            AppDispatcher.dispatch(UiActionCreators.reverseAssignmentCompletion(assignmentId));
        }, dispatchTimeout);

        let makeComplete;
        const uiState = UiStore.getState();

        uiState.assignments.some((eachAssignment: Assignment) => {
            if (eachAssignment.id === assignmentId) {
                makeComplete = !eachAssignment.completed;
                return true;
            }

            return false;
        });

        const onFailToAuth = () => {
            alert('このアカウントは利用できません。\n大学用の Google アカウントでログインし直してください。');
        };

        const onFail = () => {
            console.error('Assignment Update Error: Failed to update assignment completion.');
        };

        JsonApi.request({
            actionKind: JsonApiRequestActionKind.UpdateCompletion,
            parameters: {
                assignmentId: assignmentId,
                makeComplete: makeComplete,
            },
            onSucceed: () => {},
            onBadRequest: onFail,
            onFailToAuth: onFailToAuth,
            onError: onFail,
        });
    }
}

export default AssignmentItem;
