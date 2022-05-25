import { Component } from 'react';
import { BodyProps } from '../Body';
import HorizontalSwitcher from '../HorizontalSwitcher/HorizontalSwitcher';
import UiStore from '../../../flux/UiStore';
import './Statistics.css';

export type StatisticsState = {
}

class Statistics extends Component<BodyProps, StatisticsState> {
    _isMounted: boolean;

    constructor(props: BodyProps) {
        super(props);

        this._isMounted = false;

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
                                100
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
                                100
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
                                100
                            </div>
                            <div className="top-statistics-item-unit">
                                コ
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
                                    96.5
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

    switchSubpageToForward() {}

    switchSubpageToBack() {}

    onUpdateUiState() {}
}

export default Statistics;
