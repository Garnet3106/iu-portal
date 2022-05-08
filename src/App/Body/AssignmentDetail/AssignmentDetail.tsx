import { Component } from 'react';
import { BodyProps } from '../Body';
import HorizontalSwitcher from '../HorizontalSwitcher/HorizontalSwitcher';
import './AssignmentDetail.css';

export type HorizontalSwitcherProps = {
    bodyProps: BodyProps,
    subjectName: string,
    teacherName: string,
};

class AssignmentDetail extends Component<HorizontalSwitcherProps> {
    constructor(props: HorizontalSwitcherProps) {
        super(props);
    }

    render() {
        return (
            <div className="AssignmentDetail body-component" id={'page_' + this.props.bodyProps.pageName} style={this.props.bodyProps.style}>
                <HorizontalSwitcher title={this.props.subjectName} description={this.props.teacherName} onClickLeftButton={this.switchSubpageToBack} onClickRightButton={this.switchSubpageToForward} />
            </div>
        );
    }

    switchSubpageToBack() {
        alert('back');
    }

    switchSubpageToForward() {
        alert('forward');
    }
}

export default AssignmentDetail;
