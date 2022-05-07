import { Component } from 'react';
import { BodyProps } from '../Body/Body';
import './Statistics.css';

class Statistics extends Component<BodyProps> {
    constructor(props: BodyProps) {
        super(props);
    }

    render() {
        return (
            <div className="Statistics body-component" id={'component' + this.props.pageNumber} style={this.props.style}>
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            </div>
        );
    }
}

export default Statistics;
