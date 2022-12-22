import { Router, Request } from 'express';
import Event from '@models/Event';
import User from '@models/User';
import { EventRequestBody, LoginRequestBody, RegisterRequestBody } from "@declarations/types";
import { body, validationResult } from 'express-validator';
import {  } from '@declarations/types';
import HttpStatusCodes from '@configurations/HttpStatusCodes';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import EnvVars from '@configurations/EnvVars';
import verifyToken from './middlware/auth';

// **** Init **** //

const authRouter = Router();

authRouter.get('/currUser', verifyToken, async (req: Request, res, next) => {
  return res.status(HttpStatusCodes.OK).json({data: req.user})
})

// Register
authRouter.post('/register', async (req, res, next) => {
  try {
    const requestBody: RegisterRequestBody = req.body.data;
    const { email } = requestBody;
    // check if user already exist
    // Validate if user exist in our database
    if (await User.emailAlreadyTaken(email)) {
      return res.status(HttpStatusCodes.CONFLICT).json({error: "Email already taken"});
    }

    const registeredUser = await User.registerUser(requestBody);

    return res.status(HttpStatusCodes.CREATED).json({
      data: registeredUser
    })
  } catch (e) {
    return next(e);
  }
});

// Login
authRouter.post('/login', async (req, res, next) => {
  try {
    const requestBody: LoginRequestBody | undefined = req.body?.data;
    if (!requestBody) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({error: "No data property"});
    }
    const { email, password } = requestBody;
    if (!email && !password) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({error: "Email and password field required"});
    }
    
    // Validate if user exist in our database
    const user = await User.getUserByEmail(email);
    if (!user || !user.correctPassword(password)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({error: "Invalid credentials"});
    }

    // Login user
    const userWithJWT = User.loginUser(user)

    // Create user in our database
    return res.status(HttpStatusCodes.OK).json({
      data: userWithJWT
    })
  } catch (e) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({error: "Bad request"});
  }
});
// **** Export default **** //

export default authRouter;
