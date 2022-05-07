import { Dispatcher } from "flux";
import { Actions } from "./AppConstants";

class AppDispatcher extends Dispatcher<Actions> {
    dispatch(action: Actions) {
        super.dispatch(action);
    }
}

export default new AppDispatcher();
