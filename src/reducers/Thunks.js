import { useReducer } from "react";

export function useThunkReducer(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enchancedDispatch = (action) => {
    if (typeof action === "function") {
      action(dispatch);
    } else {
      dispatch(action);
    }
  };

  return [state, enchancedDispatch];
}

export const javascriptBooks = (dispatch) => {};
