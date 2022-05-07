import { ReduceStore } from "flux/utils";
import AppDispatcher from "./AppDispatcher";

import { ActionKind, Actions } from "./AppConstants";

export class ComponentSwitch {
    from: number;
    to: number;

    constructor(from: number, to: number) {
        this.from = from;
        this.to = to;
    }

    isToRight(): boolean {
        return this.from < this.to;
    }
}

type UiState = {
    componentSwitch: ComponentSwitch | null,
};

class UiStore extends ReduceStore<UiState, Actions> {
    latestComponent: number;

    constructor(dispatcher: typeof AppDispatcher) {
        super(dispatcher);
        this.latestComponent = 0;
    }

    getInitialState() {
        return {
            componentSwitch: null,
        };
    }

    reduce(state: UiState, action: Actions) {
        switch (action.type) {
            case ActionKind.ComponentSwitch: {
                return {
                    componentSwitch: action.data.componentSwitch,
                };
            }
            default: {
                return state;
            }
        }
    }
}

export default new UiStore(AppDispatcher);
