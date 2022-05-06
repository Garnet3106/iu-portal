import AssignmentList from '../AssignmentList/AssignmentList';
import Statistics from '../Statistics/Statistics';
import './Body.css';

function Body() {
    return (
        <div className="Body">
            <AssignmentList />
            <Statistics />
        </div>
    );
}

export default Body;
