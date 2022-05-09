import { Dispatcher } from "flux";
import { Actions } from "./AppConstants";

class AppDispatcher extends Dispatcher<Actions> {
    dispatch(action: Actions) {
        setTimeout(() => {
            super.dispatch(action);
        }, 0);
    }
}

export default new AppDispatcher();
