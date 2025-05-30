import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createAccessToken, createNewAccessToken, createRefreshToken } from '../helpers/createTokens.js';
import { createUser, getUserByEmail, getUsers } from '../models/usersModel.js';
import dotenv from 'dotenv';

dotenv.config();

const IS_PROD = process.env.ENVIRONMENT == 'prod';
console.log(`Environment: ${process.env.ENVIRONMENT}`)


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
            res.status(409).json({message: 'User with this email already exists'});
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
        res.cookie("refreshToken", refreshToken, {
            secure: IS_PROD,
            sameSite: IS_PROD ? "None" : false
        });
        res.json({ token: accessToken, user: {
            id: user.id,
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
    jwt.verify(refreshToken, REFRESH_SECRET, (e, token) => {
        if(e) return res.status(403).json({message: 'Invalid or expired refresh token'});
        const newAccessToken = createNewAccessToken(token);
        res.json({ token: newAccessToken, user: {
            id: token.userId,
            username: token.username,
            email: token.email
        }});
    });
};

export const getAllUsers = async(req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json({users});
    } catch (e) {
        console.log(e);
        res.status(500).json({message: 'Server error, try later'});
    }
};