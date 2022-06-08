// import logo from './logo.svg';

import React from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import BottomMenu from './BottomMenu/BottomMenu';
import AppDispatcher from '../flux/AppDispatcher';
import { UiActionCreators } from '../flux/UiActionCreators';
import { apiResponseToAssignments, JsonApi, JsonApiRequestActionKind, toAssignmentStructureApiResponse } from '../jsonapi';
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

        JsonApi.request(
            {
                actionKind: JsonApiRequestActionKind.GetAssignments,
                parameters: {}
            },
            (req: XMLHttpRequest) => {
                let response;

                try {
                    response = JSON.parse(req.responseText);
                } catch {
                    console.error('Assignment Loading Error: Failed to parse JSON code.');
                    return;
                }

                let assignments = apiResponseToAssignments(toAssignmentStructureApiResponse(response));
                AppDispatcher.dispatch(UiActionCreators.updateAssignments(assignments));
            },
            () => {
                console.error('Assignment Loading Error: Failed to get assignments.');
            },
        );
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
