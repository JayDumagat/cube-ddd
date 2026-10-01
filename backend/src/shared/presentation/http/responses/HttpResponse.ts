export interface HttpSuccessResponse<T> {
  data: T;
}

export interface HttpSuccessResponseWithMeta<T, TMeta> {
  data: T;
  meta: TMeta;
}

export interface HttpErrorResponse {
  error: {
    message: string;
    details?: unknown;
  };
}