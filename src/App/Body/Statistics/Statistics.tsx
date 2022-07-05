import { Component } from 'react';
import { BodyProps } from '../Body';
import HorizontalSwitcher from '../HorizontalSwitcher/HorizontalSwitcher';
import { Assignment } from '../../../assignment';
import UiStore from '../../../flux/UiStore';
import { ActionKind } from '../../../flux/AppConstants';
import Localization from '../../../localization';
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
        const submissionTitle = Localization.getMessage('statistics.top_item.submission_on_month', '|').split('|');
        const unsubmissionTitle = Localization.getMessage('statistics.top_item.unsubmission_on_month', '|').split('|');
        const submissionRateTitle = Localization.getMessage('statistics.top_item.submission_rate_on_month', '|').split('|');

        return (
            <div className="Statistics body-component" id={this.props.page.name} style={this.props.style}>
                <HorizontalSwitcher title={Localization.getMessage('statistics.statistics')} description={null} onClickLeftButton={this.switchSubpageToBack} onClickRightButton={this.switchSubpageToForward} />
                <div className="statistics">
                    <div className="top-statistics">
                        <div className="top-statistics-item">
                            <div className="top-statistics-item-top">
                                <div className="top-statistics-item-icon" style={{
                                    backgroundImage: 'url(/lib/statistics/complete.svg)',
                                }} />
                                <div className="top-statistics-item-title">
                                    {submissionTitle[0]}
                                    <br />
                                    {submissionTitle[1]}
                                </div>
                            </div>
                            <div className="top-statistics-item-bottom">
                                <div className="top-statistics-item-number">
                                    {Statistics.statisticNumberToString(this.state.numberOfSubmitted)}
                                </div>
                                <div className="top-statistics-item-unit">
                                    {Localization.getMessage('statistics.top_item.assignment_unit')}
                                </div>
                            </div>
                        </div>
                        <div className="top-statistics-item">
                            <div className="top-statistics-item-top">
                                <div className="top-statistics-item-icon" style={{
                                    backgroundImage: 'url(/lib/statistics/incomplete.svg)',
                                }} />
                                <div className="top-statistics-item-title">
                                    {unsubmissionTitle[0]}
                                    <br />
                                    {unsubmissionTitle[1]}
                                </div>
                            </div>
                            <div className="top-statistics-item-bottom">
                                <div className="top-statistics-item-number">
                                    {Statistics.statisticNumberToString(this.state.numberOfUnsubmitted)}
                                </div>
                                <div className="top-statistics-item-unit">
                                    {Localization.getMessage('statistics.top_item.assignment_unit')}
                                </div>
                            </div>
                        </div>
                        <div className="top-statistics-item">
                            <div className="top-statistics-item-top">
                                <div className="top-statistics-item-icon" style={{
                                    backgroundImage: 'url(/lib/statistics/percentage.svg)',
                                }} />
                                <div className="top-statistics-item-title">
                                    {submissionRateTitle[0]}
                                    <br />
                                    {submissionRateTitle[1]}
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
                                    {Localization.getMessage('statistics.detailed_item.submission_rate')}
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
