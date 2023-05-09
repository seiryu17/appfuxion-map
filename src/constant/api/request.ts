export interface IRequestHandler {
  onRequested?: () => void;
  onSuccess?: (data: any) => void;
  onFailed?: (
    message: string,
    code?: Array<number>,
    status?: Array<number>
  ) => void;
}

export interface IRequest extends IRequestHandler {}
