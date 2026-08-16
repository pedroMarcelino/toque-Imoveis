//Pagina responsavel apenas por importar CORS, express, middlewares etc.
import express from 'express';
import cors from 'cors';
import { connection } from './config/database.js';
import routes from './routes/index.js';

const app = express();

//cors usado para nao dar conflito quando a aplicacao tentar 
//acessar a mesma rota 'http://localhost' porem diferentes portas;
app.use(cors());
connection();
app.use(express.json());
app.use(routes);


export default app;