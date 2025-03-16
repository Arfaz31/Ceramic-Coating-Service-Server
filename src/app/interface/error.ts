export type TErrorSource = {
  path: string | number;
  message: string;
}[]; //Array of path[] same as string[]

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: TErrorSource;
};
