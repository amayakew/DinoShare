import jwt from 'jsonwebtoken';

export const createAccessToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const accessToken = jwt.sign(
        {
            userId: user.id,
            userName: user.username,
            email: user.email,
        },
        JWT_SECRET,
        { expiresIn: '15m' }
    );
    return accessToken;
}; 

export const createRefreshToken = (user) => {
    const REFRESH_SECRET = process.env.REFRESH_SECRET;
    const refreshToken = jwt.sign(
        { 
            userId: user.id,
            username: user.username,
            email: user.email
        },
        REFRESH_SECRET,
        { expiresIn: "7d" },
    );
    return refreshToken;
};

export const createNewAccessToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const newAccessToken = jwt.sign(
        {
            userId: user.id || user.userId,
            username: user.username,
            email: user.email, 
        },
        JWT_SECRET,
        { expiresIn: "15m" },
    );
    return newAccessToken;
};