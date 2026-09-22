import mongoose from "mongoose";

//funcao para verificar se id é valido no formato de objectId
export function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}