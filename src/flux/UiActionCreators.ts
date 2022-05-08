import AppDispatcher from "./AppDispatcher";
import { ActionKind } from "./AppConstants";
import { PageSwitch } from './UiStore';
import { Assignment } from "../App/Body/AssignmentList/AssignmentList";

const getPageSwitch = () => {
    return {
        type: ActionKind.PageSwitch as ActionKind.PageSwitch,
        data: {
            pageSwitch: null as PageSwitch | null,
            hasAssignmentsUpdated: false,
            assignments: [] as Assignment[],
        },
    };
};

export type UiActions = ReturnType<
    typeof getPageSwitch
>;

export const UiActionCreators = {
    actionCreator001() {
        AppDispatcher.dispatch(getPageSwitch());
    },
};
