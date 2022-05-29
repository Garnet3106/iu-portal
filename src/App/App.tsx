// import logo from './logo.svg';

import React from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import BottomMenu from './BottomMenu/BottomMenu';
import AppDispatcher from '../flux/AppDispatcher';
import { UiActionCreators } from '../flux/UiActionCreators';
import { apiResponseToAssignments, toAssignmentStructureApiResponse } from '../jsonapi';
import './App.css';

// let req = new XMLHttpRequest();

// req.addEventListener('load', () => {
//     console.log(req.responseText);

//     if (response.status === 'error') {
//         let msg = response.message;
//         console.error(`Assignment Error: Failed to load assignments. (${msg !== '' ? msg : 'no message'})`);
//         return;
//     }

//     AppDispatcher.dispatch(UiActionCreators.initializeAssignments(response.content.assignments));
// });

// req.open('GET', `https://iu-portal.gant.work/api.php?request=${encodeURIComponent(`{"action":"get_asgn"}`)}`);
// req.send();

// Initialize UI State.
AppDispatcher.dispatch(UiActionCreators.getDefault());

class App extends React.Component<{}> {
    constructor(props: {}) {
        super(props);

        let response;

        try {
            response = JSON.parse(`{"status":200,"request":"{\\"action\\":\\"get_assignments\\",\\"includeCompleted\\":true}","contents":{"assignments":{"3db893b5-d247-11ec-8085-49bfe3345a29":{"registrarId":"3db893b5-d247-11ec-8085-49bfe3345a29","numberOfCheckers":2,"courseId":"3db893b5-d247-11ec-8085-49bfe3345a29","lectureId":"3db893b5-d247-11ec-8085-49bfe3345a29","assignedFrom":"UNIPA","assignedFromLink":null,"submitTo":"Classroom","submitToLink":null,"deadline":"2022-05-14 11:05:02","description":"desc","note":"notes","completed":false}},"courses":{"3db893b5-d247-11ec-8085-49bfe3345a29":{"code":"MK11220002","name":"経営学","electionKind":"required","numberOfCredits":2,"academicYear":2022,"grade":1,"semester":"first","teacherIds":["3db893b5-d247-11ec-8085-49bfe3345a29"]}},"lectures":{"3db893b5-d247-11ec-8085-49bfe3345a29":{"numberOfTimes":10,"date":"2022-05-14"}},"teachers":{"3db893b5-d247-11ec-8085-49bfe3345a29":{"name":"教員太郎"}},"users":{"3db893b5-d247-11ec-8085-49bfe3345a29":{"nickname":"ユーザ太郎"}}}}`);
        } catch {
            console.error('Assignment Loading Error: Failed to parse JSON code.');
            return;
        }

        let assignments = apiResponseToAssignments(toAssignmentStructureApiResponse(response));
        AppDispatcher.dispatch(UiActionCreators.updateAssignments(assignments));
    }

    render() {
        return (
            <div className="App">
                <Header />
                <Body />
                <BottomMenu defaultPageName="AssignmentList" />
            </div>
        );
    }
}

export default App;
