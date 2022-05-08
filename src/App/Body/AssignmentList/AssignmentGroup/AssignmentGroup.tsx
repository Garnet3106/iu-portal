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
            items.push((<AssignmentItem deadline={eachAssignment.deadline} subjectName={eachAssignment.subjectName} />));
        });

        return (
            <div className="assignment-group">
                <div className="assignment-group-title">
                    {this.props.title}
                </div>
                <div className="assignment-group-items">
                    {items}
                </div>
            </div>
        );
    }
}

export default AssignmentGroup;
