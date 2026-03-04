document.addEventListener('DOMContentLoaded', () => {

  initForms();

})

function initForms() {

  const forms = document.querySelectorAll('form');
  if (!forms.length) return;

  forms.forEach(form => {

    const formType = form.dataset.form;

    form.setAttribute('novalidate', '')

    startValidation(form)

    if (formType === 'consultation') {
      const connectTypeInput = form.querySelector('input[data-input="segmented"]');
      if (!connectTypeInput) return;

      const changeableFields = form.querySelectorAll('[data-form-field]');

      if (!changeableFields.length) return;

      connectTypeInput.addEventListener('change', () => {
        changeableFields.forEach(field => {
          field.classList.add('hide')

          const fieldType = field.dataset.formField;

          if (fieldType === connectTypeInput.value) {
            field.classList.remove('hide');
          }
        })

        revalidateForm(form);
      })
    }

  });

}

function startValidation(form) {

  const formType = form.dataset.form;

  const onlyWords = /^[a-zA-Zа-яА-ЯёЁ"'«».,\s]+$/;

  const submitButton = form.querySelector('button[type="submit"]');

  const inputList = Array.from(form.querySelectorAll('input:not([hidden]):not([type="checkbox"]):not([data-input="segmented"])'));
  const checkboxList = Array.from(form.querySelectorAll('input[type="checkbox"][required]:not([hidden])'));

  if (!inputList.length || !submitButton) return;

  toggleButton()

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (hasInvalidInput()) {
      formError(form,true)
      inputList.forEach((inputElement) => {
        checkInputValidity(inputElement)
      })
      checkboxList?.forEach((checkboxElement) => {
        checkInputValidity(checkboxElement)
      })
    } else {
      if (formType === 'consultation') {
        closeModalByName('consultation')

        setTimeout(() => {
          showModal('success')
        }, 300)

      }
      resetForm(form);
    }
  })

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      if (inputElement.value.length) {
        inputElement.classList.add('filled')
      }
      formError(form,false)
      checkInputValidity(inputElement)
      toggleButton()
    })
    inputElement.addEventListener('blur', () => {
      inputElement.classList.remove('focus');
      if (!inputElement.value.length) {
        inputElement.classList.remove('filled')
        inputElement.classList.remove('error')
      }
      checkInputValidity(inputElement)
      toggleButton()
    })
    inputElement.addEventListener('focus', () => {
      formError(form,false)
      inputElement.classList.add('focus');
      checkInputValidity(inputElement)
      toggleButton()
    })
  })

  checkboxList?.forEach((checkboxElement) => {
    checkboxElement.addEventListener('change', () => {
      checkboxElement.toggleAttribute('valid', checkboxElement.checked)
      toggleButton()
    })
  })

  function checkInputValidity(inputElement) {
    const type = inputElement.dataset.input

    if (!type) return;

    const label = inputElement.closest('.input-field');
    const errorElement = label.querySelector(`[data-input-error="${type}"]`);
    errorElement.textContent = "Некорректное значение";

    const value = inputElement.value

    switch (type) {
      case 'name':
        if (value.trim() === '') {
          toggleInputError(inputElement, false)
          inputElement.removeAttribute('valid')
          return;
        }

        if (!onlyWords.test(value.trim()) || value.trim().length <= 2) {
          toggleInputError(inputElement, 'Некорректное значение')
          inputElement.removeAttribute('valid')
        } else {
          toggleInputError(inputElement, false)
          inputElement.setAttribute('valid', true)
        }
        break
      case 'phone':
        const cleanedPhone = value.replace(/\D/g, '').replace(/^7/, '7');

        if (cleanedPhone.trim() === '7' || cleanedPhone.trim().length === 0) {
          toggleInputError(inputElement, '')
          inputElement.removeAttribute('valid')
        } else if (cleanedPhone.length === 11) {
          inputElement.setAttribute('valid', true)
          toggleInputError(inputElement, '')
        } else {
          inputElement.removeAttribute('valid')
          toggleInputError(inputElement, 'Укажите корректный номер')
        }
        break
      case 'email':
        if (value.trim() === '') {
          toggleInputError(inputElement, false)
          inputElement.removeAttribute('valid')
          return;
        }

        const atIncluded = value.includes('@');
        const dotIncluded = value.includes('.');
        const lastDotIndex = value.lastIndexOf('.');
        const domainPartLength = value.length - lastDotIndex - 1;

        const validEmail = atIncluded && dotIncluded && domainPartLength >= 2;

        if (!validEmail) {
          toggleInputError(inputElement, 'Некорректное значение')
          inputElement.removeAttribute('valid')
        } else {
          toggleInputError(inputElement, false)
          inputElement.setAttribute('valid', true)
        }

        break;
      default:
        toggleInputError(inputElement, '')
        inputElement.removeAttribute('valid')
    }

  }

  function hasInvalidInput() {

    if (checkboxList.length) {
      return (
        inputList.filter(input => !input.closest('.hide')).some(input => !input.hasAttribute('valid'))
        ||
        checkboxList?.filter(input => !input.closest('.hide')).some(cb => !cb.hasAttribute('valid'))
      );
    } else {
      return (
        inputList.filter(input => !input.closest('.hide')).some(input => !input.hasAttribute('valid'))
      );
    }
  }

  function toggleInputError(inputElement, errorMessage) {
    const type = inputElement.dataset.input

    if (!type) return;

    const label = inputElement.closest('.input-field');
    const errorElement = label.querySelector(`[data-input-error="${type}"]`)

    if (errorMessage) {
      inputElement.classList.add('error')
      errorElement.textContent = errorMessage
      label.style.marginBottom = '30px'
    } else {
      inputElement.classList.remove('error')
      errorElement.textContent = ''
      label.style.marginBottom = ''
    }
  }

  function toggleButton() {
    if (hasInvalidInput()) {
      submitButton.setAttribute('disabled', '');
      // formError(true)
    } else {
      submitButton.removeAttribute('disabled')
      // formError(false)
    }
  }


}

