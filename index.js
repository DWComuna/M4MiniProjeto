const express = require('express');
const server = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');


app.use(cors());

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
                        return typeof valor === 'number' ? total + valor : total;
                    }, 0);
                }
            });

            const valoresComGastos = Object.keys(valores).reduce((obj, mes) => {
                if (valores[mes].gastos > 0) {
                    obj[mes] = valores[mes];
                }
                return obj;
            }, {});

            return valoresComGastos;
        }

        const gastosSomados = somarValoresMensais(dadosGastos);

        return gastosSomados;
    } catch (error) {
        console.error('Erro na leitura de dados', error.message);
        return {};
    }
};

function calcularDesempenho() {
    const gastos = gastosMensais();
    const lucros = obterLucrosMensais();
    const desempenho = {};

    const meses = Object.keys(gastos);

    meses.forEach((mes) => {
        if (lucros[mes]) {
            const gastosMensais = typeof gastos[mes].gastos === 'number' ? gastos[mes].gastos : 0;
            const lucroMensal = typeof lucros[mes] === 'number' ? lucros[mes] : 0;

            const margemLucroMensal = (lucroMensal / gastosMensais) * 100;

            desempenho[mes] = {
                gastos: gastosMensais,
                lucro: lucroMensal,
                margemLucro: margemLucroMensal,
            };
        };
    });

    return desempenho;
};

function obterDadosGerais() {
    const desempenho = calcularDesempenho();
    const trimestres = ["1º trimestre", "2º trimestre", "3º trimestre", "4º trimestre"];
    const lucrosTrimestrais = {};

    trimestres.forEach((trimestre, index) => {
        const mesInicial = index * 3;
        const mesFinal = mesInicial + 2;

        let lucroTrimestral = 0;

        for (let i = mesInicial; i <= mesFinal; i++) {
            const mes = Object.keys(desempenho)[i];
            if (mes && desempenho[mes]) {
                lucroTrimestral += desempenho[mes].lucro || 0;
            }
        };

        lucrosTrimestrais[trimestre] = lucroTrimestral.toFixed(2);
    });

    const caminhoArquivo = path.join(__dirname, 'src/data/data.json');
    const conteudoAtual = fs.readFileSync(caminhoArquivo, 'utf-8');
    const dados = JSON.parse(conteudoAtual);

    dados["Lucro Trimestral"] = 0;

    trimestres.forEach((trimestre) => {
        dados["Lucro Trimestral"] += parseFloat(lucrosTrimestrais[trimestre]) || 0;
    });

    dados["Lucro Trimestral"] = dados["Lucro Trimestral"].toFixed(2);

    fs.writeFileSync(caminhoArquivo, JSON.stringify(dados, null, 2), 'utf-8');

    return lucrosTrimestrais;
};


// GET Dados Gerais
server.get('/dados-gerais', (req, res) => {
    try {
        const lucrosTrimestrais = obterDadosGerais();
        const caminhoArquivo = path.join(__dirname, 'src/data/data.json');
        const conteudoAtual = fs.readFileSync(caminhoArquivo, 'utf-8');
        const dados = JSON.parse(conteudoAtual);
        dados["Capital Investido"] = dados["Capital Investido"].toFixed(2);
        dados["Lucro Trimestral"] = lucrosTrimestrais;

        return res.json({ DadosGerais: dados });
    } catch (error) {
        console.error('Erro ao obter dados gerais', error.message);
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// GET Gastos Mensais
server.get('/gastos-mensais', (req, res) => {
    try {
        const gastosMensais = obterGastosMensais();
        return res.json({ gastosMensais });
    } catch (error) {
        console.error('Erro ao obter gastos mensais', error.message);
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

/********************************/

// GET Lucros Mensais
server.get('/lucros-mensais', (req, res) => {
    try {
        const lucrosMensais = obterLucrosMensais();
        return res.json({ lucrosMensais });
    } catch (error) {
        console.error('Erro ao obter lucros mensais', error.message);
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

/********************************/

//GET Desempenho
server.get('/desempenho', (req, res) => {
    const desempenhoMensal = calcularDesempenho();


    Object.keys(desempenhoMensal).forEach((mes) => {
        desempenhoMensal[mes].margemLucro = desempenhoMensal[mes].margemLucro.toFixed(1) + '%';
    });

    return res.json({ Desempenho: desempenhoMensal });
});

/*******************************/

server.listen(3000, () => {
    console.log("Servidor Ok")
});