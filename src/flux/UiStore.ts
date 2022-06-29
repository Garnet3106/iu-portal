import { ReduceStore } from "flux/utils";
import AppDispatcher from "./AppDispatcher";
import { ActionKind, Actions } from "./AppConstants";
import { Assignment } from "../assignment";
import { Font, Language, SettingValues } from "../App/Body/Settings/Settings";
import Page, { defaultPage } from "../page";

export type UiState = {
    latestKind: ActionKind,
    currentPage: Page,
    switchPageTo: Page | null,
    assignments: Assignment[],
    previewingAssignmentId: string | null,
    settingValues: SettingValues,
    focusedListItemIndex: number | null,
    settingValueListItems: {
        [name: string]: () => void,
    },
};

class UiStore extends ReduceStore<UiState, Actions> {
    getInitialState() {
        return {
            latestKind: ActionKind.InitializeStore,
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
        };
    }

    reduce(_state: UiState, action: Actions) {
        return {
            latestKind: action.kind,
            currentPage: action.data.currentPage,
            switchPageTo: action.data.switchPageTo,
            assignments: action.data.assignments,
            previewingAssignmentId: action.data.previewingAssignmentId,
            settingValues: action.data.settingValues,
            focusedListItemIndex: action.data.focusedListItemIndex,
            settingValueListItems: action.data.settingValueListItems,
        };
    }
}

export default new UiStore(AppDispatcher);
