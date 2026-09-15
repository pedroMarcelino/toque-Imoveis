import { AppError } from '../util/appError.js';
import propertyService from '../service/propertyService.js';

class propertyController {

    async createProperty(req, res) {
        try {
            const data = req.body;
            const create = await propertyService.createProperty({ data })
            res.status(201).json(create)
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message,
                source: error.source || 'propertyController.createProperty'
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
                source: error.source || 'propertyController.getProperty'
            });
        }
    }

    async getProperties(req, res) {
        try {
            const getProperties = await propertyService.getProperties({ filters: req.query });
            res.status(200).json(getProperties);
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message,
                source: error.source || 'propertyController.getProperties'
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
                source: error.source || 'propertyController.updateProperty'
            });
        }
    }

    async deleteProperty(req, res) {
        try {
            const id = req.params.id;
            await propertyService.deleteProperty(id);
            return res.status(204).end();
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                error: error.message,
                source: error.source || 'propertyController.deleteProperty'
            });
        }
    }
    async uploadImages(req, res) {
        try {
            console.log(req.files);

            const { id } = req.params;

            const property = await propertyService.uploadPropertyImages(
                id,
                req.files
            );

            return res.status(200).json({
                message: "Fotos enviadas com sucesso.",
                images: property.images
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

}

export default new propertyController();