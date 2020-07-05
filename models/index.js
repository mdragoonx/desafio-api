import mongoose from 'mongoose';
// biblioteca de variavel de ambiente
import dotenv from 'dotenv';
import { gradeModel } from '../models/gradeM.js';

// irá ler arquivo .env com as variaveis de ambiente
dotenv.config();
// aplica desestructuring
const { BD_U, BD_PW, BD_CLU, BD_NOME, BD_PERMISSAO, BD_PORTA } = process.env;

const db = {};
db.mongoose = mongoose;
// define URL da base de dados do mongoDB
db.url = `mongodb+srv://${BD_U}:${BD_PW}`;
db.url =
  db.url + '@cluster0-wbzpx.mongodb.net/banco??retryWrites=true&w=majority';

// atribui schema na constante db.model
db.model = gradeModel;

// objeto db (mongoose, url e model) para usar no módulo exportado
export { db };
