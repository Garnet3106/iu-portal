import { ReduceStore } from "flux/utils";
import AppDispatcher from "./AppDispatcher";
import { ActionKind, Actions } from "./AppConstants";
import { Assignment } from "../App/Body/AssignmentList/AssignmentList";

export class PageSwitch {
    from: string;
    to: string;

    constructor(from: string, to: string) {
        this.from = from;
        this.to = to;
    }

    isToRight(): boolean {
        return this.from < this.to;
    }
}

type UiState = {
    pageSwitch: PageSwitch | null,
    hasAssignmentsUpdated: boolean,
    assignments: Assignment[],
};

class UiStore extends ReduceStore<UiState, Actions> {
    getInitialState() {
        return {
            pageSwitch: null,
            hasAssignmentsUpdated: false,
            assignments: [],
        };
    }

    reduce(state: UiState, action: Actions) {
        switch (action.type) {
            case ActionKind.PageSwitch: {
                return {
                    pageSwitch: action.data.pageSwitch,
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
