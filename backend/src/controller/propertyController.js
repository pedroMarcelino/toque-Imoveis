import AppError from '../util/appError.js';
import propertyService from '../service/propertyService.js';

class propertyController {

    async createProperty(req, res) {
        try {
            const data = req.body;
            const create = await propertyService.createProperty({ data })
            res.status(200).json(create)
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message,
                source: error.source || 'propertyController.CreateProperty'
            });
        }
    }

}

export default new propertyController();