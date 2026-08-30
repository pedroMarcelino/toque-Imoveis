//Pagina responsavel apenas por importar CORS, express, middlewares etc.
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { connection } from './config/database.js';
import routes from './routes/index.js';

const app = express();

//cors usado para nao dar conflito quando a aplicacao tentar 
//acessar a mesma rota 'http://localhost' porem diferentes portas;
app.use(cors());
connection();
app.use(express.json());
app.use(routes);

// rota nao encontrada
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// middleware global de erros
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ error: error.message });
    }

    const statusCode = error.statusCode || 500;

    if (statusCode >= 500) {
        console.error('-----!ERRO NO SERVIDOR!-----');
        console.error(error);
    }

    res.status(statusCode).json({
        error: error.message || 'Erro interno no servidor',
        source: error.source || 'middleware.erroGlobal'
    });
});


export default app;