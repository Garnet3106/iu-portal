import { Component } from 'react';
import UiStore from '../../../flux/UiStore';
import { Assignment } from '../AssignmentList/AssignmentList';
import { BodyProps } from '../Body';
import HorizontalSwitcher from '../HorizontalSwitcher/HorizontalSwitcher';
import './AssignmentPreview.css';

export type HorizontalSwitcherProps = {
    bodyProps: BodyProps,
};

export type HorizontalSwitcherState = {
    assignmentId: string | null,
};

class AssignmentPreview extends Component<HorizontalSwitcherProps, HorizontalSwitcherState> {
    _isMounted: boolean;
    // To complement unset assigment ID for state.
    _initialAssignmentId: string | null;

    constructor(props: HorizontalSwitcherProps) {
        super(props);

        this._isMounted = false;
        this._initialAssignmentId = null;

        this.state = {
            assignmentId: null,
        }

        UiStore.addListener(this.onUpdateUiState.bind(this));
    }

    render() {
        if (this.state.assignmentId === null) {
            return (
                <div className="AssignmentPreview body-component" id={this.props.bodyProps.page.toId()} style={this.props.bodyProps.style}>
                    <HorizontalSwitcher title="課題がロードされていません" description="" onClickLeftButton={this.switchSubpageToBack} onClickRightButton={this.switchSubpageToForward} />
                </div>
            );
        }

        const assignment = UiStore.getState().assignments.find((v) => v.id === this.state.assignmentId);

        if (assignment === undefined) {
            console.error(`Assignment Load Error: Couldn't update assigment preview because \`${this.state.assignmentId}\` is not found.`);
            return;
        }

        return (
            <div className="AssignmentPreview body-component" id={this.props.bodyProps.page.toId()} style={this.props.bodyProps.style}>
                <HorizontalSwitcher title={assignment.subjectName} description={assignment.teacherName} onClickLeftButton={this.switchSubpageToBack} onClickRightButton={this.switchSubpageToForward} />
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._initialAssignmentId !== null) {
            this.setState({
                assignmentId: this._initialAssignmentId,
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onUpdateUiState() {
        const uiState = UiStore.getState();

        if (uiState.previewingAssignmentId !== this.state.assignmentId) {
            if (this._isMounted) {
                this.setState({
                    assignmentId: uiState.previewingAssignmentId,
                });
            } else {
                this._initialAssignmentId = uiState.previewingAssignmentId;
            }
        }
    }

    switchSubpageToBack() {
        alert('back');
    }

    switchSubpageToForward() {
        alert('forward');
    }
}

export default AssignmentPreview;
