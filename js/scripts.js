class Cart {
    constructor() {
        this.articles = [];
    }

    // Getters & Setters

    setArticleCant = function (articleId, cant) {
        if (cant == 0) {
            this.removeArticleById(articleId);
        } else if (cant > 0) {
            let art = this.getArticleById(articleId);
            art.cant = cant;
            console.log(art);
        } else {
            console.log('Debe ingresar valores positivos');
        }
    }

    getArticles = function () {

        if (this.articles) {
            this.articles.forEach(art => {
                console.log(art);;
            });
        }
    }

    getArticleById = function (articleId) {

        let article = this.articles.find(art => art.id === articleId);

        if (article) {
            return article;
        } else {
            console.log(`El artículo con id ${articleId} no se encuentra`);
        }
    }

    // Methods

    addArticleToCart = function (art) {
        if (art) {
            if (art.category != "" && art.name != "" && art.size != "" && art.price != "") {
                this.articles.push(art);
                console.log('El Articulo se ingresó correctamente!');
            } else {
                console.log('Verifique los datos ingresados...');
            }
        } else {
            console.log('No hay Artículo!');
        }
    }

    removeArticleById = function (id) {
        let article = this.getArticleById(id);
        let index = this.articles.indexOf(article);

        if (article) {
            this.articles.splice(index, 1);
            console.log(`Se eliminó el artículo ${article.name} del carrito`);
        } else {
            console.log('Error al intentar borrar');
        }
    }
    
    validateCart = function () {
        let order = '';
        this.articles.forEach(art => {
            let size = art.category === 'Perfume' ? 'Medida' : 'Talle';
            let price = art.price * art.cant; 

            order += `[Artículo]: ${art.name} [${size}]: ${art.size} [Items]: ${art.cant} [Precio]: ${price}`;
            order += '\n'; // Porqué se me muestra /n en el string?? :S
        });
        return order;
    }

}
class Article {

    constructor(category, name, size, price) {
        this.id = Article.incrementId();
        this.category = category;
        this.name = name;
        this.size = size;
        this.cant = 1;
        this.price = price;
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

class Order {
    constructor(firstName, lastName, email, phoneNumber, address, house, order){
        this.firstName = firstName || '';
        this.lastName = lastName || '';
        this.email = email || '';
        this.phoneNumber = phoneNumber || '';
        this.address = address || '';
        this.house = house || '';
        this.order = order || '';
    }
    /** Completar setters... */

    setOrder = function(order) {
        if(order != ''){
            this.order = order;
        }else{
            console.log('No se guardó ninguna orden');
        }
    }
}

let cart = new Cart();

/** Cuando se presiona en la card agregar a carrito armo un objeto artículo y se lo mando a 
 * carrito para que lo trabaje */

let art_1 = new Article('Perfume', 'Kenzo', '150ml', 1200);
let art_2 = new Article('Ropa', 'Remera', 'M', 1000);
let art_3 = new Article('Perfume', 'Calsa', 'XL', 1500);
let art_4 = new Article('Ropa', 'Chomba', 'M', 1300);

cart.addArticleToCart(art_1);
cart.addArticleToCart(art_2);
cart.addArticleToCart(art_3);
cart.addArticleToCart(art_4);

/** Método que se ejecutará cuando se presione el botón quitar del carrito o cuando se 
 * introduzca 0 en el input de cantidad
 */


/** */
cart.getArticles();

/** Cuando se quiera modificar la cantidad de items de un artículo */
cart.setArticleCant(3, 3);

/** Cuando se presiona en confirmar pedido se instancia una Order/pedido 
 * la idea es que se copie esa info en el campo Pedido del form
*/
// let newOrder = new Order();

// let orderText = cart.validateCart();
// newOrder.setOrder(orderText);
// console.log(newOrder);


/** DESAFIO COMPLEMENTARIO */
console.log('***************Antes de Ordenar**************');
cart.getArticles();

ascendentSort(cart.articles, 'name')

console.log('************Después de ordenar**************');
cart.getArticles();

function ascendentSort(array, value) {

    array.sort( (a, b) => {
            if (a[value] > b[value]) {
              return 1;
            }
            if (a[value] < b[value]) {
              return -1;
            }
            // a must be equal to b
            return 0;
    });

}
