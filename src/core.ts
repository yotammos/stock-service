export interface HttpError extends Error {
  readonly message: string;
  readonly httpStatusCode: number;
}
