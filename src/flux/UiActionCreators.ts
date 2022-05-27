import { ActionKind } from "./AppConstants";
import UiStore, { Page } from './UiStore';
import { Assignment } from "../assignment";
import { Font, Language, SettingValues } from "../App/Body/Settings/Settings";

export type UiActionPayload = {
    type: ActionKind.PageSwitch,
    data: {
        currentPage: Page,
        switchPageTo: Page | null,
        hasAssignmentsUpdated: boolean,
        assignments: Assignment[],
        previewingAssignmentId: string | null,
        hasSettingValuesUpdated: boolean,
        settingValues: SettingValues,
        settingValueListItems: {
            [name: string]: () => void,
        },
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
                currentPage: new Page(0, 'Login'),
                switchPageTo: null,
                hasAssignmentsUpdated: false,
                assignments: [],
                previewingAssignmentId: null,
                hasSettingValuesUpdated: false,
                settingValues: {
                    language: Language.Japanese,
                    font: Font.HpSimplified,
                },
                settingValueListItems: {},
            },
        };
    },

    initializeAssignments(assignments: Assignment[]): UiActions {
        let defaultAction = this.getDefault();
        defaultAction.data.hasAssignmentsUpdated = true;
        defaultAction.data.assignments = assignments;
        return defaultAction;
    },

    updateAssignments(assignments: Assignment[]): UiActions {
        let action = this.getCurrent();
        action.data.hasAssignmentsUpdated = true;
        action.data.assignments = assignments;
        return action;
    },

    // Set `hasAssignmentsUpdated` value because it's basically false.
    getCurrent(): UiActions {
        let action = UiStore.getState();
        action.hasAssignmentsUpdated = false;
        action.hasSettingValuesUpdated = false;

        return {
            type: ActionKind.PageSwitch,
            data: action,
        };
    },

    updateSettingValues(values: SettingValues): UiActions {
        let action = this.getCurrent();
        action.data.settingValues = values;
        action.data.hasSettingValuesUpdated = true;
        return action;
    },

    updateSettingValueList(values: {
        [name: string]: () => void,
    }): UiActions {
        let action = this.getCurrent();
        action.data.settingValueListItems = values;
        return action;
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
        action.data.switchPageTo = new Page(2, 'AssignmentPreview');
        action.data.previewingAssignmentId = assignmentId;
        return action;
    },
};
