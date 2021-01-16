const navSlide = () => {
  const burguer = document.querySelector(".burguer");
  const nav = document.querySelector(".navbarResponsive__links");
  const navLinks = document.querySelectorAll('.navbarResponsive__links li');

  burguer.addEventListener("click", () => {
       // Toggle nav
    nav.classList.toggle("nav--active");
     // Animate links
    navLinks.forEach((link, index) => {
        if (link.style.animation){
            link.style.animation = '';
        } else {
          link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    })
     // Burguer animation
    burguer.classList.toggle('toggle');
  });
 


};

navSlide();
