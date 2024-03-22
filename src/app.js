const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// const ProductManager = require('./routes/ProductManager');
const port = 8080;  
const addProductRoutes = require('./routes/AddProduct');
const productRoutes = require('./routes/Products');


app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}.`));

app.use(bodyParser.json());
app.use('/api', addProductRoutes);
app.use('/api', productRoutes)

