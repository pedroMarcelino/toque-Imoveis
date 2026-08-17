//funcao que cria novo Error customizado;
export class AppError extends Error {

    constructor(message, statusCode, source = null) {
        super(message);
        this.statusCode = statusCode;
        this.source = source;
    }

}