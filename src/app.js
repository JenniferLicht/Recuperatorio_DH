const express = require("express");
const path = require("path");
const methodOverride = require('method-override');
const session = require("express-session");
const cookie = require("cookie-parser");
const cors = require('cors');

const port = 3006;
const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(cors())
app.set("view engine", "ejs")

app.set('views', path.resolve(__dirname, '../views'))

app.use(express.static(path.resolve(__dirname, "./../public")));

app.use(session({
    secret: "nuestro secreto",
    resave: false,
    saveUninitialized: false
}))

app.use(cookie());

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

const userRoutes = require('./routes/user');
const homeRoutes = require('./routes/home');
const api = require('./routes/apiRoutes.js');

app.use('/', homeRoutes);
app.use('/user', userRoutes);
app.use('/api', api);

app.use((req, res, next) => {
    res.status(404).render('utils/notFound')
})
