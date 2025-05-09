import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(' ')[1];
    if (!token) return res.sendStatus(403);
    
    jwt.verify(token, JWT_SECRET, (err, token) => {
    if (err) return res.sendStatus(403);

    req.token = token;
    next();
    });
};
