import React from "react";
import AssignmentItem from '../AssignmentItem/AssignmentItem';
import { Assignment } from "../../../../assignment";
import { AssignmentDisplayOrder } from "../AssignmentList";
import './AssignmentGroup.css';

type AssignmentGroupProps = {
    title: string,
    assignments: Assignment[],
    displayOrder: AssignmentDisplayOrder,
}

class AssignmentGroup extends React.Component<AssignmentGroupProps> {
    render() {
        let items: JSX.Element[] = [];

        this.props.assignments.forEach((eachAssignment) => {
            items.push((<AssignmentItem key={'assignmentItem_' + eachAssignment.id} assignment={eachAssignment} displayOrder={this.props.displayOrder} />));
        });

        return (
            <div className="AssignmentGroup">
                <div className="assignment-group">
                    <div className="assignment-group-title">
                        {this.props.title}
                    </div>
                    <div className="assignment-group-items">
                        {items}
                    </div>
                </div>
            </div>
        );
    }
}

export default AssignmentGroup;
