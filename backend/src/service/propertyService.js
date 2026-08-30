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

    async getProperties({ filters = {} } = {}) {
        try {
            const {
                search,
                tipo,
                finalidade,
                cidade,
                quartos,
                minPreco,
                maxPreco,
                status = 'disponivel',
                page = 1,
                pageSize = 9
            } = filters;

            const query = {
                isActive: true
            };

            if (status !== 'todos') {
                query.status = status;
            }

            if (search) {
                const regex = new RegExp(search, 'i');
                query.$or = [
                    { title: regex },
                    { description: regex },
                    { 'address.city': regex },
                    { 'address.neighborhood': regex }
                ];
            }

            if (tipo) {
                query.type = tipo;
            }

            if (finalidade) {
                query.purpose = finalidade;
            }

            if (cidade) {
                query['address.city'] = { $regex: new RegExp(cidade, 'i') };
            }

            if (quartos) {
                query.bedrooms = { $gte: Number(quartos) };
            }

            if (minPreco || maxPreco) {
                query.price = {};
                if (minPreco) query.price.$gte = Number(minPreco);
                if (maxPreco) query.price.$lte = Number(maxPreco);
            }

            const pageNum = Math.max(Number(page) || 1, 1);
            const sizeNum = Math.min(Math.max(Number(pageSize) || 9, 1), 50);

            const total = await Property.countDocuments(query);
            const properties = await Property.find(query)
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * sizeNum)
                .limit(sizeNum);

            return { properties, total, page: pageNum, pageSize: sizeNum };
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