import bcrypt from 'bcrypt';
import User from '../model/User.js';
import { signToken } from '../util/token.js';
import { AppError } from '../util/appError.js';
import { isValidId } from '../util/isValidId.js';

// remove campos sensiveis antes de serializar o usuario
function toSafeUser(user) {
    const safe = user.toObject ? user.toObject() : { ...user };
    delete safe.password;
    return safe;
}

class userService {
    async create({ name, email, password, confirmPassword }) {
        if (!email || !password) {
            throw new Error('Email e senha são obrigatórios');
        }

        if (!confirmPassword || confirmPassword !== password) {
            throw new Error('As senhas não coincidem');
        }

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            throw new Error('Este email já está cadastrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isApproved: false
        });

        return { user: toSafeUser(user) };
    }

    async login({ email, password }) {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError('Email ou senha inválidos', '401', 'userService.login');
        }

        if (!user.isApproved) {
            throw new AppError(
                'Sua conta ainda não foi aprovada. Aguarde a aprovação de um profissional.',
                '403',
                'userService.login'
            );
        }

        const token = signToken({
            id: user._id,
            email: user.email
        });

        return { user: toSafeUser(user), token };
    }

    async listUsers() {
        const users = await User.find({}).sort({ createdAt: -1 });
        return users.map(toSafeUser);
    }

    async approveUser(id) {
        if (!isValidId(id)) {
            throw new AppError('ID de usuário inválido', '400', 'userService.approveUser');
        }

        const user = await User.findByIdAndUpdate(
            id,
            { isApproved: true },
            { new: true }
        );

        if (!user) {
            throw new AppError('Usuário não encontrado', '404', 'userService.approveUser');
        }

        return toSafeUser(user);
    }
}

export default new userService();