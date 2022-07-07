import { UiActions } from "./UiActionCreators";

export type Actions = UiActions;

export enum ActionKind {
    InitializeStore,
    Signin,
    FailToSignin,
    Signout,
    SwitchPage,
    UpdateAssignments,
    UpdatePreviewingAssignment,
    UpdateSettingValues,
    UpdateSettingValueListItems,
    UpdateNotifications,
    ReverseAssignmentCompletion,
}
