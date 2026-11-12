document.addEventListener('DOMContentLoaded', () => {
  // Скрипты для блока "cookie"
  const cookieBlock = document.querySelector('.cookie')
  if (!cookieBlock) return;

  const cookieStatus = localStorage.getItem('cookie-agree');
  if (!cookieStatus) {
    setTimeout(() => {
      cookieBlock.classList.add('show');
    }, 2000);

  }

  const agreeButton = cookieBlock.querySelector('.cookie__button');
  if (agreeButton) {
    agreeButton.addEventListener('click', () => {
      localStorage.setItem('cookie-agree', 'true');
      cookieBlock.classList.remove('show');
    })
  }

});
