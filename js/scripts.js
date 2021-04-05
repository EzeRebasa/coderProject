

/**
 * 
 * @param {number} content // Si hay artículos se muestra el carrito sino un mensaje de vacío
 *  
 */

const getDataAsync = async () => {
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


const cart = new Cart();
cart.updateBadge();

let pathname = window.location.pathname;
pathname = pathname.substring(7);

if (pathname === 'cart.html') {
  buildTableCart();
  orderText();
} else if ((pathname === 'news.html') || (pathname === 'catalog.html')) {
  getDataAsync();
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
      cart.articles.forEach(art => {
        artText = `============================%0A *Artículo: ${art.name} %0A Tamaño: ${art.size} %0A Unidades: ${art.cant} %0A Precio unitario:$ ${art.price} %0A Sub-total: $ ${art.fullPrice}* %0A ============================ %0A`
        order.innerHTML += artText;
      });
      order.innerHTML += `*Total*: *$${$('.total')[0].innerHTML}*`;
      $('#cartSubmit').attr('disabled', true);
    });
  });
}

/**
 * FORM DATA CAPTURE
*/
$(':reset').on('click', () => {
  $('#order').html('');
});


const urlDesktop = 'https://web.whatsapp.com/';
const urlMobile = 'whatsapp://';
const telefono = ''; // Acá añadir whatsapp adonde recibir los mensajes

$('#orderSubmit').on('click', (e) => {
  e.preventDefault();
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

function showToggleCart(message) {
  console.log(`Entró  ${JSON.stringify($('.toggle-cart')[0])}`);
  $('.toggle-cart').prepend(`<p> ${message} </p>`);
  $('.toggle-cart').fadeIn();
}