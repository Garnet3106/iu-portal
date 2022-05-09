import { Component } from 'react';
import { BodyProps } from '../Body';
import './Statistics.css';

class Statistics extends Component<BodyProps> {
    constructor(props: BodyProps) {
        super(props);
    }

    render() {
        return (
            <div className="Statistics body-component" id={this.props.page.toId()} style={this.props.style}>
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
            </div>
        );
    }
}

export default Statistics;
