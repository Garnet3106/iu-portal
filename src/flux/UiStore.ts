import { ReduceStore } from "flux/utils";
import AppDispatcher from "./AppDispatcher";
import { ActionKind, Actions } from "./AppConstants";
import { Assignment } from "../assignment";
import { Font, Language, SettingValues } from "../App/Body/Settings/Settings";

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
    latestKind: ActionKind,
    currentPage: Page,
    switchPageTo: Page | null,
    assignments: Assignment[],
    previewingAssignmentId: string | null,
    settingValues: SettingValues,
    settingValueListItems: {
        [name: string]: () => void,
    },
};

class UiStore extends ReduceStore<UiState, Actions> {
    getInitialState() {
        return {
            latestKind: ActionKind.InitializeStore,
            currentPage: new Page(0, 'Login'),
            switchPageTo: null,
            assignments: [],
            previewingAssignmentId: null,
            settingValues: {
                language: Language.Japanese,
                font: Font.HpSimplified,
            },
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
            settingValueListItems: action.data.settingValueListItems,
        };
    }
}

export default new UiStore(AppDispatcher);
