import React from "react";
import ReactDOM from 'react-dom/client';
import { BodyProps } from '../../Body';
import './AssignmentItem.css';

type AssignmentItemProps = {
    subjectName: string,
    deadline: string,
}

class AssignmentItem extends React.Component<AssignmentItemProps> {
    constructor(props: AssignmentItemProps) {
        super(props); 
    }

    render() {
        return (
            <div className="assignment-item">
                <div>
                    <div className="assignment-item-operation" />
                    <div className="assignment-item-content">
                        <div className="assignment-item-subject">
                            {this.props.subjectName}
                        </div>
                        <div className="assignment-item-deadline">
                            {this.props.deadline}
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
}

export default AssignmentItem;
