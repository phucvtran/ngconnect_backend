import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";
import { RefreshToken } from "../models/RefreshToken";
import signJWT from "../middlewares/signJWT";
import { HttpError } from "../utils/httpError";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY + "";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET + "";
const TOKEN_EXPIRATION_TIME = "2h"; // the access token default expiration time is 2 hour

/**
 * Create user,
 * @param req
 * @param res
 * @param next
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let requestBody: User = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(requestBody.password, salt);

  requestBody.password = hash;
  try {
    await User.create(requestBody);
    res
      .status(201)
      .json({ message: HttpError.HTTP_MESSAGE.SUCCESS_CREATE_USER });
  } catch (error) {
    next(error);
  }
};

/**
 * user login, generate acess token (2 hours) and refresh token (7 days).
 * @param req username and password
 * @param res
 * @param next
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      throw new HttpError(
        HttpError.NOT_FOUND_CODE,
        HttpError.NOT_FOUND_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_USER_NOT_FOUND
      );
    } else {
      const isValidUser = await bcrypt.compare(password, user.password);

      if (!isValidUser) {
        throw new HttpError(
          HttpError.UNAUTHORIZED_CODE,
          HttpError.UNAUTHORIZED_DESCRIPTION,
          HttpError.HTTP_MESSAGE.ERROR_INVALID_PASSWORD
        );
      }

      // generate access token and refresh token for the user.
      signJWT(user, (err, token, refreshToken) => {
        if (err) {
          throw new HttpError(
            HttpError.UNAUTHORIZED_CODE,
            HttpError.UNAUTHORIZED_DESCRIPTION,
            HttpError.HTTP_MESSAGE.ERROR_JWT_SIGN_TOKEN
          );
        } else if (token) {
          return res.status(200).json({
            message: HttpError.HTTP_MESSAGE.SUCCESS_LOGIN,
            token: { accessToken: token, refreshToken: refreshToken },
            user: user,
          });
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token, if the access token is expire and refresh token is valid. generate new access token for user.
 * @param req refresh token
 * @param res new access token
 * @param next
 * @returns
 */
export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;
    //check if refresh token is valid
    if (!refreshToken) {
      throw new HttpError(
        HttpError.BAD_REQUEST_CODE,
        HttpError.BAD_REQUEST_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_MISSING_REFRESH_TOKEN
      );
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    ) as jwt.JwtPayload;

    // Check if refresh token exists in the database
    const storedToken = await RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!storedToken) {
      throw new HttpError(
        HttpError.FORBIDDEN_CODE,
        HttpError.FORBIDDEN_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_INVALID_REFRESH_TOKEN
      );
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
      JWT_SECRET_KEY,
      { expiresIn: TOKEN_EXPIRATION_TIME }
    );

    return res.status(200).json({
      message: HttpError.HTTP_MESSAGE.SUCCESS_REFRESH_ACCESS_TOKEN,
      accessToken,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Logout, clear refresh token
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new HttpError(
        HttpError.BAD_REQUEST_CODE,
        HttpError.BAD_REQUEST_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_LOGOUT_REFRESH_TOKEN_MISSING
      );
    }

    // Check if the refresh token exists in the database
    const token = await RefreshToken.findOne({
      where: { token: refreshToken },
    });

    if (!token) {
      throw new HttpError(
        HttpError.NOT_FOUND_CODE,
        HttpError.NOT_FOUND_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_INVALID_TOKEN
      );
    }

    // Delete the token from the database
    await token.destroy();

    return res
      .status(200)
      .json({ message: HttpError.HTTP_MESSAGE.SUCCESS_LOGOUT });
  } catch (error) {
    next(error);
  }
};

// Note: these API is for user management, the app doesn't have admin portal a this point.

// export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await User.findAll({
//       attributes: { exclude: ["password"] }, // Exclude sensitive fields
//     });
//     res.status(200).json(users);
//   } catch (err) {
//     next(err); // Pass errors to middleware
//   }
// };

// export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findByPk(id, {
//       attributes: { exclude: ["password"] },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (err) {
//     next(err); // Pass errors to middleware
//   }
// };

// export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params;
//     const { username, email } = req.body;

//     const user = await User.findByPk(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     await user.update({ username, email });

//     res.status(200).json({ message: "User updated successfully", user });
//   } catch (err) {
//     next(err); // Pass errors to middleware
//   }
// };

// export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findByPk(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     await user.destroy();
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (err) {
//     next(err); // Pass errors to middleware
//   }
// };
