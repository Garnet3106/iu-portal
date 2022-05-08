import { ReduceStore } from "flux/utils";
import AppDispatcher from "./AppDispatcher";
import { ActionKind, Actions } from "./AppConstants";
import { Assignment } from "../App/Body/AssignmentList/AssignmentList";

export class ComponentSwitch {
    from: number;
    to: number;

    constructor(from: number, to: number) {
        this.from = from;
        this.to = to;
    }

    isToRight(): boolean {
        return this.from < this.to;
    }
}

type UiState = {
    componentSwitch: ComponentSwitch | null,
    hasAssignmentsUpdated: boolean,
    assignments: Assignment[],
};

class UiStore extends ReduceStore<UiState, Actions> {
    getInitialState() {
        return {
            componentSwitch: null,
            hasAssignmentsUpdated: false,
            assignments: [],
        };
    }

    reduce(state: UiState, action: Actions) {
        switch (action.type) {
            case ActionKind.ComponentSwitch: {
                return {
                    componentSwitch: action.data.componentSwitch,
                    hasAssignmentsUpdated: action.data.hasAssignmentsUpdated,
                    assignments: action.data.assignments,
                };
            }
            default: {
                return state;
            }
        }
    }
}

export default new UiStore(AppDispatcher);
