import { Status } from '../HTTP/status';

export type ErrorType = { message: string };

export type ErrorHandler = { message: string, http: Status };
