import IBase from "./base";

interface IMap extends IBase {
  key: string;
  value: string;
  lat?:string,
  lng?:string
}

export default IMap;
