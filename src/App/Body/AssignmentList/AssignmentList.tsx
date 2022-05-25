import React from "react";
import UiStore from "../../../flux/UiStore";
import { BodyProps } from '../Body';
import AssignmentGroup from './AssignmentGroup/AssignmentGroup';
import { Assignment, formatDate } from "../../../assignment";
import './AssignmentList.css';

export enum AssignmentDisplayOrder {
    All,
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

    constructor(props: BodyProps) {
        super(props);

        this.state = {
            assignments: [],
            displayOrder: AssignmentDisplayOrder.All,
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
        let assignmentGroup: JSX.Element[] = [];

        switch (this.state.displayOrder) {
            case AssignmentDisplayOrder.All: {
                assignmentGroup.push((
                    <AssignmentGroup assignments={this.state.assignments} title="すべて" key="assignmentGroup_all" />
                ));
            } break;

            case AssignmentDisplayOrder.EarlierDeadline: {
                const sortedAssignments = this.state.assignments.sort((a: Assignment, b: Assignment) => {
                    if (a.deadline === null || b.deadline === null) {
                        return -1;
                    }

                    if (a.deadline < b.deadline) {
                        return -1;
                    }

                    if (a.deadline > b.deadline) {
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

                assignmentGroup = Object.keys(sortedAssignmentGroups).map((key: string) => {
                    return (
                        <AssignmentGroup assignments={sortedAssignmentGroups[key]} title={key} key={`assignmentGroup_${key}`} />
                    );
                });
            } break;
        }

        return (
            <div className="AssignmentList body-component" id={this.props.page.toId()} style={this.props.style}>
                <div className="display-order">
                    <div className={this.getDisplayOrderCssClass(AssignmentDisplayOrder.All)} onClick={() => {
                        this.onClickDisplayOrderItem(AssignmentDisplayOrder.All)
                    }}>
                        すべて
                    </div>
                    <div className={this.getDisplayOrderCssClass(AssignmentDisplayOrder.EarlierDeadline)} onClick={() => {
                        this.onClickDisplayOrderItem(AssignmentDisplayOrder.EarlierDeadline)
                    }}>
                        期限が早い順
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
