class Cart {
    constructor() {
        this.articles = [];
    }

    addArticle = function (art) {
        if (art instanceof Article) {
            if(art.category != "" && art.name != "" && art.size != "" && art.price != "") {
                this.articles.push(art);
                console.log('El Articulo se ingresó correctamente!');
            }
        } else {
            console.log('El objeto ingresado no es un Artículo!');
        }
    }

    getArticles = function () {
        if (this.articles) {
            this.articles.forEach(art => {
                art.getFullDescription();
            });
        }
    }
}

class Article {
    constructor(category, name, size, price) {
        this.latestId = 0;
        this.id = Article.incrementId();
        this.category = category;
        this.name = name;
        this.size = size;
        this.cant = 1;
        this.price = price;
    }

    getShortDescription = function () {
        console.log(`Artículo : ${this.name}
        ${this.category === "Perfume" ? 'Medida' : 'Talle'} : ${this.size}
        `);
    }

    getFullDescription = function () {
        console.log(`Id : ${this.id}
        Category : ${this.category}
        Artículo : ${this.name}
        ${this.category === "Perfume" ? 'Medida' : 'Talle'} : ${this.size}
        Cantidad : ${this.cant}
        Precio : ${this.price}
        `);
    }

    static incrementId() {
        if (!this.latestId) {
            this.latestId = 1;
        } else {
            this.latestId++;
        }
        return this.latestId;
    }
}


let cart = new Cart();
let art_1 = new Article('Perfume', 'Kenzo', '150ml', 1200);
let art_2 = new Article('Ropa', 'Remera', 'M', 1000);

let art_3 = new String('No soy un Artículo');

cart.addArticle(art_1);
cart.addArticle(art_2);
cart.addArticle(art_3);