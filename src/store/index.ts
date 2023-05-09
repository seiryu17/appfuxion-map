import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";

import { rootReducer } from "./reducers";

const middlewares: Array<any> = [thunkMiddleware, createLogger()];
const initStore = (initial = {}) => {
  return createStore(rootReducer, initial, applyMiddleware(...middlewares));
};

export const wrapper = createWrapper(initStore);
