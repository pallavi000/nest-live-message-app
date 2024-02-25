import { Request } from 'express';

export interface IExpressUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface IExpressRequest extends Request {
  user: IExpressUser;
}
