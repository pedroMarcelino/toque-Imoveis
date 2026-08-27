import userService from "../service/userService.js";

class userController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await userService.login({ email, password });

            return res.status(200).json({
                message: 'Login realizado com sucesso',
                user
            });
        } catch (error) {
            return res.status(401).json({
                message: error.message
            });
        }
    }
}

export default new userController();