import React from 'react';
import AssignmentList from '../AssignmentList/AssignmentList';
import Statistics from '../Statistics/Statistics';
import './Body.css';

class Body extends React.Component {
    props: any;

    constructor(props: any) {
        super(props);
        this.state = {elem: props.elem};
        this.props = props;
    }

    render() {
        console.log('eeea');
        console.log(this.state.elem);
        this.props.elem.addEventListener('onClickComponentIcon', () => {
            console.log('eee');
        });

        return (
            <div className="Body">
                <AssignmentList />
                <Statistics />
            </div>
        );
    }
}

export default Body;
