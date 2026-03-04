document.addEventListener('DOMContentLoaded', () => {
  // Скрипты для компонента "input"
  const inputsPhones = document.querySelectorAll('.input--phone');
  if (inputsPhones.length) {
    inputsPhones.forEach(inputPhone => {
      if (inputPhone) {
        inputPhone.setAttribute('maxlength', '18');
        inputPhone.setAttribute('minlength', '18');

        const maskOptions = {
          mask: '+{7} (000) 000-00-00',
          overwrite: true
        };

        IMask(inputPhone, maskOptions);
      }
    })
  }
});
