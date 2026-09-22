import mongoose from "mongoose";
import dns from "node:dns";
import "dotenv/config";

dns.setServers(["8.8.8.8"]);

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    throw new Error("MONGO_URI não definida no arquivo .env");
}

export async function connection() {
    try {
        await mongoose.connect(mongoUri);

        console.log("-----!BANCO-CONECTADO!-----");
    } catch (error) {
        console.error("-----!ERRO NA CONEXAO COM BANCO DE DADOS!-----");
        console.error(error);
    }
} 