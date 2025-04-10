require('dotenv').config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');
dbConnect(app, process.env.dbUrl);

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flashMsg = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const { config } = require('dotenv');
const helmet = require('helmet');
const csrf = require('csurf');

const { middlewareTrataNome, middlewareGlobal, checkError, csrfMiddleware } = require(path.resolve(__dirname, 'src', 'middlewares', 'middleware'));

// Helmet
// app.use(helmet());

// Middleware para tratar requisicoes
app.use(express.urlencoded({ extended: true }));

// Middleware para interpretar corpo da requisicao no formato JSON
app.use(express.json());

// Arquivos estaticos (public)
app.use(express.static(path.resolve(__dirname, 'public')));

// Session configs
const sessionOptions = session({
    secret: 'teste',
    store: MongoStore.create({ mongoUrl: process.env.dbUrl }), // local salvar sessao
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7dias
        httpOnly: true,
    }
});

// Middleware para gerenciar sessões (necessário para o `csurf`)
app.use(sessionOptions);
app.use(flashMsg());

// Middlewares próprios
app.use(middlewareGlobal); // middleware global (nao informamos caminho especifico)

// Csrf (token seguranca)
app.use(csrf());
app.use(csrfMiddleware);
app.use(checkError);

// Usar arquivo de rotas
app.use(routes);




// Configurações de template engine
app.set("views", path.join(__dirname, "src", "views"));
app.set('view engine', 'ejs');

// porta
const port = 3000;
app.on('ready', () => {
    console.log('Pronto para iniciar o servidor');
    app.listen(port, () => {
        console.log(`Server executando na porta ${port}`);
        console.log(`http://localhost:${port}`);
    });
});


async function dbConnect(app, url) {
    await mongoose.connect(url)
        .then(() => {
            app.emit('ready');
            console.log('Conectado ao db');
        })
        .catch(e => {
            console.log(e);
        });
}
