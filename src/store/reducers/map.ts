import { Reducer } from "redux";
import ActionTypes from "../../constant/action-types";
import BaseStateDefault from "../../constant/state";
import IMapState from "../../interfaces/states/map";

const initialState: IMapState = {
  ...BaseStateDefault,
  groupedList: {},
} as any;

const reducer: Reducer<any> = (
  state: IMapState = initialState,
  action: any
): IMapState => {
  switch (action.type) {
    case ActionTypes.Map.ADD_SUGGESTED_LIST_REQUEST: {
      if (action.payload?.type) {
        state.groupedList[action.payload?.type] = {
          ...state.groupedList[action.payload?.type],
          requesting: true,
          error: undefined,
        };

        return {
          ...state,
        };
      }
      return {
        ...state,
        requesting: true,
        error: undefined,
      };
    }
    case ActionTypes.Map.ADD_DUMMY_TO_REDUX:
    case ActionTypes.Map.ADD_SUGGESTED_LIST_SUCCESS: {
      const { list } = action.payload;
      if (action.payload?.type) {
        state.groupedList[action.payload?.type] = {
          ...state.groupedList[action.payload?.type],
          list,
          requesting: false,
        };

        return {
          ...state,
        };
      }
      return {
        ...state,
        list,
        requesting: false,
      };
    }
    case ActionTypes.Map.ADD_SUGGESTED_LIST_FAILED: {
      const { error } = action.payload;
      if (action.payload?.type) {
        if (!state.groupedList[action.payload?.type]) {
          state.groupedList[action.payload?.type] = {
            list: [],
            requesting: false,
          };
        }
        state.groupedList[action.payload?.type] = {
          ...state.groupedList[action.payload?.type],
          requesting: false,
          error: error,
        };

        return {
          ...state,
        };
      }
      return {
        ...state,
        requesting: false,
        error,
      };
    }
    case ActionTypes.Map.ADD_SELECTED_HISTORY: {
      const { data } = action.payload;
      if (action.payload?.type) {
        if (!state.groupedList[action.payload?.type]) {
          state.groupedList[action.payload?.type] = {
            list: [],
            requesting: false,
          };
        }
        state.groupedList[action.payload?.type].list?.unshift(data);
        state.groupedList[action.payload?.type] = {
          ...state.groupedList[action.payload?.type],
          requesting: false,
        };

        return {
          ...state,
        };
      }
    }
    case ActionTypes.Map.CLEAR_LIST_PLACES: {
      if (action.payload?.type) {
        if (!state.groupedList[action.payload?.type]) {
          state.groupedList[action.payload?.type] = {
            list: [],
            requesting: false,
          };
        }
        state.groupedList[action.payload?.type] = {
          ...state.groupedList[action.payload?.type],
          list: [],
          requesting: false,
        };

        return {
          ...state,
        };
      }
    }
    case ActionTypes.Map.GET_LAT_LANG_REQUEST: {
      return {
        ...state,
        requesting: true,
        error: undefined,
      };
    }
    case ActionTypes.Map.GET_LAT_LANG_SUCCESS: {
      const { data } = action.payload;
      return {
        ...state,
        requesting: false,
        data,
      };
    }
    case ActionTypes.Map.GET_LAT_LANG_FAILED: {
      const { error } = action.payload;
      return {
        ...state,
        requesting: false,
        error,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
