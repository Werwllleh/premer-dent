document.addEventListener('DOMContentLoaded', () => {
  // Скрипты для блока "footer"
  const block = document.querySelector('.footer')
  if (block) {}

  const footerYear = document.querySelector('.footer__disclaimer--copyright span');
  if (footerYear) {
    footerYear.innerText = new Date().getFullYear();
  }
});
