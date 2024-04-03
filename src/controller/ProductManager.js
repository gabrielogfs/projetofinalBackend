const fs = require('fs')

// Main Class: Product Manager

class ProductManager {
  constructor(jsonfFilePath = "./src/products.json") {
    this.products = [];
    this.currentId = 1;
    this.loadProducts();
  }

  // Load JSON Data
  async loadProducts(jsonFilePath){
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

// 1º Método: Adição de produtos
async addProduct(
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
    
      // Add created product in JSON file
      fs.writeFile(
        "products.json",
        JSON.stringify(this.products, null, 2),
        (err) => {
          if (err) {
            console.error("Erro ao criar produto no arquivo JSON: ", err);
          }
        }
      )
    }

// 2º Método: Busca de produtos partindo do código
async showProductbyCode(code){
    try {
        if (this.products.length === 0) {
            console.error("Não há produtos em sua lista.");
            return null
        } else {
            const product = this.products.find((product) => product.code === code)
            if (product) {
                return product
            } else {
                console.error(`Produto com o ID "${code}" não encontrado.`)
                return null
            }
        } 
    } catch (error) {
        console.error("Erro ao buscar produto: ", error);
        return null;
    };
};

// 3º Método: Listagem de todos os produtos adicionados
async showProducts(req, res) {
    try{
        // leitura do input de limite, se não incluído = indefinido
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

        // lógica de pesquisa dos produtos no JSON
        const data = await fs.promises.readFile("./products.json", "utf-8");
        let products = JSON.parse(data);

        // validação do limite de produtos apresentados
        if(limit !== undefined) {
            products = products.slice(0, limit)
        };

        res.json(products);
    } catch (error) {
        console.error("Não foi possível realizar a consulta: ", error)
        res.status(404).send("Erro ao ler arquivo JSON.")
    };
};


// 4º Método: Atualização do estoque de um produto específico 
async uptdateStock(code, newStock){
    try{
        const product = this.products.find((product) => product.code === code)

        if(product){
            product.stock = newStock
        
            fs.writeFile("products.json", JSON.stringify(this.products, null, 2),
            (err) => {
                if(err){
                    console.error("Erro ao alterar o estoque do produto: ", err);
                } else {
                    console.log(`Estoque do produto ${product.title} atualizado com sucesso!`);
                }
            })
    }
} catch(error){
    console.error("Erro ao atualizar estoque do produto: ", error);
    return null
}
};

// 5ª Método: Deletar um produto específico
async deleteProduct(code){
    try{
        const product = this.products.find((product) => product.code === code);
        if(product !== -1) {
            let removedProduct = this.products.splice(product, 1)[0];

            fs.writeFile("products.json", JSON.stringify(this.products, null, 2),
            (err) => {
                if(err){
                    console.log("Erro ao excluír o produto: ", err);
                } else {
                    console.log(`O produto "${removedProduct}" foi excluído com sucesso.`)
                }
            })            
        }
    } catch(error){
        console.error("Erro ao exclu")
    }
}
};