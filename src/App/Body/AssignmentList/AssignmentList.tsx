import React from "react";
import UiStore from "../../../flux/UiStore";
import { BodyProps } from '../Body';
import AssignmentGroup from './AssignmentGroup/AssignmentGroup';
import { Assignment, formatDate } from "../../../assignment";
import { ActionKind } from "../../../flux/AppConstants";
import Localization from "../../../localization";
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
                const title = Localization.getMessage('assignment_list.group_title.all');
                const newGroup = (<AssignmentGroup assignments={this.state.assignments} title={title} key="assignmentGroup_all" displayOrder={this.state.displayOrder} />);
                assignmentGroups.push(newGroup);
            } break;

            case AssignmentDisplayOrder.Completed: {
                const sortedAssignments = this.state.assignments.filter(filterCompletedAssignment);
                const title = Localization.getMessage('assignment_list.group_title.completed');
                const newGroup = (<AssignmentGroup assignments={sortedAssignments} title={title} key="assignmentGroup_completed" displayOrder={this.state.displayOrder} />);
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
                    const deadlineDate = formatDate(eachAssignment.deadline, Localization.getMessage('assignment_list.deadline.until_date', 'M/d'), Localization.getMessage('assignment_list.deadline.no_deadline'));

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
            (<div className="assignment-list-message">
                {Localization.getMessage('assignment_list.no_assignments_to_display')}
            </div>);

        return (
            <div className="AssignmentList body-component" id={this.props.page.name} style={this.props.style}>
                <div className="display-order">
                    <div className={this.getDisplayOrderCssClass(AssignmentDisplayOrder.All)} onClick={() => {
                        this.onClickDisplayOrderItem(AssignmentDisplayOrder.All)
                    }}>
                        {Localization.getMessage('assignment_list.display_order.all')}
                    </div>
                    <div className={this.getDisplayOrderCssClass(AssignmentDisplayOrder.Completed)} onClick={() => {
                        this.onClickDisplayOrderItem(AssignmentDisplayOrder.Completed)
                    }}>
                        {Localization.getMessage('assignment_list.display_order.completed')}
                    </div>
                    <div className={this.getDisplayOrderCssClass(AssignmentDisplayOrder.EarlierDeadline)} onClick={() => {
                        this.onClickDisplayOrderItem(AssignmentDisplayOrder.EarlierDeadline)
                    }}>
                        {Localization.getMessage('assignment_list.display_order.deadline')}
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

    componentWillUnmount() {
        this._isMounted = false;
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
