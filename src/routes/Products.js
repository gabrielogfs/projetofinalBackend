const express = require("express");
const fs = require("fs");
const { Router } = require("express");
const router = Router();
const ProductManager = require("./ProductManager");

const productManager = new ProductManager();

// Consultar lista de produtos com limitador de quantidade
router.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

    const data = await fs.promises.readFile("./products.json", "utf-8");
    let products = JSON.parse(data);

    if (limit !== undefined) {
        products = products.slice(0, limit)
    };

    res.json(products);
  } catch (error) {
    console.error("Não foi possível realizar a consulta: ", error);
    res.status(500).send("Erro ao ler arquivo.");
  }
});

// Consultar produto a partir do código
ProductManager.prototype.getProductByCode = function(code) {
    try{
    if (this.products.length === 0) {
      console.log("Não há produtos em sua lista.");
      return null;
    } else {
      const product = this.products.find((product) => product.code === code);

      if (product) {
        return product;
      } else {
        console.error(`Produto com ID ${code} não encontrado.`);
        return null;
      }
    }
  } catch (error) {
    console.error("Erro ao buscar produto: ", error);
    return null;
  };
};

router.get('/products/:code', (req, res)=>{
    const code = req.params.code;
    const product = productManager.getProductByCode(code);

    if(product){
        res.json(product)
    } else {
        res.status(404).send(`Produto com o código ${code} não encontrado.`)
    };
});

productManager.addProduct = productManager.addProduct.bind(productManager);

module.exports = router;
