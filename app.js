const { log } = require('console');
const express = require('express');
const path = require('path');

const app = express();

const publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath));

app.set('view engine', ejs);
app.set('views', path.resolve(__dirname, '../views'));

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});

app.get('/', (req, res) => {
    res.render(path.resolve(__dirname, './views/index.html'));
});
