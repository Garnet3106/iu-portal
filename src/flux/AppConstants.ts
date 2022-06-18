import { UiActions } from "./UiActionCreators";

export type Actions = UiActions;

export enum ActionKind {
    InitializeStore,
    SwitchPage,
    UpdateAssignments,
    UpdatePreviewingAssignment,
    UpdateSettingValues,
    UpdateSettingValueListItems,
    ReverseAssignmentCompletion,
}
