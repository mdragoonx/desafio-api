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
    //console.log('Parametros de Conexão:' + db.url);
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
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

// let porta = parseInt(process.env.APPCORPORT);
// let url = process.env.APPCORURL;
// if (porta !== 0) url = `${process.env.APPCORURL}:${process.env.APPCORPORT}`;

// let corsOptions = {
//   origin: url,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// };
// app.use(cors(corsOptions));

// qualquer requisição a partir de localhost:3000/ será pelo arquivo de rotas
app.use('/', gradeRota);
// app.use(gradeRota);

//const porta = 3001;
// app.listen(process.env.PORT || 8081, () => {});

// habilita listening da porta
// 3001 para teste local
app.listen(3001, async () => {
  console.log('---- API iniciada com sucesso ----');
  // conecta no MongoDB Atlas
  const bConectado = await conectaMongoDB();
  if (!bConectado)
    console.log('API - Não conectou no MongoDB! Back-end offline!');
  else console.log('API - Back-end online!');
});
