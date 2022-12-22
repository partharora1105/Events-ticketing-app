import { User } from '@declarations/types';
import 'express';


// **** Declaration Merging **** //

declare module 'express' {

  export interface Request {
    signedCookies: Record<string, string>;
    user?: RequestUser
  }
}
