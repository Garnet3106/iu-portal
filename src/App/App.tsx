// import logo from './logo.svg';

import React from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import BottomMenu from './BottomMenu/BottomMenu';
import AppDispatcher from '../flux/AppDispatcher';
import { UiActionCreators } from '../flux/UiActionCreators';
import { CourseElectionKind, CourseSemester, PlatformKind } from '../assignment';
import { JsonAssignmentResponce } from '../jsonapi';
import './App.css';

let req = new XMLHttpRequest();

req.addEventListener('load', () => {
    console.log(req.responseText);

    let responce: JsonAssignmentResponce = {
        status: 'ok',
        message: '',
        content: {
            assignments: [
                {
                    id: '3db893b5-d247-11ec-8085-49bfe3345a29',
                    registrar: {
                        id: '3db893b5-d247-11ec-8085-49bfe3345a29',
                        name: '登録者名',
                    },
                    numberOfChecker: 2,
                    course: {
                        id: '3db893b5-d247-11ec-8085-49bfe3345a29',
                        name: '科目名',
                        electionKind: CourseElectionKind.Required,
                        numberOfCredit: 2,
                        year: 2022,
                        grade: 1,
                        semester: CourseSemester.First,
                        teachers: [
                            {
                                id: '3db893b5-d247-11ec-8085-49bfe3345a29',
                                name: '教員名',
                            }
                        ],
                    },
                    lecture: {
                        id: '3db893b5-d247-11ec-8085-49bfe3345a29',
                        name: '講義名',
                    },
                    assignedFrom: {
                        id: '3db893b5-d247-11ec-8085-49bfe3345a29',
                        kind: PlatformKind.Classroom,
                    },
                    submitTo: {
                        id: '3db893b5-d247-11ec-8085-49bfe3345a29',
                        kind: PlatformKind.EMail,
                    },
                    deadline: Date.now(),
                    description: 'desc',
                    note: 'notes',
                },
            ],
        },
    };

    if (responce.status !== 'error') {
        console.error(`Assignment Error: Failed to load assignments. (${responce.message})`);
        return;
    }

    AppDispatcher.dispatch(UiActionCreators.initializeAssignments(responce.content.assignments));
});

req.open('GET', `https://iu-portal.gant.work/api.php?request=${encodeURIComponent(`{"action":"get_asgn"}`)}`);
req.send();

// Initialize UI State.
AppDispatcher.dispatch(UiActionCreators.getDefault());

class App extends React.Component {
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
