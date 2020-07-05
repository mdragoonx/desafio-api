// importa módulos usados
import express from 'express';
// módulo que converte body da requisição em vários formatos
import bodyParser from 'body-parser';
import cors from 'cors';
// importa módulo das rotas
import { gradeRota } from './rota/gradeR.js';
// importa config de bd do Mongo
import { db } from './models/index.js';

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
  } catch (err) {
    bSucesso = false;
    console.log('MongoDB - ERRO ao conectar: ' + err);
  }
  return bSucesso;
}

// cria instância do Express
const app = express();

// informa que o express vai usar o formato json a partir do módulo bodyparser para as requisições
app.use(bodyParser.json());
// permite que objetos tipo array sejam encodados no formato JSON para Url encode
app.use(bodyParser.urlencoded({ extended: true }));

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

// em origin, habilita a url do heroku onde está o app (react) que fará o acesso aos dados
let corsConfig = {
  origin: corsUrl,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// app.use(cors(corsConfig));
app.use(cors());

// qualquer requisição a partir de localhost:3000/ será pelo arquivo de rotas
app.use('/', gradeRota);
// app.use(gradeRota);

let portaAPI = parseInt(process.env.PORTA);
if (portaAPI !== 0 || portaAPI.length <= 0) portaAPI = 3001;
// app.listen(process.env.PORT || 8081, () => {});

// habilita listening da porta
// 3001 para teste local
app.listen(portaAPI, async () => {
  console.log('---- API iniciada com sucesso ----');
  // conecta no MongoDB Atlas
  const bConectado = await conectaMongoDB();
  if (!bConectado)
    console.log('API - Não conectou no MongoDB! Back-end offline!');
  else console.log('API - Back-end online!');
});
