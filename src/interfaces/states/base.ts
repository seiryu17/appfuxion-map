interface IBaseState<T> {
  data?: T | undefined;
  list?: Array<T>;
  requesting: boolean;
  error?: string;
  code?: Array<number>;
}

export default IBaseState;
