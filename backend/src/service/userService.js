import bcrypt from 'bcrypt';
import User from '../model/User.js';
import { signToken } from '../util/token.js';

class userService {
    async create({ name, email, password }) {
        if (!email || !password) {
            throw new Error('Email e senha são obrigatórios');
        }

        const emailExists = await User.findOne({ email });

        if (emailExists) {
            throw new Error('Este email já está cadastrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = signToken({
            id: user._id,
            email: user.email
        });

        return { user, token };
    }

    async login({ email, password }) {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Email ou senha inválidos');
        }

        const token = signToken({
            id: user._id,
            email: user.email
        });

        return { user, token };
    }
}

export default new userService();
