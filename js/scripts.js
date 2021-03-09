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

const art_1 = new Article('Perfume', 'Kenzo', '150ml', 1200);
const art_2 = new Article('Ropa', 'Remera', 'M', 1000);
const art_3 = new Article('Perfume', 'Calsa', 'XL', 1500);
const art_4 = new Article('Ropa', 'Chomba', 'M', 1300);

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

    const li = document.createElement('li');
    li.className = 'card';

    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.setAttribute('alt', `${art.description}`);
    img.setAttribute('src', `${path}${art.image}`);
    li.append(img);

    const div = document.createElement('div');
    div.className = 'card-body';
    li.append(div);

    const h3 = document.createElement('h3');
    h3.className = 'card-title';
    h3.textContent = `${art.description}`;
    div.append(h3);

    const ulChild = document.createElement('ul');
    ulChild.className = 'list-group list-group-flush';
    li.append(ulChild);

    const ulChild_li = document.createElement('li');
    ulChild_li.className = 'list-group-item';
    ulChild.append(ulChild_li);

    const select = document.createElement('select');
    select.setAttribute('name', 'size');
    select.setAttribute('id', 'size');
    ulChild_li.append(select);

    art.size.map(size => {  
      const option = document.createElement('option');
      option.setAttribute('value', `${Object.keys(size)}`);
      option.textContent = `${Object.values(size)}`;
      select.append(option);
    });

    const ulChild_li2 = document.createElement('li');
    ulChild_li2.className = 'list-group-item';
    ulChild_li2.textContent = `Precio : ${art.price}`;
    ulChild.append(ulChild_li2);

    const addCartDiv = document.createElement('div');
    addCartDiv.className = 'card-body addToCart';
    li.append(addCartDiv);

    const a = document.createElement('a');
    a.className = 'card-link';
    a.textContent = 'Agregar a carrito';
    a.setAttribute('href', 'cart.html');
    addCartDiv.append(a);

    a.addEventListener('click', () => {
      cart.addArticleToCart(art);
      localStorage.setItem(`${art.id}`, JSON.stringify(art));
    });

    if (art.category === 'sportswear') {
      sportList.append(li);
    } else if (art.category === 'casualCloths') {
      casualList.append(li);
    } else if (art.category === 'perfume') {
      perfumesList.append(li);
    }
  })
}

getDataJSON();

