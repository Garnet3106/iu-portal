import AppDispatcher from "./AppDispatcher";
import { ActionKind } from "./AppConstants";
import { ComponentSwitch } from './UiStore';

const getComponentSwitch = () => {
    return {
        type: ActionKind.ComponentSwitch as ActionKind.ComponentSwitch,
        data: {
            componentSwitch: null as ComponentSwitch | null,
        },
    };
};

export type UiActions = ReturnType<
    typeof getComponentSwitch
>;

export const UiActionCreators = {
    actionCreator001() {
        AppDispatcher.dispatch(getComponentSwitch());
    },
};
