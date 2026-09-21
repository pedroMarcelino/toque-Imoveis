import userService from "../service/userService.js";

class userController {
    async create(req, res) {
        try {
            const { name, email, password, confirmPassword } = req.body;
            const { user } = await userService.create({ name, email, password, confirmPassword });

            return res.status(201).json({
                message: 'Conta criada! Aguardando aprovação de um profissional.',
                user
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await userService.login({ email, password });

            return res.status(200).json({
                message: 'Login realizado com sucesso',
                user,
                token
            });
        } catch (error) {
            return res.status(error.statusCode || 401).json({
                message: error.message
            });
        }
    }

    async listUsers(req, res) {
        try {
            const users = await userService.listUsers();
            return res.status(200).json({ users });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                message: error.message
            });
        }
    }

    async approveUser(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.approveUser(id);
            return res.status(200).json({ message: 'Usuário aprovado com sucesso', user });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                message: error.message
            });
        }
    }
}

export default new userController();