import streamifier from 'streamifier';
import { AppError } from "../util/appError.js";
import Property from '../model/Property.js';
import cloudinary from '../config/cloudinary.js';


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
            const property = await Property.findById(idProperty);
            return property
        } catch (error) {
            throw new AppError(error.message, '403', 'propertyService.getProperty')
        }
    }

    async getProperties() {
        try {
            const property = await Property.find().where({ status: 'disponivel' });
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

    async uploadPropertyImages(id, files) {
        if (!files || files.length === 0) {
            throw new AppError('Nenhuma imagem enviada', '400', 'propertyService.uploadPropertyImages');
        }

        const property = await Property.findById(id);

        if (!property) {
            throw new AppError('Imóvel não encontrado', '404', 'propertyService.uploadPropertyImages');
        }

        const uploads = files.map((file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'toque-imoveis/imoveis' },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve({ url: result.secure_url, publicId: result.public_id });
                    }
                );

                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        });

        const uploadedImages = await Promise.all(uploads);

        property.images.push(...uploadedImages);
        await property.save();

        return property;
    }


}

export default new propertyService();