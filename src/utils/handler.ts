import { IRequestHandler } from "../constant/api/request";

const Handler = (api: Promise<any>, r: IRequestHandler) => {
  if (r.onRequested) r.onRequested();
  return api
    .then((response) => {
      if (response.status === 200) {
        if (r.onSuccess) r.onSuccess(response.data);
      } else {
        throw new Error(
          response.data?.errors?.map((x: any) => x.message).join(",")
        );
      }
      return response;
    })
    .catch((error: any) => {
      const err =
        error.response?.data?.errors?.map((x: any) => x.message).join(",") ||
        error.message ||
        error;
      const code = error.response?.data?.errors?.map((x: any) => x.code);
      const status = error.response?.data?.errors?.map((x: any) => x.status);
      if (r.onFailed) r.onFailed(err, code, status);
      return error;
    });
};

export default Handler;
