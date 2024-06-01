export type ObjectResult<T = null> = {
  status: ResultStatus;
  errorsMessages?: ErrorsType | string;
  data: T;
};
export type ErrorsType = {
  errorsMessages: ErrorType[];
};
export type ErrorType = { field: string; message: string };

export enum ResultStatus {
  Success = 'success',
  // Created = 'created',
  // NoContent = 'no content',
  NotFound = 'not found',
  Forbidden = 'forbidden',
  BadRequest = 'bad request',
  Unauthorized = 'unauthorized',
  SomethingWasWrong = 'something was wrong',
}
