const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// ROTAS
const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');

// GERADOR DE LOGS
app.use(morgan('dev'));

app.use(bodyParser({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Controll-Allow-Origin', '*');
    res.header(
        'Access-Controll-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Controll-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
        return res.status(200).send({});
    }

    next();
})

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

// NÃO ENCONTROU ROTA
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})


module.exports = app;