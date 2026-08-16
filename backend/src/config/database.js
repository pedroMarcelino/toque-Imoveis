import mongoose from "mongoose";
import dns from "node:dns";
import "dotenv/config";

dns.setServers(["8.8.8.8"]);

const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASSWORD;

export async function connection() {
    try {
        await mongoose.connect(
            `mongodb+srv://${db_user}:${db_pass}@toqueimoveis-cluster.9t28iog.mongodb.net/?appName=toqueImoveis-Cluster`
        );

        console.log("-----!BANCO-CONECTADO!-----");
    } catch (error) {
        console.error("-----!ERRO NA CONEXAO COM BANCO DE DADOS!-----");
        console.error(error);
    }
} 