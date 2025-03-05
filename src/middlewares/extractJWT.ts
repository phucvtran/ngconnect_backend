import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";

const SECRET_KEY = process.env.JWT_SECRET_KEY + "";

/**
 * JWT user Token
 * @param req
 * @param res
 * @param next
 * @returns
 */
const extractJWT = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, SECRET_KEY, (error, decoded) => {
      if (error) {
        if (error?.message === "jwt expired") {
          return res.status(401).json({
            message: "Token expired!",
          });
        }
        throw new HttpError(
          HttpError.UNAUTHORIZED_CODE,
          HttpError.UNAUTHORIZED_DESCRIPTION,
          "Session expired"
        );
      } else {
        res.locals.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: "Access token is missing",
    });
  }
};

export default extractJWT;
