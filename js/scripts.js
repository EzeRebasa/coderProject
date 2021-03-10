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
      art.fullPrice = art.cant * art.price;

      console.log('MOSTRANDO CANTIDAD');
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
  /**
   * 
   * @param {Article} art // Receives an object Article
   */

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
  /**
   * 
   * @param {number} id 
   */

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

  /**
   * 
   * @param {String} valueCompare  
   * @param {String} order // 'desc' or 'asc' as default
   */
  orderArticles = function (valueCompare, order = 'asc') { // Ascendent order by default

    this.articles.sort((a, b) => {

      if (order === 'asc') {
        if (a[valueCompare] > b[valueCompare]) {
          return 1;
        }
        if (a[valueCompare] < b[valueCompare]) {
          return -1;
        }
        // a must be equal to b
        return 0;
      } else if (order === 'desc') {
        if (a[valueCompare] < b[valueCompare]) {
          return 1;
        }
        if (a[valueCompare] > b[valueCompare]) {
          return -1;
        }
        // a must be equal to b
        return 0;
      }
    });
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
  /**
   * 
   * @returns Number of items cart
   */
  getTotalArticles = function () {
    let items = 0;
    this.articles.forEach(art => items++);
    return items;
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
    this.fullPrice = price;
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
  constructor(firstName, lastName, email, phoneNumber, address, house, order) {
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.email = email || '';
    this.phoneNumber = phoneNumber || '';
    this.address = address || '';
    this.house = house || '';
    this.order = order || '';
  }
  /** Completar setters... */

  setOrder = function (order) {
    if (order != '') {
      this.order = order;
    } else {
      console.log('No se guardó ninguna orden');
    }
  }
}

const cart = new Cart();
/** Cuando se presiona en la card agregar a carrito armo un objeto artículo y se lo mando a 
 * carrito para que lo trabaje */



/** Método que se ejecutará cuando se presione el botón quitar del carrito o cuando se 
 * introduzca 0 en el input de cantidad
 */

/** */
// cart.getArticles();

/** Cuando se quiera modificar la cantidad de items de un artículo */
// cart.setArticleCant(3, 3);

/** Cuando se presiona en confirmar pedido se instancia una Order/pedido 
 * la idea es que se copie esa info en el campo Pedido del form
*/
let newOrder = new Order();

let orderText = cart.validateCart();
newOrder.setOrder(orderText);
console.log(newOrder);

cart.orderArticles('id', 'desc');

console.log('************Después de ordenar**************');
cart.getArticles();

/** Suma de items para el badge */
const badgeCart = document.querySelector('.badge')
badgeCart.textContent = cart.getTotalArticles();

/**
 * 
 * @param {number} content // Si hay artículos se muestra el carrito sino un mensaje de vacío
 *  
 */

function cartContentVisibility(content) {
  const cartForm = document.querySelector('.cartForm');
  const cartMessage = document.querySelector('.cartMessage');

  if (content) {
    cartForm.style.display = "block";
    cartMessage.style.display = "none";
  } else {
    cartForm.style.display = "none";
    cartMessage.style.display = "block";
  }
}

function getDataJSON() {
  const requestURL = '../database/data.json';
  const request = new XMLHttpRequest();

  request.open('GET', requestURL);

  request.responseType = 'json';
  request.send();

  request.onload = function () {
    const articles = request.response;
    buildListArticles(articles);
  }
}

function buildListArticles(jsonObjArray) {
  const path = '../assets/';
  const perfumesList = document.querySelector('#perfume ul');
  const sportList = document.querySelector('#sport ul');
  const casualList = document.querySelector('#casual ul');

  jsonObjArray.map(art => {
    let htmlText = '';
    htmlText = `<li class="card">
              <img src='${path}${art.image}' class="card-img-top"
                alt='${art.description}' />
              <div class="card-body">
                <h3 class="card-title">${art.description}</h3>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <select name="size" id="size">
                    ${art.size.map(size => `<option value='${Object.keys(size)}'>${Object.values(size)}</option>`)}
                  </select>
                </li>
                <li class="list-group-item">Precio :$${art.price}</li>
              </ul>
              <div class="card-body addToCart">
                <a href="cart.html" class="card-link">Agregar a carrito <svg xmlns="http://www.w3.org/2000/svg"
                   fill="currentColor" class="bi bi-cart-plus" viewBox="0 0 16 16">
                   <path fill-rule="evenodd"
                     d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5
                       8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 
                       7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 
                       1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                   <path fill-rule="evenodd"
                     d="M8.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 
                     0 0 1 .5-.5z" />
                 </svg></a>
              </div>
            </li>`;

    if (art.category === 'sportswear') {
      sportList.innerHTML += htmlText;
    } else if (art.category === 'casualCloths') {
      casualList.innerHTML += htmlText;
    } else if (art.category === 'perfume') {
      perfumesList.innerHTML += htmlText;
    }
  });


}

getDataJSON();

