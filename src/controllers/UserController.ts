import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcryptjs';

import User from "../models/User";
import signJWT from "../middlewares/signJWT";
import { HttpError } from "../utils/httpError";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    let requestBody:User = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(requestBody.password, salt);

    requestBody.password = hash;
    try {
        await User.create(requestBody)
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        next(error)
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    let {email, password} = req.body;

    try {
        let user = await User.findOne({ where: { email } });

        if(!user){
            throw new HttpError(HttpError.NOT_FOUND_CODE, HttpError.NOT_FOUND_DESCRIPTION, "user not found")
        }else{

            const isValidUser = await bcrypt.compare(password, user.password);

            if(!isValidUser){
                throw new HttpError(HttpError.UNAUTHORIZED_CODE, HttpError.UNAUTHORIZED_DESCRIPTION, "password is incorrect.")
            }

            signJWT(user, (err, token)=>{
                if(err){
                    throw new HttpError(HttpError.UNAUTHORIZED_CODE, HttpError.UNAUTHORIZED_DESCRIPTION, "Unable to sign JWT")
                } else if (token){
                    return res.status(200).json({ message: "Login Successful", token:token, user:user });
                }
            })
        }
    }
    catch(error){
        next(error)
    }

}

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
