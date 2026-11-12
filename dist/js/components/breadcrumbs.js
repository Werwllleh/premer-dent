document.addEventListener('DOMContentLoaded', () => {
  const component = document.querySelector('.breadcrumbs')
  if (component) {
    const list = component.querySelector('.breadcrumbs__list');

    const checkOverflow = () => {
      // Проверяем переполнение справа
      const hasRightOverflow = list.scrollWidth > list.clientWidth && list.scrollLeft < (list.scrollWidth - list.clientWidth-1);
      component.classList.toggle('breadcrumbs--has-right-overflow', hasRightOverflow);

      // Проверяем скролл слева
      const hasLeftOverflow = list.scrollLeft > 0;
      component.classList.toggle('breadcrumbs--has-left-overflow', hasLeftOverflow);
    };

    // Первоначальная проверка
    checkOverflow();

    // Проверка при скролле
    list.addEventListener('scroll', checkOverflow);

    // Проверка при изменении размера окна
    window.addEventListener('resize', checkOverflow);
  }
});
