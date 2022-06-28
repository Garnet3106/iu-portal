import { Component } from 'react';
import { BodyProps } from '../Body';
import HorizontalSwitcher from '../HorizontalSwitcher/HorizontalSwitcher';
import { Assignment } from '../../../assignment';
import UiStore from '../../../flux/UiStore';
import { ActionKind } from '../../../flux/AppConstants';
import './Statistics.css';

export class MightBeUnknown<T extends object | number> {
    private _value: T | null;

    private constructor(value: T | null) {
        this._value = value;
    }

    static value<T extends object | number>(value: T): MightBeUnknown<T> {
        return new MightBeUnknown<T>(value);
    }

    static unknown<T extends object | number>(): MightBeUnknown<T> {
        return new MightBeUnknown<T>(null);
    }

    get(): T | null {
        return this._value;
    }
}

export type StatisticsState = {
    numberOfSubmitted: MightBeUnknown<number>,
    numberOfUnsubmitted: MightBeUnknown<number>,
    submissionRate: MightBeUnknown<number>,
}

class Statistics extends Component<BodyProps, StatisticsState> {
    private _isMounted: boolean;
    private _initialState: StatisticsState;

    constructor(props: BodyProps) {
        super(props);

        this._isMounted = false;

        this._initialState = {
            numberOfSubmitted: MightBeUnknown.unknown(),
            numberOfUnsubmitted: MightBeUnknown.unknown(),
            submissionRate: MightBeUnknown.unknown(),
        };

        this.state = this._initialState;

        UiStore.addListener(this.onUpdateUiState.bind(this));
    }

    render() {
        return (
            <div className="Statistics body-component" id={this.props.page.toId()} style={this.props.style}>
                <HorizontalSwitcher title="統計" description={null} onClickLeftButton={this.switchSubpageToBack} onClickRightButton={this.switchSubpageToForward} />
                <div className="top-statistics">
                    <div className="top-statistics-item">
                        <div className="top-statistics-item-top">
                            <div className="top-statistics-item-icon" />
                            <div className="top-statistics-item-title">
                                今月の
                                <br />
                                提出数
                            </div>
                        </div>
                        <div className="top-statistics-item-bottom">
                            <div className="top-statistics-item-number">
                                {Statistics.statisticNumberToString(this.state.numberOfSubmitted)}
                            </div>
                            <div className="top-statistics-item-unit">
                                コ
                            </div>
                        </div>
                    </div>
                    <div className="top-statistics-item">
                        <div className="top-statistics-item-top">
                            <div className="top-statistics-item-icon" />
                            <div className="top-statistics-item-title">
                                今月の
                                <br />
                                未提出数
                            </div>
                        </div>
                        <div className="top-statistics-item-bottom">
                            <div className="top-statistics-item-number">
                                {Statistics.statisticNumberToString(this.state.numberOfUnsubmitted)}
                            </div>
                            <div className="top-statistics-item-unit">
                                コ
                            </div>
                        </div>
                    </div>
                    <div className="top-statistics-item">
                        <div className="top-statistics-item-top">
                            <div className="top-statistics-item-icon" />
                            <div className="top-statistics-item-title">
                                今月の
                                <br />
                                提出率
                            </div>
                        </div>
                        <div className="top-statistics-item-bottom">
                            <div className="top-statistics-item-number">
                                {Statistics.statisticNumberToString(this.state.submissionRate)}
                            </div>
                            <div className="top-statistics-item-unit">
                                %
                            </div>
                        </div>
                    </div>
                </div>
                <div className="detailed-statistics">
                    <div className="detailed-statistics-side">
                        <div className="detailed-statistics-item">
                            <div className="detailed-statistics-item-title">
                                提出率
                            </div>
                            <div className="detailed-statistics-item-data">
                                <div className="detailed-statistics-item-data-number">
                                    {Statistics.statisticNumberToString(this.state.submissionRate)}
                                </div>
                                <div className="detailed-statistics-item-data-unit">
                                    %
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
        this.setState(this._initialState);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    switchSubpageToForward() {}

    switchSubpageToBack() {}

    onUpdateUiState() {
        const uiState = UiStore.getState();

        if (uiState.latestKind === ActionKind.UpdateAssignments) {
            let numberOfSubmitted = 0;
            let numberOfUnsubmitted = 0;

            uiState.assignments.forEach((eachAssignment: Assignment) => {
                eachAssignment.completed ? numberOfSubmitted += 1 : numberOfUnsubmitted += 1;
            });

            const submissionSum = numberOfSubmitted + numberOfUnsubmitted;
            const submissionRate = submissionSum !== 0 ? (numberOfSubmitted / submissionSum) * 100 : 0;

            if (this._isMounted) {
                this.setState({
                    numberOfSubmitted: MightBeUnknown.value(numberOfSubmitted),
                    numberOfUnsubmitted: MightBeUnknown.value(numberOfUnsubmitted),
                    submissionRate: MightBeUnknown.value(submissionRate),
                });
            } else {
                this._initialState = {
                    numberOfSubmitted: MightBeUnknown.value(numberOfSubmitted),
                    numberOfUnsubmitted: MightBeUnknown.value(numberOfUnsubmitted),
                    submissionRate: MightBeUnknown.value(submissionRate),
                };
            }
        }
    }

    static statisticNumberToString(value: MightBeUnknown<number>): string {
        const rawValue = value.get();
        return rawValue !== null ? Math.round(rawValue).toString() : '?';
    }
}

export default Statistics;