function formError(form, active) {
  const formErrorField = form.querySelector('[data-form-error]');

  if (!formErrorField) return;

  if (!active) {
    formErrorField.classList.remove('active');
  } else {
    formErrorField.textContent = 'Проверьте корректное заполнение полей';
    formErrorField.classList.add('active');
  }
}

function resetForm(form) {
  setTimeout(() => {
    form.reset()

    const inputs = form.querySelectorAll('input:not([type="checkbox"])');
    if (inputs.length) {
      inputs.forEach(input => {
        input.classList.remove('focus', 'filled', 'error')
        input.removeAttribute('valid')
      })
    }

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length) {
      checkboxes.forEach(checkbox => {
        checkbox.checked = false
        checkbox.removeAttribute('valid')
      });
    }


  }, 300)
}

function revalidateForm(form) {

  let noValidate = false;

  const inputList = Array.from(form.querySelectorAll('input:not([hidden]):not([type="checkbox"]):not([data-input="segmented"])'));
  const checkboxList = Array.from(form.querySelectorAll('input[type="checkbox"][required]:not([hidden])'));
  const submitButton = form.querySelector('button[type="submit"]');

  if (!inputList.length || !submitButton) return;

  if (checkboxList.length) {

    noValidate = inputList.filter(input => !input.closest('.hide')).some(input => !input.hasAttribute('valid'))
      || checkboxList.filter(input => !input.closest('.hide')).some(cb => !cb.hasAttribute('valid'))
  } else {
    noValidate = inputList.filter(input => !input.closest('.hide')).some(input => !input.hasAttribute('valid'))
  }

  if (noValidate) {
    submitButton.setAttribute('disabled', '');
  } else {
    submitButton.removeAttribute('disabled');
    formError(form, false)
  }

}
