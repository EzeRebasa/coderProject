let myData = [];

/**
 * ============================================================
 * ========================== CODE ============================
 * ============================================================
 */


let pathname = window.location.pathname;
pathname = pathname.substring(7);

updateBadge();

if (pathname === 'cart.html') {
  buildTableCart();
  orderText();
  submitOrder();

} else if ((pathname === 'news.html') || (pathname === 'catalog.html')) {
  getDataAsync();

}


$('.artCant').on('keypress', (e) => {
  if (e.key == 'Enter') {
    e.preventDefault();
    $('.artCant').blur();
  }
});





