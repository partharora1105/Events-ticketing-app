import * as e from 'express';
import { Query } from 'express-serve-static-core';
import { Types } from 'mongoose';


// **** Misc **** //

export type TAll = string | number | boolean | null | object;
export type Role = "student" | "teacher" | "organizer";

// **** Express **** //

export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IReqQuery<T extends Query, U = void> extends e.Request {
  query: T;
  body: U;
}

interface User {
  email: String;
  password: String;
  role: String;
}


export interface EventRequestBody {
  category?: string,
  name: string,
  start_date: string,
  end_date: string,
  description?: string,
  street_address: string,
  room_number?: number,
  invites_string: string,
  capacity: number,
  coordinates: [number]
}

export interface EventRSVPBody {
  rsvp: RSVPStatus,
  user_id: string
}

export interface EventInviteBody {
  user_id: string
}

export interface LoginRequestBody {
  email: string,
  password: string
}

export interface RegisterRequestBody extends LoginRequestBody {
  role: Role
}

export interface RequestUser {
  user_id: string,
  email: string,
  role: Role
}

export type RSVPStatus = "will_attend" | "maybe" | "will_not_attend" | null