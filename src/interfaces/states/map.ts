import IMap from "../models/map";
import IBaseState from "./base";

interface IMapState extends IBaseState<IMap> {
  groupedList: {
    [key: string]: IBaseState<IMap>;
  };
}
export default IMapState;
