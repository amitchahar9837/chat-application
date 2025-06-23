import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const generateToken = (id, res) =>{
    const token = jwt.sign({id}, process.env.JWT_KEY, {expiresIn:'1d'})
    res.cookie('token', token, {httpOnly: true, sameSite:"Lax", maxAge: 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === 'production'});
}