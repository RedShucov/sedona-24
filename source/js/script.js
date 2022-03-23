const headerHamburger = document.querySelector('.site-navigation__hamburger')
const headerToggle = document.querySelector('.site-navigation__hamburger-inner')
const mobileMenu = document.querySelector('.site-navigation__list')
const bodyOverflow = document.querySelector('body')

headerHamburger.onclick = function () {
  headerToggle.classList.toggle('site-navigation__hamburger-inner-js--open');
  mobileMenu.classList.toggle('site-navigation__list--js-open');
  bodyOverflow.classList.toggle('show-main-nav');
}

window.addEventListener("resize", function () {
  if (window.matchMedia("(min-width: 768px)").matches) {
    headerToggle.classList.remove('site-navigation__hamburger-inner-js--open');
    mobileMenu.classList.remove('site-navigation__list--js-open');
    bodyOverflow.classList.remove('show-main-nav');
  }
});
