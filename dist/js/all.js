const burger = document.querySelector('.burger-menu');
const menu = document.querySelector('.header-menu');

function handlerBurger() {
  burger.classList.toggle('active');
  menu.classList.toggle('active');
}

burger.addEventListener('click', handlerBurger);
