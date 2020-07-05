// importa módulos
import express from 'express';
// importa módulo com operações do mongoDB
import controlador from '../controller/gradeC.js';

// cria instância
const gradeRota = express.Router();

// para cada método http abaixo será chamada a função existente em gradeC.js
// funciona
gradeRota.post('/grade/', controlador.criaReg);
// funciona
gradeRota.get('/grade/', controlador.buscaGeral);
// funciona
gradeRota.get('/grade/:id', controlador.buscaID);
// funciona
gradeRota.put('/grade/:id', controlador.atualizaReg);
// funciona
gradeRota.delete('/grade/:id', controlador.deletaReg);
// funciona
gradeRota.delete('/grade/', controlador.deletaGeral);

// método get de teste
// endereço: localhost:3000/teste
gradeRota.get('/teste', (_, res) => {
  const msg = 'Teste - Sucesso';
  console.log(msg);
  res.send(msg);
});

export { gradeRota };
