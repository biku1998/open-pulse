import { Request as ExpressRequest } from 'express';

type Token = {
  id: string;
  createdBy: string;
};

export type Request = ExpressRequest & Record<'token', Token>;
