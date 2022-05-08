import AppDispatcher from "./AppDispatcher";
import { ActionKind } from "./AppConstants";
import { ComponentSwitch } from './UiStore';
import { Assignment } from "../App/Body/AssignmentList/AssignmentList";

const getComponentSwitch = () => {
    return {
        type: ActionKind.ComponentSwitch as ActionKind.ComponentSwitch,
        data: {
            componentSwitch: null as ComponentSwitch | null,
            hasAssignmentsUpdated: false,
            assignments: [] as Assignment[],
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
