import { ActionKind } from "./AppConstants";
import UiStore from './UiStore';
import { Assignment } from "../assignment";
import { Font, Language, SettingValues } from "../App/Body/Settings/Settings";
import Page, { defaultPage, pageList } from "../page";
import Notification from "../notification";

export type UiActionPayload = {
    kind: ActionKind,
    data: {
        hasSignedIn: boolean,
        currentPage: Page,
        switchPageTo: Page | null,
        assignments: Assignment[],
        previewingAssignmentId: string | null,
        settingValues: SettingValues,
        focusedListItemIndex: number | null,
        settingValueListItems: {
            [name: string]: () => void,
        },
        notifications: Notification[],
    },
};

export type UiActions = ReturnType<
    () => UiActionPayload
>;

export const UiActionCreators = {
    getDefault(): UiActions {
        return {
            kind: ActionKind.InitializeStore,
            data: {
                hasSignedIn: false,
                currentPage: defaultPage,
                switchPageTo: null,
                assignments: [],
                previewingAssignmentId: null,
                settingValues: {
                    language: Language.Japanese,
                    font: Font.HpSimplified,
                },
                focusedListItemIndex: null,
                settingValueListItems: {},
                notifications: [],
            },
        };
    },

    updateAssignments(assignments: Assignment[]): UiActions {
        let action = this.getCurrent(ActionKind.UpdateAssignments);
        action.data.assignments = assignments;
        return action;
    },

    getCurrent(kind: ActionKind): UiActions {
        let action = UiStore.getState();

        return {
            kind: kind,
            data: action,
        };
    },

    signin(): UiActions {
        let action = this.getCurrent(ActionKind.Signin);
        action.data.hasSignedIn = true;
        return action;
    },

    signout(): UiActions {
        let action = this.getCurrent(ActionKind.Signout);
        action.data.hasSignedIn = false;
        return action;
    },

    updateSettingValues(values: SettingValues): UiActions {
        let action = this.getCurrent(ActionKind.UpdateSettingValues);
        action.data.settingValues = values;
        return action;
    },

    updateSettingValueList(focusedListItemIndex: number, values: {
        [name: string]: () => void,
    }): UiActions {
        let action = this.getCurrent(ActionKind.UpdateSettingValueListItems);
        action.data.focusedListItemIndex = focusedListItemIndex;
        action.data.settingValueListItems = values;
        return action;
    },

    updateSwitchTargetPage(switchPageTo: Page | null): UiActions {
        let action = this.getCurrent(ActionKind.SwitchPage);
        action.data.switchPageTo = switchPageTo;
        return action;
    },

    updateCurrentPage(switchPageTo: Page): UiActions {
        let action = this.getCurrent(ActionKind.SwitchPage);
        action.data.currentPage = switchPageTo;
        action.data.switchPageTo = null;
        return action;
    },

    previewAssignment(assignmentId: string): UiActions {
        let action = this.getCurrent(ActionKind.UpdatePreviewingAssignment);
        action.data.switchPageTo = pageList['AssignmentPreview'];
        action.data.previewingAssignmentId = assignmentId;
        return action;
    },

    reverseAssignmentCompletion(assignmentId: string): UiActions {
        let action = this.getCurrent(ActionKind.ReverseAssignmentCompletion);

        action.data.assignments.some((eachAssignment: Assignment) => {
            if (eachAssignment.id === assignmentId) {
                eachAssignment.completed = !eachAssignment.completed;
                return true;
            }

            return false;
        });

        return action;
    },

    updateNotifications(notifications: Notification[]): UiActions {
        let action = this.getCurrent(ActionKind.UpdateNotifications);
        action.data.notifications = notifications;
        return action;
    },
};
