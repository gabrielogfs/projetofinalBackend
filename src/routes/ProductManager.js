const fs = require('fs')

// classe principal

class ProductManager {
  constructor(jsonfFilePath = "./src/products.json") {
    this.products = [];
    this.currentId = 1;
    this.loadProducts();
  }

  // Carregar dados contidos no JSON
  loadProducts(jsonFilePath) {
    try {
        if (!jsonFilePath) {
            jsonFilePath = "./products.json";
        }
      const data = fs.readFileSync(jsonFilePath, "utf8");
      this.products = JSON.parse(data);
      this.currentId =
        this.products.length > 0
          ? this.products[this.products.length - 1].id + 1
          : 1;
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  }
}

module.exports = ProductManager;