// importa informação da base de dados de index.js
import { db } from '../models/index.js';

// constante com informações do bd
const modeloBD = db.model;

// msg usada no consolelog e res.send
let msg = '';

// Novo registro em uma arrow function de nome criaReg
// no Imsonia, enviar o post no formato JSON com o body adequado com o modelo da coleção
// endereço: http://localhost:3000/grade
// {
//   "name": "Antonio",
//   "subject": "Port",
//   "type": "Prova",
//   "value":15
// }
const criaReg = async (req, res) => {
  try {
    console.log('Post CriaReg - acessado');
    const registro = new modeloBD(req.body);
    await registro.save();
    console.log(registro);
    res.send(registro);
  } catch (err) {
    msg = 'Post CriaReg - Erro ao salvar: ' + err.message;
    console.log(msg);
    res.send(msg);
  }
};

// Pesquisa todos os registros em uma arrow function de nome buscaGeral
// no Imsonia, será possível fazer a busca em /grade preenchendo (ou não o nome)irá buscar o parâmetro de query name(?)
// Pesquisa todos: http://localhost:3000/grade
// Pesquisa alunos com nome Ana Maria: http://localhost:3000/grade?name=Ana Maria

const buscaGeral = async (req, res) => {
  // alimenta variavel
  console.log('Get BuscaGeral - Acessado');
  const nome = req.query.name;
  console.log(nome);

  //condicao para o filtro no findAll:
  // new RegExp(nome) - cria objeto de expressão regular
  // i - case insensitive
  let filtro = '';
  // caso não informe o nome, indica que irá buscar TODOS os registros
  if (!nome) filtro = {};
  else filtro = { name: { $regex: new RegExp(nome), $options: 'i' } };

  // realiza a busca
  try {
    const registro = await modeloBD.find(filtro);
    console.log(registro);
    res.send(registro);
  } catch (err) {
    msg =
      'Get BuscaGeral - Erro ao pesquisar: ' + nome + '. Erro: ' + err.message;
    console.log(msg);
    res.send(msg);
  }
};

// Pesquisa registro por ID
// no Imsonia, buscará pelo campo _id
// Ex http://localhost:3000/grade/5effb701b14a4815d815d17d
const buscaID = async (req, res) => {
  console.log('Get BuscaID - Acessado');
  const id = req.params.id;

  try {
    const registro = await modeloBD.findOne({ _id: id });
    console.log(registro);
    res.send(registro);
  } catch (err) {
    msg =
      'Get BuscaID - Erro ao buscar por id: ' + id + '. Erro: ' + err.message;
    console.log(msg);
    res.send(msg);
  }
};

// Atualiza registro por ID
// no Imsonia, enviar o put no formato JSON com o body adequado com o modelo da coleção onde os valores serão atualizados
// endereço: http://localhost:3000/grade/5effb701b14a4815d815d17d
// {
//   "type": "Trabalho",
//   "value":12
// }
const atualizaReg = async (req, res) => {
  console.log('Put AtualizaReg - Acessado');

  // caso não tenha conteúdo não irá continuar
  if (!req.body) {
    msg =
      'Put AtualizaReg - Não foi informado conteúdo para atualizar: ' +
      req.body;
    console.log(msg);
    res.send(msg);
  } else {
    // caso conteúdo do body NÃO seja vazio
    const id = req.params.id;

    try {
      // atualiza e retorna registro atualizado (new=true)
      const registro = await modeloBD.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      console.log(registro);
      res.send(registro);
    } catch (err) {
      msg =
        'Put AtualizaReg - Erro ao atualizar por id: ' +
        id +
        '/Erro: ' +
        err.message;
      console.log(msg);
      res.send(msg);
    }
  }
};

// Exclui registro por ID
// no Imsonia, enviar o método delete e informar o valor por parâmetro
//  endereço: http://localhost:3000/grade/5effb701b14a4815d815d17d
const deletaReg = async (req, res) => {
  console.log('Delete Reg - Acessado');
  const id = req.params.id;

  try {
    const registro = await modeloBD.findByIdAndRemove({ _id: id });
    // caso retorne vazio ele NÃO achou registro
    if (!registro) {
      msg = 'Delete Reg - Registro não encontrado id: ' + id;
      console.log(msg);
      res.send(msg);
    } else {
      msg = 'Delete Reg - Sucesso:  ' + registro;
      console.log(msg);
      res.send(msg);
    }
  } catch (err) {
    msg = 'Delete Reg - Erro ao excluir id: ' + id + '. Erro:' + err.message;
    console.log(msg);
    res.send(msg);
  }
};

// Exclui TODOS os registros
// no Imsonia, enviar o método delete somente
// endereço: http://localhost:3000/grade
const deletaGeral = async (req, res) => {
  console.log('Delete Geral - Acessado');

  try {
    const registro = await modeloBD.remove({});
    console.log(registro);
    res.send(registro);
  } catch (err) {
    msg = 'Delete Geral - Erro ao excluir todos. Erro:' + err.message;
    console.log(msg);
    res.send(msg);
  }
};

// exporta funções criadas
// exporta módulo
export default {
  criaReg,
  buscaGeral,
  buscaID,
  atualizaReg,
  deletaReg,
  deletaGeral,
};
