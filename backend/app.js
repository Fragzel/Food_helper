var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
require('./models/connection');  // Connexion à la base de données
const { authenticateToken } = require('./middleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recipeRouter = require('./routes/recipe');

var app = express();

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour exclure /signin et /signup de l'authentification
app.use((req, res, next) => {
    if (req.path === '/users/signIn' || req.path === '/users/signUp') {

        return next();
    }

    authenticateToken(req, res, next);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/recipe', recipeRouter);

module.exports = app;
