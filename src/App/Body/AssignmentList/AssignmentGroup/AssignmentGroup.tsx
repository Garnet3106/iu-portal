import React from "react";
import ReactDOM from 'react-dom/client';
import AssignmentItem from '../AssignmentItem/AssignmentItem';
import { Assignment } from "../AssignmentList";
import './AssignmentGroup.css';

type AssignmentGroupProps = {
    title: string,
    assignments: Assignment[],
}

class AssignmentGroup extends React.Component<AssignmentGroupProps> {
    constructor(props: AssignmentGroupProps) {
        super(props); 
    }

    render() {
        let items: JSX.Element[] = [];

        this.props.assignments.forEach((eachAssignment) => {
            items.push((<AssignmentItem key={'assignmentItem_' + eachAssignment.id} assignment={eachAssignment} />));
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
