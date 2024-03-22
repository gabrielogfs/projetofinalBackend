const { Router } = require("express");
const express = require('express');
const router = Router();
const bodyParser = require('body-parser');
const fs = require("fs");
const ProductManager = require("./ProductManager");
const app = express();

const productManager = new ProductManager();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Adicionar novos produtos
ProductManager.prototype.addProduct = function(
title,
description,
price,
status,
category,
thumbnail,
code,
stock
) {

  // Validação dos campos obrigatórios
  if (
    !title ||
    !description ||
    !price ||
    !category ||
    !code ||
    stock === undefined
  ) {
    console.error(
      "O produto não foi adicionado, pois todos os campos são obrigatórios."
    );
    return;
  }

  // Validação do ID individual do produto
  if (this.products.some((product) => product.code === code)) {
    console.error(`Código "${code}" já existe. Produto não adicionado.`);
    return;
  }

  const newProduct = {
    id: this.currentId++,
    title,
    description,
    price,
    status,
    category,
    thumbnail,
    code,
    stock,
  };

  this.products.push(newProduct);
  console.log(`Produto "${title}" adicionado com sucesso.`);

  // Adicionar o produto criado no JSON

  fs.writeFile(
    "products.json",
    JSON.stringify(this.products, null, 2),
    (err) => {
      if (err) {
        console.error("Erro ao criar produto no arquivo JSON: ", err);
      }
    }
  );
};

productManager.addProduct = productManager.addProduct.bind(productManager);

router.post("/products/add", (req, res) => {
  const { title, description, price,status, category, thumbnail, code, stock } = req.body;
  productManager.addProduct(title, description, price, status, category, thumbnail, code, stock);
  res.send("Produto adicionado com sucesso!");
});

module.exports = router;
