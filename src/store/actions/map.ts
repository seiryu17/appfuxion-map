import { action } from "typesafe-actions";
import { AnyAction, Dispatch } from "redux";
import ActionTypes from "../../constant/action-types";
import Base from "./base";
import Api from "../api";
import GROUP_MAP from "../../constant/group-map";
import IHistory from "../../interfaces/models/map";
import ILocation from "../../interfaces/models/location";

const AddHistory =
  (data: IHistory, type?: GROUP_MAP.HISTORY) =>
  (dispatch: Dispatch<AnyAction>) => {
    dispatch(action(ActionTypes.Map.ADD_SELECTED_HISTORY, { data, type }));
  };

const ClearListPlaces =
  (type?: GROUP_MAP.LIST_SUGGESTED) => (dispatch: Dispatch<AnyAction>) => {
    dispatch(action(ActionTypes.Map.CLEAR_LIST_PLACES, { type }));
  };

const AddDummyToListPlaces =
  (list: any, type?: GROUP_MAP.LIST_SUGGESTED) =>
  (dispatch: Dispatch<AnyAction>) => {
    const data = list.predictions;
    dispatch(action(ActionTypes.Map.ADD_DUMMY_TO_REDUX, { list: data, type }));
  };

const GetLangLat = (place_id: string) => (dispatch: Dispatch<AnyAction>) => {
  return Base.CallAction(
    Api.Map.GetLangLat(place_id),
    () => dispatch(action(ActionTypes.Map.GET_LAT_LANG_REQUEST)),
    (res) => {
      const location = res.result.geometry.location;
      dispatch(
        action(ActionTypes.Map.GET_LAT_LANG_SUCCESS, { data: location })
      );
    },
    (err) =>
      dispatch(
        action(ActionTypes.Map.GET_LAT_LANG_FAILED, {
          err,
        })
      )
  );
};

const SetLangLat =
  (location: ILocation) =>
  (dispatch: Dispatch<AnyAction>) => {
    dispatch(
      action(ActionTypes.Map.GET_LAT_LANG_SUCCESS, { data: location })
    );
  };

const GetListPlaces =
  (input: string, type?: GROUP_MAP.LIST_SUGGESTED) =>
  (dispatch: Dispatch<AnyAction>) => {
    return Base.CallAction(
      Api.Map.GetListPlaces(input),
      () =>
        dispatch(
          action(ActionTypes.Map.ADD_SUGGESTED_LIST_REQUEST, {
            type,
          })
        ),
      (res) => {
        const list = res.predictions;
        dispatch(
          action(ActionTypes.Map.ADD_SUGGESTED_LIST_SUCCESS, {
            list,
            type,
          })
        );
      },
      (err) =>
        dispatch(
          action(ActionTypes.Map.ADD_SUGGESTED_LIST_FAILED, {
            err,
            type,
          })
        )
    );
  };

export default {
  AddHistory,
  ClearListPlaces,
  AddDummyToListPlaces,
  GetLangLat,
  SetLangLat,
  GetListPlaces,
};
