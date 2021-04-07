/**
 * ============================================================
 * ======================== CLASSES ===========================
 * ============================================================
 */

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

  setOrder = () => {
    this.orderMessage = `*Cliente*: _${this.firstName}_ _${this.lastName}_%0A *Email*: ${this.email}%0A *Cel*: ${this.phone}%0A *Domicilio*: ${this.address} ${this.house}%0A *Pedido*: ${this.order}`
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
    totalPrice.innerHTML = `$${total}`;
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
      // this.setFullPrice(artToAdd);
      showToggleCart('add', `Tiene ${artToAdd.cant} unidades de ${artToAdd.name} en el carrito!`);
    } else if (art.id != "" && art.category != "" && art.name != "" && art.size != "" && art.price != "") {
      art = { cant: 1, ...art };
      this.articles = [art, ...this.articles];
      showToggleCart('add', `Se agregó ${art.name} al carrito!`);
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

    let article = this.getArticleById(id);
    let index = this.articles.indexOf(article);

    if (article) {
      this.articles.splice(index, 1);
      this.storageArticles();
      buildTableCart();
      showToggleCart('remove', `Se eliminó ${article.name} del carrito`);
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
   * Will keep the cart updated with what the user has entered
   */
  storageArticles = function () {
    localStorage.setItem('cart', JSON.stringify(cart.articles));
    this.updateBadge();
  }
}
/**
 * ============================================================
 * ========================== CODE ============================
 * ============================================================
 */

const divCart = document.querySelector('.cartMain__container__row__cartForm');
const divCartForm = document.createElement('div');
const formElement = document.createElement('form');
formElement.setAttribute('id', 'cartFormData');

const cart = new Cart();
cart.updateBadge();

let pathname = window.location.pathname;
pathname = pathname.substring(7);

if (pathname === 'cart.html') {
  buildTableCart();
  orderText();
  submitOrder();

} else if ((pathname === 'news.html') || (pathname === 'catalog.html')) {
    getDataAsync();
}


$('.artCant').on('change', () => {
  alert('Cambio');
})

/**
 * ==================================================================
 * ======================== FUNCTIONS ===============================
 * ==================================================================
 */

/**
 * 
 * @param {number} content // Si hay artículos se muestra el carrito sino un mensaje de vacío
 *  
 */

async function getDataAsync() {
  try {
    let response = await fetch('../database/data.json');
    let articles = await response.json();
    myData = articles;

    buildListArticles(articles);
  } catch (error) {
    console.log(error.message);
  }
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
                      <td colspan="3" class="total" >${total}</td>
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
  cart.removeArticleById(id);
}

function addToCart(event) {

  let foundArticle = myData.find(article => article.id == event.target.dataset.id);
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
 * ==============================================
 * FUNCTIONS THAT MODIFY THE QUANTITY OF ARTICLES
 * ==============================================
*/

/**
* @param {number} id  Receives an 'id' of article 
*/
function addItem(id) {

  const art = cart.getArticleById(id);
  art.cant += 1;
  const cant = document.querySelector(`[data-cant='${id}']`);
  cart.setFullPrice(art);
  cart.setTotal();
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
    cart.setTotal();
    cant.value = Number(cant.value) - 1;
    cart.storageArticles();
  } else {
    removeArticle(id);
  }
}



/**
 * ===========================================
 * FORM DATA CAPTURE AND MESSAGE SUBMISSION
 * ===========================================
*/
function submitOrder() {

  $(':reset').on('click', () => {
    $('#order').html('');
    $('#cartSubmit').attr('disabled', false);
  });

  const urlDesktop = 'https://web.whatsapp.com/';
  const urlMobile = 'whatsapp://';
  const telefono = ''; // Acá añadir whatsapp adonde recibir los mensajes



  $('#orderSubmit').on('click', (e) => {
    e.preventDefault();

    let isValid = document.querySelector('#form').checkValidity();

    if (isValid) {

      let firstname = $('#firstname').val();
      let lastname = $('#lastname').val();
      let email = $('#email').val();
      let phone = $('#phone').val();
      let address = $('#address').val();
      let buildingType = $("[name=building]:checked").val();
      let textOrder = $('#order').val();

      const order = new Order(firstname, lastname, email, phone, address, buildingType, textOrder);

      setTimeout(() => {
        order.setOrder();
        let mensaje = `send?phone=${telefono}&text=${order.orderMessage}`;
        if (isMobile()) {
          window.open(urlMobile + mensaje, '_blank')
        } else {
          window.open(urlDesktop + mensaje, '_blank')
        }
      }, 3000);
    }
  })

  function isMobile() {
    if (sessionStorage.desktop)
      return false;
    else if (localStorage.mobile)
      return true;
    var mobile = ['iphone', 'ipad', 'android', 'blackberry', 'nokia', 'opera mini', 'windows mobile', 'windows phone', 'iemobile'];
    for (var i in mobile)
      if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;
    return false;
  }
}
/**
 * This function generate the text with the order and inserts it in the form
 */

function orderText() {

  const order = $('#order')[0];
  $('#cartSubmit').on('click', () => {
    $('#cartFormData').on('submit', (e) => {
      e.preventDefault();
      let artText = '';
      order.innerHTML = '';
      cart.articles.forEach(art => {
        artText += `============================%0A *Artículo: ${art.name} %0A Tamaño: ${art.size} %0A Unidades: ${art.cant} %0A Precio unitario:$ ${art.price} %0A Sub-total: $ ${art.fullPrice}* %0A ============================ %0A`;
      });
      console.log(order);
      artText += `*Total*: *${$('.total')[0].innerHTML}*`;
      order.innerHTML = artText;
      $('#cartSubmit').attr('disabled', true);
    });
  });
}
/**
 * ===========================================
 *                         
 * ===========================================
*/

/**
 * 
 * @param {string} method // receives 'add' or 'remove' according to the method that calls it
 * @param {string} message // Message that will be displayed when adding an article
 * 
 */

function showToggleCart(method, message) {

  let bgColor = '#e9e2e8';
  let bdColor = '#40264bb3';
  if (method === 'add') {
    bgColor = '#2ecc7080';
    bdColor = '#2ecc70';
  } else if (method === 'remove') {
    bgColor = '#ff634780';
    bdColor = '#ff6347';
  }

  $('.toggle-cart').css({
    "background-color": bgColor,
    "border": `2px solid ${bdColor}`
  });
  $('.toggle-cart').empty();
  $('.toggle-cart').prepend(`<p> ${message} </p>`);
  $('.toggle-cart').slideToggle('slow')
    .delay(2000)
    .slideToggle('slow');
}




