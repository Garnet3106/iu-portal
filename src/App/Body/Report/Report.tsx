import React, { Component } from 'react';
import { BodyProps } from '../Body';
import AppDispatcher from '../../../flux/AppDispatcher';
import { UiActionCreators } from '../../../flux/UiActionCreators';
import { JsonApi, JsonApiRequestActionKind } from '../../../jsonapi';
import { pageList } from '../../../page';
import Localization from '../../../localization';
import './Report.css';

export enum ReportKind {
    MessageToDeveloper,
    IllegalUse,
    BugOrVulnerability,
}

export function reportKindToStringName(kind: ReportKind): string {
    switch (kind) {
        case ReportKind.MessageToDeveloper:
        return 'message_to_developer';

        case ReportKind.IllegalUse:
        return 'illegal_use';

        case ReportKind.BugOrVulnerability:
        return 'bug_or_vulnerability';
    }
}

export enum MessageLengthValidation {
    Appropriate,
    NoMessage,
    LessThanLimit,
    GreaterThanLimit,
}

export type ReportState = {
    kind: ReportKind,
    msg: string,
}

const minMsgLen = 5;
const maxMsgLen = 1000;

let hasBeforeUnloadEventListenerSet = false;

class Report extends Component<BodyProps, ReportState> {
    textAreaRef: React.RefObject<HTMLTextAreaElement>;

    constructor(props: BodyProps) {
        super(props);
        this.textAreaRef = React.createRef();

        this.state = {
            kind: 0 as ReportKind,
            msg: '',
        };

        if (hasBeforeUnloadEventListenerSet) {
            window.removeEventListener('beforeunload', this.onBeforeUnload);
        }

        window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
        hasBeforeUnloadEventListenerSet = true;
    }

    render() {
        let options: JSX.Element[] = [];

        Object.entries(ReportKind).forEach(([_index, eachKind]) => {
            const assertedKind = eachKind as ReportKind;

            if (typeof assertedKind === 'number') {
                const newOption = (<option key={`reportKindOption_${assertedKind}`}>
                    {Localization.getMessage(`report.kind.${reportKindToStringName(assertedKind)}`)}
                </option>);

                options.push(newOption);
            }
        });

        const restOfMsgLen = this.state.msg.length - maxMsgLen;
        const isMsgLenAppropriate = Report.validateMessageLength(this.state.msg, minMsgLen, maxMsgLen) === MessageLengthValidation.Appropriate;
        const textAreaClassName = isMsgLenAppropriate ? 'report-content-text-count' : 'report-content-text-count report-content-text-count-over';
        const placeholderMsg = Localization.getMessage('report.description', [minMsgLen, maxMsgLen]);

        return (
            <div className="Report body-component" id={this.props.page.name} style={this.props.style}>
                <div className="report">
                    <div className="report-content">
                        <select className="report-content-kind" onChange={this.onChangeReportKind.bind(this)}>
                            {options}
                        </select>
                        <textarea className="report-content-text" onChange={this.onChangeReportMessage.bind(this)} placeholder={placeholderMsg} ref={this.textAreaRef} />
                        <div className={textAreaClassName}>
                            {restOfMsgLen}
                        </div>
                    </div>
                    <div className="report-send-button" onClick={this.onClickSendButton.bind(this)}>
                        {Localization.getMessage('report.send')}
                    </div>
                </div>
            </div>
        );
    }

    onBeforeUnload(event: BeforeUnloadEvent) {
        const textArea = this.textAreaRef.current;

        if (textArea !== null && textArea.value.length !== 0) {
            event.returnValue = Localization.getMessage('report.message.leave_page');
        }
    }

    onChangeReportKind(event: React.ChangeEvent<HTMLSelectElement>) {
        const target = event.target as HTMLSelectElement;

        this.setState({
            kind: target.selectedIndex as ReportKind,
        });
    }

    onChangeReportMessage(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const target = event.target as HTMLTextAreaElement;

        this.setState({
            msg: target.value,
        });
    }

    onClickSendButton() {
        switch (Report.validateMessageLength(this.state.msg, minMsgLen, maxMsgLen)) {
            case MessageLengthValidation.Appropriate: {
                if (window.confirm(Localization.getMessage('report.message.sending_confirmation'))) {
                    this.sendToServer(this.state.kind, this.state.msg);
                    AppDispatcher.dispatch(UiActionCreators.updateSwitchTargetPage(pageList['assignmentList']));
                }
            } break;

            case MessageLengthValidation.NoMessage: {
                alert(Localization.getMessage('report.message.enter_your_message'));
            } break;

            case MessageLengthValidation.LessThanLimit: {
                alert(Localization.getMessage('report.message.enter_at_lease_n_characters', minMsgLen));
            } break;

            case MessageLengthValidation.GreaterThanLimit: {
                alert(Localization.getMessage('report.message.enter_up_to_n_characters', maxMsgLen));
            } break;
        }
    }

    sendToServer(kind: ReportKind, msg: string) {
        const onSucceed = () => {
            if (this.textAreaRef.current !== null) {
                this.textAreaRef.current.value = '';
            }

            alert(Localization.getMessage('report.message.thank_you_for_your_report'));
        };

        const onFailToAuth = () => {
            alert(Localization.getMessage('signin.error.cannot_use_this_account'));
        };

        const onFail = () => {
            alert(Localization.getMessage('report.message.failed_to_send'));
        };

        JsonApi.request({
            actionKind: JsonApiRequestActionKind.Register,
            parameters: {
                'report': {
                    'kind': reportKindToStringName(kind),
                    'message': msg,
                }
            },
            onSucceed: onSucceed,
            onBadRequest: onFail,
            onFailToAuth: onFailToAuth,
            onError: onFail,
        });
    }

    static validateMessageLength(msg: string, minLimit: number, maxLimit: number): MessageLengthValidation {
        const msgLen = msg.length;
        const msgLenWithNoSpaces = msg.replace(/\u0020/g, '').replace(/\u3000/g, '').length;

        if (msgLenWithNoSpaces === 0) {
            return MessageLengthValidation.NoMessage;
        }

        if (msgLenWithNoSpaces < minLimit) {
            return MessageLengthValidation.LessThanLimit;
        }

        if (msgLen > maxLimit) {
            return MessageLengthValidation.GreaterThanLimit;
        }

        return MessageLengthValidation.Appropriate;
    }
}

export default Report;
