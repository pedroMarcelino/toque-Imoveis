import User from '../model/User.js';

class userService {
    async login({ email, password }) {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            throw new Error('Email ou senha inválidos');
        }

        return user;
    }
}

export default new userService();