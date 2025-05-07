import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createAccessToken, createNewAccessToken, createRefreshToken } from '../helpers/createTokens.js';
import { createUser, getUserByEmail } from '../models/usersModel.js';

export const registerUser = async(req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
        return res.status(400).json({message: 'Username, email and password required'});
    };

    try {
        const user = await createUser(username, email, password);
        res.status(201).json({message: 'User registered successfully', user});
    } catch (e) {
        console.log(e);
        if(e.code === '23505') {
            res.status(409).json({message: 'User already exists'});
            return;
        };
        res.status(500).json({message: 'Server error, try later'});
    }
}; 

export const loginUser = async(req,res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: 'Email and password required'});
    };

    try {
        const user = await getUserByEmail(email);
        if(!user) {
            res.status(404).json({message: 'User not found'});
            return; 
        };

        const isMatch = await bcrypt.compare(password + '', user.password_hash);
        if(!isMatch){
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        };

        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);
        const isProd = process.env.ENVIRONMENT == 'prod';
        res.cookie("refreshToken", refreshToken, { 
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : false
        });sz
        res.json({ token: accessToken, user: {
            userId: user.id,
            username: user.username,
            email: user.email
        }});

    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};

export const refreshAccessToken = async(req,res) => {
    const refreshToken = req.cookies?.refreshToken;
    if(!refreshToken) return res.status(403).json({message: 'Missing refresh token'});

    const REFRESH_SECRET = process.env.REFRESH_SECRET;
    jwt.verify(refreshToken, REFRESH_SECRET, (e, user) => {
        if(e) return res.status(403).json({message: 'Invalid or expired refresh token'});

        const newAccessToken = createNewAccessToken(user);
        res.json({ token: newAccessToken, user: {
            userId: user.id,
            username: user.username,
            email: user.email
        }});
    });
};