import { ReduceStore } from "flux/utils";
import AppDispatcher from "./AppDispatcher";
import { ActionKind, Actions } from "./AppConstants";
import { Assignment } from "../App/Body/AssignmentList/AssignmentList";

export class Page {
    index: number;
    name: string;

    constructor(index: number, name: string) {
        this.index = index;
        this.name = name;
    }

    toId(): string {
        return `page_${this.name}_${this.index}`;
    }
}

export class PageSwitch {
    from: Page;
    to: Page;

    constructor(from: Page, to: Page) {
        this.from = from;
        this.to = to;
    }

    isToRight() {
        return this.from.index < this.to.index;
    }
}

export type UiState = {
    currentPage: Page,
    switchPageTo: Page | null,
    hasAssignmentsUpdated: boolean,
    assignments: Assignment[],
    previewingAssignmentId: string | null,
};

class UiStore extends ReduceStore<UiState, Actions> {
    getInitialState() {
        return {
            currentPage: new Page(0, 'AssignmentList'),
            switchPageTo: null,
            hasAssignmentsUpdated: false,
            assignments: [],
            previewingAssignmentId: null,
        };
    }

    reduce(state: UiState, action: Actions) {
        switch (action.type) {
            case ActionKind.PageSwitch: {
                return {
                    currentPage: action.data.currentPage,
                    switchPageTo: action.data.switchPageTo,
                    hasAssignmentsUpdated: action.data.hasAssignmentsUpdated,
                    assignments: action.data.assignments,
                    previewingAssignmentId: action.data.previewingAssignmentId,
                };
            }
            default: {
                return state;
            }
        }
    }
}

export default new UiStore(AppDispatcher);
