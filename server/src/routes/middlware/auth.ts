import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import EnvVars from "@configurations/EnvVars";
import { RequestUser } from "@declarations/types";

const verifyToken = (req: Request, res: Response , next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(403).json({ error: "A token is required for authentication"});
  }
  try {
    const decoded = jwt.verify(token, EnvVars.jwt.secret) as RequestUser;
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
  return next();
};

export default verifyToken;