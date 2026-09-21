import jwt from 'jsonwebtoken';
import User from '../model/User.js';

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Sessão não iniciada: token não fornecido' });
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
        return res.status(401).json({ message: 'Sessão não iniciada: token malformatado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Sessão inválida ou expirada' });
    }
}

export async function requireApproved(req, res, next) {
    try {
        const user = await User.findById(req.user.id);

        if (!user || !user.isApproved) {
            return res.status(403).json({
                message: 'Acesso restrito a usuários aprovados'
            });
        }

        req.user.isApproved = true;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao validar acesso' });
    }
}