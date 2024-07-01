import { Request } from 'express';

export type RequestType<P, B, Q> = Request<P, {}, B, Q> & {
  user?: { userId: string; login: string };
};
