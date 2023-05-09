import { message } from "antd";
import { IRequestHandler } from "../../constant/api/request";
import Handler from "../../utils/handler";

const CallAction = (
  api: Promise<any>,
  onRequested?: () => any,
  onSuccess?: (data: any) => any,
  onFailed?: (
    message: string,
    code?: Array<number>,
    status?: Array<number>
  ) => any
) => {
  const r: IRequestHandler = {
    onRequested,
    onSuccess,
    onFailed: (msg, code, status) => {
      if (onFailed) onFailed(msg, code, status);
    },
  };
  return Handler(api, r);
};

export default {
  CallAction,
};
