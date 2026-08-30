import userService from "../service/userService.js";

class userController {
    async create(req, res) {
        try {
            const { name, email, password } = req.body;
            const { user, token } = await userService.create({ name, email, password });

            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                user,
                token
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
            return res.status(401).json({
                message: error.message
            });
        }
    }
}

export default new userController();
