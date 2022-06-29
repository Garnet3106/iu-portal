import React from "react";
import UiStore from "../../../flux/UiStore";
import { BodyProps } from '../Body';
import AssignmentGroup from './AssignmentGroup/AssignmentGroup';
import { Assignment, formatDate } from "../../../assignment";
import { ActionKind } from "../../../flux/AppConstants";
import './AssignmentList.css';

export enum AssignmentDisplayOrder {
    All,
    Completed,
    EarlierDeadline,
}

export type SortedAssignmentGroups = {
    [deadlineDate: string]: Assignment[],
};

type AssignmentListState = {
    assignments: Assignment[],
    displayOrder: AssignmentDisplayOrder,
}

class AssignmentList extends React.Component<BodyProps, AssignmentListState> {
    private _isMounted: boolean;
    public static defaultDisplayOrder = AssignmentDisplayOrder.EarlierDeadline;

    constructor(props: BodyProps) {
        super(props);

        this.state = {
            assignments: [],
            displayOrder: AssignmentList.defaultDisplayOrder,
        };

        this._isMounted = false;

        UiStore.addListener(() => {
            const uiState = UiStore.getState();

            switch (uiState.latestKind) {
                case ActionKind.UpdateAssignments:
                case ActionKind.ReverseAssignmentCompletion:
                this.updateAssignmentList(uiState.assignments);
                break;
            }
        });
    }

    render() {
        let assignmentGroups: JSX.Element[] = [];

        const filterCompletedAssignment = (eachAssignment: Assignment) => {
            return eachAssignment.completed;
        };

        const filterIncompletedAssignment = (eachAssignment: Assignment) => {
            return !eachAssignment.completed;
        };

        switch (this.state.displayOrder) {
            case AssignmentDisplayOrder.All: {
                const newGroup = (<AssignmentGroup assignments={this.state.assignments} title="すべて" key="assignmentGroup_all" displayOrder={this.state.displayOrder} />);
                assignmentGroups.push(newGroup);
            } break;

            case AssignmentDisplayOrder.Completed: {
                const sortedAssignments = this.state.assignments.filter(filterCompletedAssignment);
                const newGroup = (<AssignmentGroup assignments={sortedAssignments} title="完了済" key="assignmentGroup_completed" displayOrder={this.state.displayOrder} />);
                assignmentGroups.push(newGroup);
            } break;

            case AssignmentDisplayOrder.EarlierDeadline: {
                const sortedAssignments = this.state.assignments
                    .filter(filterIncompletedAssignment)
                    .sort((v1: Assignment, v2: Assignment) => {
                        if (v1.deadline === null || v2.deadline === null) {
                            return -1;
                        }

                        if (v1.deadline < v2.deadline) {
                            return -1;
                        }

                        if (v1.deadline > v2.deadline) {
                            return 1;
                        }

                        return 0;
                    });

                let sortedAssignmentGroups: SortedAssignmentGroups = {};

                sortedAssignments.forEach((eachAssignment: Assignment) => {
                    const deadlineDate = formatDate(eachAssignment.deadline, 'M/d まで', '期限なし');

                    if (!(deadlineDate in sortedAssignmentGroups)) {
                        sortedAssignmentGroups[deadlineDate] = [];
                    }

                    sortedAssignmentGroups[deadlineDate].push(eachAssignment);
                });

                assignmentGroups = Object.keys(sortedAssignmentGroups).map((key: string) =>
                    <AssignmentGroup assignments={sortedAssignmentGroups[key]} title={key} key={`assignmentGroup_${key}`} displayOrder={this.state.displayOrder} />);
            } break;
        }

        const listContent = assignmentGroups.length !== 0 ?
            assignmentGroups :
            (<div className="assignment-list-message">表示する課題はありません</div>);

        return (
            <div className="AssignmentList body-component" id={this.props.page.name} style={this.props.style}>
                <div className="display-order">
                    <div className={this.getDisplayOrderCssClass(AssignmentDisplayOrder.All)} onClick={() => {
                        this.onClickDisplayOrderItem(AssignmentDisplayOrder.All)
                    }}>
                        すべて
                    </div>
                    <div className={this.getDisplayOrderCssClass(AssignmentDisplayOrder.Completed)} onClick={() => {
                        this.onClickDisplayOrderItem(AssignmentDisplayOrder.Completed)
                    }}>
                        完了済
                    </div>
                    <div className={this.getDisplayOrderCssClass(AssignmentDisplayOrder.EarlierDeadline)} onClick={() => {
                        this.onClickDisplayOrderItem(AssignmentDisplayOrder.EarlierDeadline)
                    }}>
                        期限が早い順
                    </div>
                </div>
                <hr className="division-line" />
                <div className="assignment-list" id="assignmentList">
                    {listContent}
                </div>
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;
    }

    getDisplayOrderCssClass(targetDisplayOrder: AssignmentDisplayOrder) {
        const basicClass = 'display-order-item';
        const selectedClass = 'display-order-item-selected';

        if (this.state.displayOrder === targetDisplayOrder) {
            return `${basicClass} ${selectedClass}`;
        } else {
            return `${basicClass}`;
        }
    }

    onClickDisplayOrderItem(targetDisplayOrder: AssignmentDisplayOrder) {
        if (!this._isMounted) {
            return;
        }

        this.setState({
            displayOrder: targetDisplayOrder,
        });
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
