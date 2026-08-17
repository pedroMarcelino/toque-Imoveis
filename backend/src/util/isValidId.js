import mongoose from "mongoose";

//funcao para verificar se id é valido no formato de objectId 
export function isValidId(id) {
    console.log("--validando ID : " + id + "...")
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("ID invalido");
        return false
    }
    console.log("ID valido");
    return true;
}