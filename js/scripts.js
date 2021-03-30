class Article {

  constructor(id, category, name, size, price) {
    this.id = id;
    this.category = category;
    this.name = name;
    this.size = size;
    this.price = price;
    this.fullPrice = this.price;
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

class Cart {
  constructor() {
    this.articles = this.getArticles() || [];
  }
  // Getters & Setters

  /**
  * 
  * @returns the stored articles in the cart 
  */
  getArticles = () => {
    const articles = JSON.parse(localStorage.getItem('cart'));
    if (articles) {
      return articles;
    }
    return null;
  }

  getArticleById = (articleId) => {

    let article = this.articles.find(art => art.id == articleId);

    if (article) {
      return article;
    } else {
      console.log(`El artículo con id ${articleId} no se encuentra`);
    }
  }

  /**
   * 
   * @returns {number} of items cart
   */
  getTotalArticles = () => {
    let items = 0;
    if (this.articles) {
      this.articles.forEach(() => items++);
    }
    return items;
  }

  setFullPrice = (art) => {
    art.fullPrice = art.cant * art.price;
    const fullPriceRow = document.querySelector(`[data-full-price='${art.id}']`);
    fullPriceRow.innerHTML = art.fullPrice;
  };

  setTotal = () => {
    let total = 0;

    this.articles.forEach(art => {
      total += art.fullPrice;
      this.setFullPrice(art);
    });
    const totalPrice = document.querySelector('.total');
    console.log(totalPrice);
    totalPrice.innerHTML = total;
  }

  // Methods

  /**
   * 
   * @param {Article} art // Receives an object Article
   */

  addArticleToCart = function (art) {

    const artToAdd = this.getArticleById(art.id);

    if (artToAdd) {
      artToAdd.cant += 1;
      this.setFullPrice(artToAdd);
      console.log(artToAdd);
    } else if (art.id != "" && art.category != "" && art.name != "" && art.size != "" && art.price != "") {
      art = { cant: 1, ...art };
      this.articles = [art, ...this.articles];
      alert('El Articulo se ingresó correctamente!');
    } else {
      alert('Verifique los datos ingresados...');
    }

    this.storageArticles();
  }
  /**
   * 
   * @param {number} id 
   */

  removeArticleById = function (id) {
    console.log(`Remove : id ${id}`);
    let article = this.getArticleById(id);
    let index = this.articles.indexOf(article);

    if (article) {
      this.articles.splice(index, 1);
      this.storageArticles();
      // buildTableCart();
      alert(`Se eliminó el artículo ${article.name} del carrito`);
    } else {
      alert('Error al intentar borrar');
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

  updateBadge = function () {
    const badge = document.querySelector('.badge');
    badge.textContent = cart.getTotalArticles();
  }

  /**
   * 
   * @returns the order to be pasted in the textarea of ​​the form
   */

  //TODO: Check cant
  // validateCart = function () {
  //   let order = '';
  //   this.articles.forEach(art => {
  //     let size = art.category === 'Perfume' ? 'Medida' : 'Talle';
  //     let price = art.price * art.cant;

  //     order += `[Artículo]: ${art.name} [${size}]: ${art.size} [Items]: ${art.cant} [Precio]: ${price}`;
  //     order += '\n';
  //   });
  //   return order;
  // }

  /**
   * Will keep the cart updated with what the user has entered
   */
  storageArticles = function () {
    localStorage.setItem('cart', JSON.stringify(cart.articles));
    this.updateBadge();
  }

}

/**
 * 
 * @param {number} content // Si hay artículos se muestra el carrito sino un mensaje de vacío
 *  
 */

const getDataAsync = async () => {
  let response = await fetch('../database/data.json');
  let articles = await response.json();
  myData = articles;
  buildListArticles(articles);
}

function buildListArticles(jsonObjArray) {
  const path = '../assets/';
  const perfumesList = document.querySelector('#perfume ul');
  const sportList = document.querySelector('#sport ul');
  const casualList = document.querySelector('#casual ul');

  jsonObjArray.map(art => {
    let htmlText = '';
    const { id, image, description, size, price } = art;

    htmlText = `<li class="card">
              <img src='${path}${image}' class="card-img-top"
                alt='${description}' />
              <div class="card-body">
                <h3 class="card-title">${description}</h3>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <select name="size" id="size${id}" >
                    ${size.map(s => `<option value='${Object.keys(s)}'>${Object.values(s)}</option>`)}
                  </select>
                </li>
                <li class="list-group-item">Precio : $${price}</li>
              </ul>
              <div class="card-body addToCart">
                <a class="card-link" data-id=${id} onclick="addToCart(event)">Agregar a carrito <svg xmlns="http://www.w3.org/2000/svg"
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
//TODO: totalPrice and subtotal
function buildTableCart() {
  cleanHTML();

  divCartForm.className = 'cartForm';
  divCart.append(divCartForm);
  let total = 0;

  let htmlText = '';
  if ((cart.getArticles()) && (cart.getArticles().length !== 0)) {

    htmlText = `
            <table cellspacing="0" cellpadding="0" class="table-responsive">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario ($)</th>
                  <th>Subtotal ($)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody class="tbody">`;
    cart.getArticles().forEach(art => {
      total += art.fullPrice;
      htmlText += `<tr>
                  <td  data-name="${art.id}" >${art.name} - ${art.size}</td>
                  <td class="tdCant">
                    <button 
                      class="subtract" 
                      type="button"
                      onclick=subtractItem('${art.id}') 
                    > - </button>
                    <input type="text" value=${art.cant} class="artCant" data-cant=${art.id} />
                    <button 
                      class="add"
                      type="button"
                      onclick="addItem('${art.id}')" 
                    > + </button>
                  </td>
                  <td data-price=${art.id}>${art.price}</td>
                  <td class="subtotal" data-full-price=${art.id}> ${art.fullPrice} </td>
                  <td>
                    <button
                      class="button--delete"
                      onclick="removeArticle('${art.id}')"
                    >Quitar</button>
                  </td>
                </tr>`
    });
    htmlText += `</tbody >
              
                  <tfoot>
                    <tr>
                      <td colspan="2">
                        <input
                          id="cartSubmit"
                          type="submit"
                          value="CONFIRMAR PEDIDO"
                          class="button--confirm"
                        />
                      </td>
                      <td colspan="3" class="total" > ${total} </td>
                    </tr>
                  </tfoot>
            </table >`;
    formElement.innerHTML = htmlText;
    divCartForm.append(formElement);

  } else {

    const message = document.createElement('p');
    message.textContent = 'NO HAY ARTICULOS EN EL CARRITO';

    divCartForm.append(message);
  }
}

function removeArticle(id) {
  console.log('Entro en remove');
  cart.removeArticleById(id);
}

function addToCart(event) {

  let foundArticle = myData.find(article => article.id == event.target.dataset.id);
  console.log(foundArticle);
  const { id, category, description, price } = foundArticle;
  const size = document.querySelector(`#size${id}`).value;
  const idArt = `${id}${size}`;
  const article = new Article(idArt, category, description, size, price);
  cart.addArticleToCart(article);
}

function cleanHTML() {
  while (divCartForm.firstChild) {
    divCartForm.removeChild(divCartForm.firstChild);
  }
}

/**
* 
* @param {number} id  Receives an 'id' of article 
*/
function addItem(id) {

  const art = cart.getArticleById(id);
  art.cant += 1;

  const cant = document.querySelector(`[data-cant='${id}']`);

  cart.setFullPrice(art);

  cant.value = Number(cant.value) + 1;
  cart.storageArticles();
}
/**
 * 
 * @param {number} id  Receives an 'id' of article 
 */
function subtractItem(id) {
  const cant = document.querySelector(`[data-cant='${id}']`);

  if (cant.value > 1) {
    const art = cart.getArticleById(id);
    art.cant -= 1;
    cart.setFullPrice(art); // I update the subtotal in the table
    cant.value = Number(cant.value) - 1;
    cart.storageArticles();
  } else {
    removeArticle(id);
  }
}

const divCart = document.querySelector('.cartMain__container__row__cartForm');
const divCartForm = document.createElement('div');
const formElement = document.createElement('form');

formElement.setAttribute('id', 'cartFormData');

getDataAsync();
const cart = new Cart();
cart.updateBadge();
buildTableCart();


let data = [];

$('#cartSubmit').on('click', () => {
  $('#cartFormData').on('submit', (e) => {
    e.preventDefault();
    let artText = '';
    cart.articles.forEach(art => {
      artText = `
      ============================
      Artículo: ${art.name} 
      Tamaño: ${art.size}
      Unidades: ${art.cant}
      Precio unitario:$ ${art.price}
      Sub-total: $ ${art.fullPrice}
      ============================\n`
      $('#order')[0].innerHTML += artText;
      data = [artText, ...data];
    });
    let total = `Total: $${$('.total')[0].innerHTML}`;
  });
});

