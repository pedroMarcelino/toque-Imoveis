import { AppError } from "../util/appError.js";
import Property from '../model/Property.js';


class propertyService {

    async createProperty({ data }) {
        try {
            const property = await Property.create(data);
            return property;
        } catch (error) {
            throw new AppError(error.message, '403', 'propertyService.CreateProperty')
        }
    }

    async getProperty({ idProperty }) {
        try {
            const property = Property.findById(idProperty);
            return property
        } catch (error) {
            throw new AppError(error.message, '403', 'propertyService.getProperty')
        }
    }

    async getProperties() {
        try {
            const property = Property.find().where({ status: 'disponivel' });
            return property
        } catch (error) {
            throw new AppError(error.message, '403', 'propertyService.getProperties')
        }
    }

    async updateProperty(id, data) {
        try {
            const property = await Property.findByIdAndUpdate(id, data,
                { new: true }
            );

            if (!property) {
                throw new Error('Imóvel não encontrado');
            }

            return property;
        } catch (error) {
            throw new AppError(error.message, '403', 'propertyService.updateProperty')
        }
    }

    async deleteProperty(id) {
        try {
            const property = await Property.findByIdAndDelete(id);

            if (!property) {
                throw new Error('Imóvel não encontrado');
            }

            return property;
        } catch (error) {
            throw new AppError(error.message, '403', 'propertyService.deleteProperty')
        }
    }


}

export default new propertyService();