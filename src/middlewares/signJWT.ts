import jwt from 'jsonwebtoken';
import config from '../config/config';
import User from '../models/User';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY + '';
const TOKEN_EXPIRATION_TIME = '2h'

const signJWT = (user: User, callback: (error: Error | null, token: string | null) => void): void => {


    try {
        jwt.sign(
            {
                id:user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET_KEY,
            {
                algorithm: 'HS256',
                expiresIn: TOKEN_EXPIRATION_TIME
            },
            (error, token) => {
                if (error) {
                    callback(error, null);
                } else if (token) {
                    callback(null, token);
                }
            }
        );
    } catch (error: any) {
        // logging.error(NAMESPACE, error.message, error);
        callback(error, null);
    }
};

export default signJWT;