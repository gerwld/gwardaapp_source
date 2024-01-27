// Each Product Quick View Module: JS
(() => {
  "use strict";
  const logo = document?.querySelector('.logo')?.querySelector("img")
  const logo_svg = document?.querySelector('.F1hUFe.jbTlie')?.querySelector("svg")

  if (logo_svg) {
    logo_svg.remove()
    let imgElement = document.createElement('img');
    imgElement.src = ''
    imgElement.style.height = "50px";
    document?.querySelector('.F1hUFe.jbTlie').appendChild(imgElement)
  }

  else if (logo)
    logo.src = ''

})();