// importa módulos usados
import express from 'express';
// módulo que converte body da requisição em vários formatos
import bodyParser from 'body-parser';
import cors from 'cors';
// importa módulo das rotas
import { gradeRota } from './rota/gradeR.js';
// importa config de bd do Mongo
import { db } from './models/index.js';
// módulo de log
import { logger } from './config/logger.js';

async function conectaMongoDB() {
  let bSucesso = false;
  try {
    // para habilitar o findOneandUpdate aplica useFindandmodify = false, caso contrário, não informa
    console.log('Mongo - Parametros Conexão:' + db.url);
    await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    bSucesso = true;
    console.log('MongoDB - Sucesso ao conectar');
    logger.info('MongoDB - Sucesso ao conectar');
  } catch (err) {
    bSucesso = false;
    console.log('MongoDB - ERRO ao conectar: ' + err);
    logger.error('MongoDB - ERRO ao conectar: ' + err);
  }
  return bSucesso;
}

// cria instância do Express
const app = express();

//define o dominio de origem para consumo do servico

//libera permissão de acesso a api usando CORS

// acessa propriedades de porta e site do heroku
const appPorta = parseInt(process.env.APP_H_PORTA);
let corsUrl = '';

// caso porta seja 0 ou nula ela irá colocar origem local
// para uso local, a porta é 3001
// url / origin: 'http://localhost:3001',
if (appPorta !== 0 || appPorta.length <= 0) corsUrl = 'http://localhost:3001';
else corsUrl = `${process.env.APP_H_URL}:${process.env.APP_H_PORTA}`;

// nome do app heroku do Grades-APP
corsUrl = 'http://dazzling-voyageurs-96307.herokuapp.com/';

// em origin, habilita a url do heroku onde está o app (react) que fará o acesso aos dados
let corsConfig = {
  origin: corsUrl,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// informa que o express vai usar o formato json a partir do módulo bodyparser para as requisições
app.use(bodyParser.json());
// permite que objetos tipo array sejam encodados no formato JSON para Url encode
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(cors(corsConfig));
app.use(cors());
//app.options('*', cors());

//let portaAPI = parseInt(process.env.PORTA);
//if (portaAPI !== 0 || portaAPI.length <= 0) portaAPI = 3001;

// para rodar on-line, o Heroku usa a variavel process.env.PORT que é dinamicamente por ele preenchida
// sendo assim, habilito para ouvir a porta dinamica do heroku e a porta 3001 que é padrão local
// sendo assim, é melhor deixar o código desta forma:
// let portaAPI = process.env.PORT || 3001;
console.log('Porta Heroku: ' + process.env.PORT);
logger.info('Porta Heroku: ' + process.env.PORT);

// qualquer requisição a partir de localhost:3000/ será pelo arquivo de rotas
app.use('/', gradeRota);
// app.use(gradeRota);

// habilita listening da porta
// 3001 para teste local
app.listen(process.env.PORT || 3001, async () => {
  console.log('---- API iniciada com sucesso ----');
  logger.info('---- API iniciada com sucesso ----');
  // conecta no MongoDB Atlas
  const bConectado = await conectaMongoDB();
  if (!bConectado) {
    console.log('API - Não conectou no MongoDB! Back-end offline!');
    logger.info('API - Não conectou no MongoDB! Back-end offline!');
  } else {
    console.log('API - Back-end online!');
    logger.info('API - Back-end online!');
  }
});
