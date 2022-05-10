import { ActionKind } from "./AppConstants";
import UiStore, { Page } from './UiStore';
import { Assignment } from "../App/Body/AssignmentList/AssignmentList";

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
        /* This is hidden while debugging.
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
        */

        return {
            type: ActionKind.PageSwitch,
            data: {
                currentPage: new Page(0, 'AssignmentList'),
                switchPageTo: null,
                hasAssignmentsUpdated: true,
                assignments: [
                    {
                        id: 'aida',
                        subjectName: '経営学aa',
                        teacherName: '〇〇教員',
                        deadline: '今週金曜日まで',
                    },
                ],
                previewingAssignmentId: null,
            },
        };
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
