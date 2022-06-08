import React, { Component } from 'react';
import { formatDate } from '../../../assignment';
import { ActionKind } from '../../../flux/AppConstants';
import UiStore from '../../../flux/UiStore';
import { BodyProps } from '../Body';
import HorizontalSwitcher from '../HorizontalSwitcher/HorizontalSwitcher';
import './AssignmentPreview.css';

export type AssignmentPreviewProps = {
    bodyProps: BodyProps,
};

export type AssignmentPreviewState = {
    assignmentId: string | null,
};

class AssignmentPreview extends Component<AssignmentPreviewProps, AssignmentPreviewState> {
    _isMounted: boolean;
    // To complement unset assigment ID for state.
    _initialAssignmentId: string | null;

    constructor(props: AssignmentPreviewProps) {
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
                <div className="Statistics body-component" id={this.props.bodyProps.page.toId()} style={this.props.bodyProps.style}>
                    <HorizontalSwitcher title="課題がロードされていません" description="" onClickLeftButton={this.switchSubpageToBack} onClickRightButton={this.switchSubpageToForward} />
                </div>
            );
        }

        const assignment = UiStore.getState().assignments.find((v) => v.id === this.state.assignmentId);

        if (assignment === undefined) {
            console.error(`Assignment Loading Error: Couldn't update assigment preview because \`${this.state.assignmentId}\` is not found.`);
            return;
        }

        return (
            <div className="AssignmentPreview body-component" id={this.props.bodyProps.page.toId()} style={this.props.bodyProps.style}>
                <HorizontalSwitcher title={assignment.course.name} description={assignment.course.teachers.map((eachTeacher) => eachTeacher.name).join('<br>')} onClickLeftButton={this.switchSubpageToBack} onClickRightButton={this.switchSubpageToForward} />
                <div className="preview">
                    <div className="preview-left">
                        <div className="preview-description">
                            {assignment.description}
                        </div>
                        <div className="preview-note">
                            {assignment.note}
                        </div>
                        <div className="preview-management">
                            登録者 {assignment.registrar.nickname} ({assignment.numberOfCheckers} 人が照合)
                        </div>
                    </div>
                    <div className="preview-detail-wrapper">
                        <div className="preview-detail">
                            <div className="preview-detail-deadline">
                                {formatDate(assignment.deadline, 'yyyy/M/d', '期限なし')}
                            </div>
                            <div className="preview-detail-group">
                                <div className="preview-detail-title">
                                    配布元
                                </div>
                                <div className="preview-detail-content">
                                    {assignment.assignedFrom}
                                </div>
                            </div>
                            <div className="preview-detail-arrow" />
                            <div className="preview-detail-group">
                                <div className="preview-detail-title">
                                    提出先
                                </div>
                                <div className="preview-detail-content">
                                    {assignment.submitTo}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

        if (uiState.latestKind === ActionKind.UpdatePreviewingAssignment) {
            if (this._isMounted) {
                this.setState({
                    assignmentId: uiState.previewingAssignmentId,
                });
            } else {
                this._initialAssignmentId = uiState.previewingAssignmentId;
            }
        }
    }

    switchSubpageToBack(_event: React.MouseEvent) {
        alert('back');
    }

    switchSubpageToForward(_event: React.MouseEvent) {
        alert('forward');
    }
}

export default AssignmentPreview;
