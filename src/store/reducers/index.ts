import { combineReducers } from "redux";
import IMapState from "../../interfaces/states/map";
import map from "./map";

export interface ReduxState {
  map: IMapState;
}

export const rootReducer = combineReducers<ReduxState>({
  map,
});
