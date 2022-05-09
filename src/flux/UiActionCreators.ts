import AppDispatcher from "./AppDispatcher";
import { ActionKind } from "./AppConstants";
import { Page } from './UiStore';
import { Assignment } from "../App/Body/AssignmentList/AssignmentList";

const getPageSwitch = () => {
    return {
        type: ActionKind.PageSwitch as ActionKind.PageSwitch,
        data: {
            currentPage: new Page(0, 'AssignmentList'),
            switchPageTo: null as Page | null,
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
