import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../../config/config';


export default function generateJWTToken(data: any) {
    return jwt.sign(
        {
            ...data
        },
        JWT_CONFIG.secretKey,
        {
            expiresIn: JWT_CONFIG.expiresIn
        }
    );
}