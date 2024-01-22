const http = require('http')
const express = require('express');
const debug = require('debug')('nodestr:server');
const server = express();

server.get('/', (req, res) => {
    return res.json({mensagem: 'API Ok'})
});

// GET Dados Gerais

server.get ('/dados-gerais', (req, res) => {

});

/*********************************/

function obterGastosMensais () {

    return {
        janeiro: 500,
        fevereiro: 600,
        marco: 400
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

});

/********************************/

//GET Desempenho
server.get ('/desempenho', (req, res) => {

});

/*******************************/

server.listen(3000, () => {
    console.log("Servidor Ok")
})