// Each Product Quick View Module: JS
(() => {
  "use strict";
  const logo = document?.querySelector('.logo')?.querySelector("img")
  const logo_svg = document?.querySelector('.F1hUFe.jbTlie')?.querySelector("svg")

  if (logo_svg) {
    logo_svg.remove()
    let imgElement = document.createElement('img');
    imgElement.src = 'https://www.thezoots.com/wp-content/uploads/2015/02/google.png'
    imgElement.style.height = "50px";
    document?.querySelector('.F1hUFe.jbTlie').appendChild(imgElement)
  }

  else if (logo)
    logo.src = 'https://www.thezoots.com/wp-content/uploads/2015/02/google.png'

})();