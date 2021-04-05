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
        // this.setFullPrice(artToAdd);
        console.log(artToAdd);
        showToggleCart(`Tiene ${artToAdd.cant} unidades de ${artToAdd.name} en el carrito!`);
      } else if (art.id != "" && art.category != "" && art.name != "" && art.size != "" && art.price != "") {
        art = { cant: 1, ...art };
        this.articles = [art, ...this.articles];
        showToggleCart(`Se agregó ${art.name} al carrito!`);
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
        buildTableCart();
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