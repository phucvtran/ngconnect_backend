import jwt from "jsonwebtoken";
import config from "../config/config";
import User from "../models/User";
import { RefreshToken } from "../models/RefreshToken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY + "";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET + "";
const TOKEN_EXPIRATION_TIME = "2h";
const REFRESH_TOKEN_EXPIRATION_TIME = "7d";

const signJWT = (
  user: User,
  callback: (
    error: Error | null,
    token: string | null,
    refreshToken: string | null
  ) => void
): void => {
  try {
    jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET_KEY,
      {
        algorithm: "HS256",
        expiresIn: TOKEN_EXPIRATION_TIME,
      },
      async (error, token) => {
        if (error) {
          callback(error, null, null);
        } else if (token) {
          const refreshToken = jwt.sign(
            {
              id: user.id,
              email: user.email,
              role: user.role,
            },
            REFRESH_TOKEN_SECRET,
            {
              algorithm: "HS256",
              expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
            }
          );
          // Save refresh token in the database
          await RefreshToken.create({ token: refreshToken, userId: user.id });

          callback(null, token, refreshToken);
        }
      }
    );
  } catch (error: any) {
    callback(error, null, null);
  }
};

export default signJWT;
