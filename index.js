const express = require('express');
const debug = require('debug')('nodestr:server');
const server = express();
const fs = require('fs');
const path = require('path');

server.get('/', (req, res) => {
    return res.json({mensagem: 'API Ok'})
});

// GET Dados Gerais

server.get ('/dados-gerais', (req, res) => {

});

/*********************************/

function obterGastosMensais () {

   const caminhoArquivo = path.join(__dirname, 'src/data/gastos.json');

   try {
    const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
    const dadosGastos = JSON.parse(conteudo);
    return dadosGastos;
   } catch (error) {
    console.error('Erro na leitura de dados', error.message);
    return{};
   }

};

function obterLucrosMensais () {

    const caminhoArquivo = path.join(__dirname, 'src/data/lucros.json');
 
    try {
     const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
     const dadosGastos = JSON.parse(conteudo);
     return dadosGastos;
    } catch (error) {
     console.error('Erro na leitura de dados', error.message);
     return{};
    }
 
 };
 

// GET Gastos Mensais
server.get ('/gastos-mensais', (req, res) => {

    const gastosMensais = obterGastosMensais();

    return res.json({ gastosMensais });
});

/********************************/

//GET  Lucros Mensais
server.get ('/lucros-mensais', (req, res) => {
    const lucrosMensais = obterLucrosMensais();

    return res.json({ lucrosMensais });
});

/********************************/

//GET Desempenho
server.get ('/desempenho', (req, res) => {

});

/*******************************/

server.listen(3000, () => {
    console.log("Servidor Ok")
})