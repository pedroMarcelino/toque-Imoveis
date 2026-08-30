import jwt from 'jsonwebtoken';

export function signToken(payload, expiresIn = '7d') {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET não definido no arquivo .env');
    }

    return jwt.sign(payload, secret, { expiresIn });
}
