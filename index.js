const express = require('express');
const debug = require('debug')('nodestr:server');
const server = express();
const fs = require('fs');
const path = require('path');

server.get('/', (req, res) => {
    return res.json({ mensagem: 'API Ok' })
});

function obterGastosMensais() {

    const caminhoArquivo = path.join(__dirname, 'src/data/gastos.json');

    try {
        const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
        var dadosGastos = JSON.parse(conteudo);
        return dadosGastos;
    } catch (error) {
        console.error('Erro na leitura de dados', error.message);
        return {};
    }

};

function obterLucrosMensais() {

    const caminhoArquivo = path.join(__dirname, 'src/data/lucros.json');

    try {
        const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
        var dadosLucros = JSON.parse(conteudo);
        return dadosLucros;
    } catch (error) {
        console.error('Erro na leitura de dados', error.message);
        return {};
    }

};

function gastosMensais() {
    const caminhoArquivo = path.join(__dirname, 'src/data/gastos.json');

    try {
        const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
        const dadosGastos = JSON.parse(conteudo);

        function somarValoresMensais(valores) {
            const meses = Object.keys(valores);

            meses.forEach((mes) => {
                if (mes !== 'gastos') {
                    valores[mes].gastos = Object.values(valores[mes]).reduce((total, valor) => {
                        // Certifique-se de somar apenas os valores numéricos
                        return typeof valor === 'number' ? total + valor : total;
                    }, 0);
                }
            });

            return valores;
        }

        const gastosComSoma = somarValoresMensais(dadosGastos);

        return gastosComSoma;
    } catch (error) {
        console.error('Erro na leitura de dados', error.message);
        return {};
    }
}

function calcularDesempenho() {
    const gastos = gastosMensais();
    const lucros = obterLucrosMensais();
    const desempenho = {};

    const meses = Object.keys(gastos);

    meses.forEach((mes) => {
        if (lucros[mes]) {
            // Certifique-se de que os valores são numéricos
            const gastosMensais = typeof gastos[mes].gastos === 'number' ? gastos[mes].gastos : 0;
            const lucroMensal = typeof lucros[mes] === 'number' ? lucros[mes] : 0;

            // Calcular a margem de lucro para cada mês
            const margemLucroMensal = (lucroMensal / gastosMensais) * 100;

            desempenho[mes] = {
                gastos: gastosMensais,
                lucro: lucroMensal,
                margemLucro: margemLucroMensal
            };
        }
    });

    return desempenho;
}


// GET Dados Gerais

server.get('/dados-gerais', (req, res) => {

});

/*********************************/

// GET Gastos Mensais
server.get('/gastos-mensais', (req, res) => {

    const gastosMensais = obterGastosMensais();

    return res.json({ gastosMensais });
});

/********************************/

//GET  Lucros Mensais
server.get('/lucros-mensais', (req, res) => {
    const lucrosMensais = obterLucrosMensais();

    return res.json({ lucrosMensais });
});

/********************************/

//GET Desempenho
// GET Desempenho (Margem de Lucro)
server.get('/desempenho', (req, res) => {
    const desempenhoMensal = calcularDesempenho();

    // Formatar a margem de lucro de cada mês
    Object.keys(desempenhoMensal).forEach((mes) => {
        desempenhoMensal[mes].margemLucro = desempenhoMensal[mes].margemLucro.toFixed(1) + '%';
    });

    return res.json({ Desempenho: desempenhoMensal });
});

/*******************************/

server.listen(3000, () => {
    console.log("Servidor Ok")
})