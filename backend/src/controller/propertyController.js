import { AppError } from '../util/appError.js';
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

    async getProperty(req, res) {
        try {
            const idProperty = req.params.id;
            const getProperty = await propertyService.getProperty({ idProperty });
            res.status(200).json(getProperty);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message,
                source: error.source || 'propertyController.CreateProperty'
            });
        }
    }

    async updateProperty(req, res) {
        try {
            const { id } = req.params;
            const property = await propertyService.updateProperty(id, req.body);
            return res.status(200).json(property);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message,
                source: error.source || 'propertyController.CreateProperty'
            });
        }
    }

    async deleteProperty(req, res) {
        try {
            const id = req.params.id;
            const deleteProperty = await propertyService.deleteProperty(id);
            return res.status(200).json(deleteProperty)
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message,
                source: error.source || 'propertyController.CreateProperty'
            });
        }
    }

}

export default new propertyController();