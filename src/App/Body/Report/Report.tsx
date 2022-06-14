import React, { Component } from 'react';
import { BodyProps } from '../Body';
import { Page } from '../../../flux/UiStore';
import AppDispatcher from '../../../flux/AppDispatcher';
import { UiActionCreators } from '../../../flux/UiActionCreators';
import { JsonApi, JsonApiRequestActionKind } from '../../../jsonapi';
import './Report.css';

export enum ReportKind {
    MessageToDeveloper,
    IllegalUse,
    BugOrVulnerability,
}

export function reportKindToJapanese(kind: ReportKind): string {
    switch (kind) {
        case ReportKind.MessageToDeveloper:
        return '開発者へのメッセージ (要望, 感想など)';

        case ReportKind.IllegalUse:
        return '不正利用報告';

        case ReportKind.BugOrVulnerability:
        return 'バグ / 脆弱性報告';
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

const maxMsgLen = 1000;
const minMsgLen = 5;

class Report extends Component<BodyProps, ReportState> {
    textAreaRef: React.RefObject<HTMLTextAreaElement>;
    
    constructor(props: BodyProps) {
        super(props);
        this.textAreaRef = React.createRef();

        this.state = {
            kind: 0 as ReportKind,
            msg: '',
        };
    }

    render() {
        let options: JSX.Element[] = [];

        Object.entries(ReportKind).forEach(([_index, eachKind]) => {
            const assertedKind = eachKind as ReportKind;

            if (typeof assertedKind === 'number') {
                options.push((<option key={`reportKindOption_${assertedKind}`}>{reportKindToJapanese(assertedKind)}</option>));
            }
        });

        const restOfMsgLen = this.state.msg.length - maxMsgLen;
        const isMsgLenAppropriate = Report.validateMessageLength(this.state.msg, minMsgLen, maxMsgLen) === MessageLengthValidation.Appropriate;
        const textAreaClassName = isMsgLenAppropriate ? 'report-text-count' : 'report-text-count report-text-count-over';

        return (
            <div className="Report body-component" id={this.props.page.toId()} style={this.props.style}>
                <div className="report-wrapper">
                    <select className="report-kind" onChange={this.onChangeReportKind.bind(this)}>
                        {options}
                    </select>
                    <textarea className="report-text" onChange={this.onChangeReportMessage.bind(this)} placeholder={`${minMsgLen} 文字以上 ${maxMsgLen} 文字以内でご記入ください`} ref={this.textAreaRef} />
                    <div className={textAreaClassName}>
                        {restOfMsgLen}
                    </div>
                </div>
                <div className="report-send" onClick={this.onClickSendButton.bind(this)}>
                    送信
                </div>
            </div>
        );
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
                if (window.confirm('送信してよろしいですか？\n\n※ アプリの円滑な運営を目的に送信者のアカウント情報を記録しますが、外部には公開いたしません。')) {
                    this.sendToServer(this.state.kind, this.state.msg);
                    AppDispatcher.dispatch(UiActionCreators.updateSwitchTargetPage(new Page(1, 'AssignmentList')));
                }
            } break;

            case MessageLengthValidation.NoMessage: {
                alert('メッセージを入力してください。');
            } break;

            case MessageLengthValidation.LessThanLimit: {
                alert(`最低 ${minMsgLen} 文字は入力してください。`);
            } break;

            case MessageLengthValidation.GreaterThanLimit: {
                alert(`${maxMsgLen} 文字以内で入力してください。`);
            } break;
        }
    }

    sendToServer(kind: ReportKind, msg: string) {
        const onSucceed = () => {
            if (this.textAreaRef.current !== null) {
                this.textAreaRef.current.value = '';
            }

            alert('ご報告ありがとうございました。後ほど管理者が確認いたします。');
        };

        const onFailToAuth = () => {
            alert('このアカウントは利用できません。\n大学用の Google アカウントでログインしてください。');
        };

        const onFail = () => {
            alert('技術的なトラブルにより送信に失敗しました。再度お試しください。');
        };

        JsonApi.request({
            actionKind: JsonApiRequestActionKind.Report,
            parameters: {},
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

        if (msgLenWithNoSpaces < minMsgLen) {
            return MessageLengthValidation.LessThanLimit;
        }

        if (msgLen > maxMsgLen) {
            return MessageLengthValidation.GreaterThanLimit;
        }

        return MessageLengthValidation.Appropriate;
    }
}

export default Report;
