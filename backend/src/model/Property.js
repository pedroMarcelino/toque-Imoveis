import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        // Ex: casa, apartamento, terreno, comercial
        type: {
            type: String,
            required: true,
            enum: [
                'casa',
                'apartamento',
                'terreno',
                'comercial',
                'chacara',
                'sobrado'
            ]
        },

        // Ex: venda, aluguel
        purpose: {
            type: String,
            required: true,
            enum: ['venda', 'aluguel']
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        // Características
        area: {
            type: Number,
            required: true,
            min: 0
        },

        bedrooms: {
            type: Number,
            default: 0,
            min: 0
        },

        suites: {
            type: Number,
            default: 0,
            min: 0
        },

        bathrooms: {
            type: Number,
            default: 0,
            min: 0
        },

        parkingSpaces: {
            type: Number,
            default: 0,
            min: 0
        },

        // Valores adicionais
        condominiumFee: {
            type: Number,
            default: 0,
            min: 0
        },

        iptu: {
            type: Number,
            default: 0,
            min: 0
        },

        // Localização
        address: {
            street: {
                type: String,
                trim: true
            },

            number: {
                type: String,
                trim: true
            },

            neighborhood: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                required: true,
                trim: true,
                uppercase: true
            },

            zipCode: {
                type: String,
                trim: true
            }
        },

        // Características adicionais
        features: [
            {
                type: String,
                trim: true
            }
        ],

        // Fotos do Cloudinary
        images: [
            {
                url: {
                    type: String,
                    required: true
                },

                publicId: {
                    type: String,
                    required: true
                }
            }
        ],

        // Controle do imóvel
        status: {
            type: String,
            enum: [
                'disponivel',
                'vendido',
                'alugado',
                'indisponivel'
            ],
            default: 'disponivel'
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Property', propertySchema);