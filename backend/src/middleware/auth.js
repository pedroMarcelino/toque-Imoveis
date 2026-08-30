import jwt from 'jsonwebtoken';

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
