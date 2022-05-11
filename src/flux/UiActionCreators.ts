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
        return {
            type: ActionKind.PageSwitch,
            data: {
                currentPage: new Page(0, 'AssignmentList'),
                switchPageTo: null,
                // Change to false when set assinments empty array.
                hasAssignmentsUpdated: true,
                assignments: [
                    {
                        id: 'aida',
                        checkerNumber: '3人',
                        subjectName: '経営学aa',
                        teacherName: '〇〇教員',
                        assignedFrom: 'Classroom',
                        submitTo: 'Eメール',
                        deadline: '今週金曜日まで',
                        description: '講義の感想と自分の考えを 200 字以上で書く',
                        note: '補足情報はありません',
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
