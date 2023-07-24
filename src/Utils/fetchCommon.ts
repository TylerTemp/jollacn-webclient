export const ENDPOINT = '/api';

export type ResponseTransformFunc<T> = (response: Response) => Promise<T>;
