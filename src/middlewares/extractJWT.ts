import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpError";

const SECRET_KEY = process.env.JWT_SECRET_KEY + "";

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, SECRET_KEY, (error, decoded) => {
      if (error) {
        throw new HttpError(
          HttpError.FORBIDDEN_CODE,
          HttpError.FORBIDDEN_DESCRIPTION,
          "Restricted permission or session expired"
        );
      } else {
        res.locals.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default extractJWT;
