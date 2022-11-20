const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const hbs = require('hbs');

dotenv.config({ path: './.env' });

const app = express();

const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

//Defining Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

const port = 3000;

app.listen(port, () => {
    console.log("Server started ");
})