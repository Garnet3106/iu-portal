import { ActionKind } from "./AppConstants";
import UiStore, { Page } from './UiStore';
import { Assignment } from "../assignment";

export type UiActionPayload = {
    type: ActionKind.PageSwitch,
    data: {
        currentPage: Page,
        switchPageTo: Page | null,
        hasAssignmentsUpdated: boolean,
        assignments: Assignment[],
        previewingAssignmentId: string | null,
    },
};

export type UiActions = ReturnType<
    () => UiActionPayload
>;

export const UiActionCreators = {
    getDefault(): UiActions {
        return {
            type: ActionKind.PageSwitch,
            data: {
                currentPage: new Page(0, 'AssignmentList'),
                switchPageTo: null,
                hasAssignmentsUpdated: false,
                assignments: [],
                previewingAssignmentId: null,
            },
        };
    },

    initializeAssignments(assignments: Assignment[]): UiActions {
        let defaultAction = this.getDefault();
        defaultAction.data.hasAssignmentsUpdated = true;
        defaultAction.data.assignments = assignments;
        return defaultAction;
    },

    // Set `hasAssignmentsUpdated` value because it's basically false.
    getCurrent(): UiActions {
        let action = UiStore.getState();
        action.hasAssignmentsUpdated = false;

        return {
            type: ActionKind.PageSwitch,
            data: action,
        };
    },

    updateSwitchTargetPage(switchPageTo: Page | null): UiActions {
        let action = this.getCurrent();
        action.data.switchPageTo = switchPageTo;
        return action;
    },

    updateCurrentPage(switchPageTo: Page): UiActions {
        let action = this.getCurrent();
        action.data.currentPage = switchPageTo;
        action.data.switchPageTo = null;
        return action;
    },

    previewAssignment(assignmentId: string): UiActions {
        let action = this.getCurrent();
        action.data.switchPageTo = new Page(1, 'AssignmentPreview');
        action.data.previewingAssignmentId = assignmentId;
        return action;
    },
};
