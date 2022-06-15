import React from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import BottomMenu from './BottomMenu/BottomMenu';
import AppDispatcher from '../flux/AppDispatcher';
import { UiActionCreators } from '../flux/UiActionCreators';
import { apiResponseToAssignments, JsonApi, JsonApiRequestActionKind, toAssignmentStructureApiResponse } from '../jsonapi';
import './App.css';

// Initialize UI State.
AppDispatcher.dispatch(UiActionCreators.getDefault());

export function updateAssignments(onUpdate: () => void) {
    const onSucceed = (_req: XMLHttpRequest, response: any) => {
        let assignments = apiResponseToAssignments(toAssignmentStructureApiResponse(response));
        AppDispatcher.dispatch(UiActionCreators.updateAssignments(assignments));
        onUpdate();
    };

    const onFailToAuth = () => {
        alert('このアカウントは利用できません。\n大学用の Google アカウントでログインし直してください。');
    };

    const onFail = () => {
        console.error('Assignment Loading Error: Failed to get assignments.');
    };

    JsonApi.request({
        actionKind: JsonApiRequestActionKind.GetAssignments,
        parameters: {
            includeCompleted: true,
        },
        onSucceed: onSucceed,
        onBadRequest: onFail,
        onFailToAuth: onFailToAuth,
        onError: onFail,
    });
}

class App extends React.Component<{}> {
    constructor(props: {}) {
        super(props);
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
