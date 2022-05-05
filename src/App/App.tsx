// import logo from './logo.svg';

import Header from './Header/Header';
import AssignmentList from './AssignmentList/AssignmentList';
import BottomMenu from './BottomMenu/BottomMenu';
import './App.css';

function App() {
    return (
        <div className="App">
            <AssignmentList />
            <BottomMenu />
        </div>
    );
}

export default App;
