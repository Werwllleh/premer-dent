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

document.addEventListener('DOMContentLoaded', () => {
  // Скрипты для блока "map"


  const mapElements = document.querySelectorAll('.map-element');

  if (!mapElements.length) return;

  mapElements.forEach((mapElement) => {
    initMap(mapElement);
  })

});


async function initMap(mapElement) {
  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;

  const map = new YMap(
    mapElement,
    {
      location: {
        center: [48.388840, 54.311690],
        zoom: 17.5,
      },
      behaviors: [
        'drag', // разрешаем перетаскивание
        // 'scrollZoom' - убираем скролл-зум
        // 'dblClickZoom' - убираем зум по двойному клику
        // 'multiTouch' - убираем мультитач-зум (для мобильных)
      ]
    }
  );

  // Добавляем базовые слои (обязательно ДО добавления маркеров)
  map.addChild(new YMapDefaultSchemeLayer());
  map.addChild(new YMapDefaultFeaturesLayer());

  // Создаём HTML-элемент маркера
  const markerElement = document.createElement("a");
  markerElement.href = "https://yandex.ru/maps/195/ulyanovsk/?ll=48.389410%2C54.311642&mode=poi&poi%5Bpoint%5D=48.388909%2C54.311624&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1125366534&z=18.55";
  markerElement.target = "_blank";
  markerElement.rel = "noopener noreferrer";
  markerElement.className = "map-marker";

  const icon = document.createElement("img");
  icon.src = "./images/map-icon.svg";
  icon.alt = "Метка карты";
  markerElement.appendChild(icon);

  // Создаём и добавляем маркер
  const marker = new YMapMarker(
    {
      coordinates: [48.388840, 54.311690]
    },
    markerElement
  );

  map.addChild(marker);
}

document.addEventListener('DOMContentLoaded', () => {
  const pricePage = document.querySelector('.page-general.price');
  if (pricePage) {

    const serviceButtons = pricePage.querySelectorAll('button.price__services--item');
    const serviceContents = pricePage.querySelectorAll('.price__service');

    if (serviceButtons.length && serviceContents.length) {
      serviceButtons.forEach(serviceButton => {
        serviceButton.addEventListener('click', (e) => {
          e.preventDefault();

          const param = serviceButton.getAttribute('data-service-id');
          if (!param) return;

          const content = pricePage.querySelector(`.price__service[data-service="${param}"]`)
          if (!content) return;

          // content.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
          const header = document.querySelector('.header');

          if (header) {
            const headerHeight = header.offsetHeight;
            const offset = 17

            const y =
              content.getBoundingClientRect().top +
              window.pageYOffset -
              headerHeight;

            window.scrollTo({
              top: y - offset,
              behavior: 'smooth'
            });
          }
        })
      })
    }
  }

  const doctorWorksSwiper = document.querySelector('.doctor-works .swiper');
  if (doctorWorksSwiper) {
    new Swiper(doctorWorksSwiper, {
      spaceBetween: 10,
      slidesPerView: "auto",
      navigation: {
        nextEl: '.swiper-button-next.doctor-works-slider-next',
        prevEl: '.swiper-button-prev.doctor-works-slider-prev',
      },
    });
  }

  const doctorPublicationsSwiper = document.querySelector('.doctor-publications-slider .swiper');
  if (doctorPublicationsSwiper) {
    let space = 10;

    if (doctorPublicationsSwiper.closest('.page-service-category')) {
      if (window.innerWidth >= 786) {
        space = 20;
      } else {
        space = 10;
      }
    }

    new Swiper(doctorPublicationsSwiper, {
      spaceBetween: space,
      slidesPerView: "auto",
      navigation: {
        nextEl: '.swiper-button-next.doctor-publications-slider-next',
        prevEl: '.swiper-button-prev.doctor-publications-slider-prev',
      },
    });
  }

  const reviewsSwiper = document.querySelector('.doctor-reviews-slider .swiper');
  if (reviewsSwiper) {

    let space = 10;

    if (reviewsSwiper.closest('.page-service-category')) {
      if (window.innerWidth >= 786) {
        space = 20;
      } else {
        space = 10;
      }
    }

    new Swiper(reviewsSwiper, {
      spaceBetween: space,
      slidesPerView: "auto",
      navigation: {
        nextEl: '.swiper-button-next.doctor-reviews-slider-next',
        prevEl: '.swiper-button-prev.doctor-reviews-slider-prev',
      },
    });
  }

  const otherDoctorsSwiper = document.querySelector('.other-doctors__slider .swiper');
  if (otherDoctorsSwiper) {

    const buttonPrev = otherDoctorsSwiper.closest(".other-doctors__slider").querySelector('.other-doctors__slider--button-prev')
    const buttonNext = otherDoctorsSwiper.closest(".other-doctors__slider").querySelector('.other-doctors__slider--button-next')

    new Swiper(otherDoctorsSwiper, {
      spaceBetween: 8,
      slidesPerView: "auto",
      navigation: {
        nextEl: buttonNext,
        prevEl: buttonPrev,
      },
    });
  }

  const doctorCertificatesSwiper = document.querySelector('.doctor-certificates-slider .swiper');
  if (doctorCertificatesSwiper) {
    new Swiper(doctorCertificatesSwiper, {
      spaceBetween: 10,
      slidesPerView: "auto",
      navigation: {
        nextEl: '.swiper-button-next.doctor-certificates-slider-next',
        prevEl: '.swiper-button-prev.doctor-certificates-slider-prev',
      },
    });

    lightGallery(doctorCertificatesSwiper, {
      plugins: [lgThumbnail],
      licenseKey: '0000-0000-0000-0000', // тестовый ключ
      speed: 300,
      download: false, // скрыть кнопку загрузки
      animateThumb: true,
      // zoomFromOrigin: false,
      // allowMediaOverlap: true,
      toggleThumb: true,
      thumbnail: true,
      selector: '.swiper-slide a'
    });
  }

  const videoCards = document.querySelectorAll('.video-card');
  if (videoCards.length) {
    videoCards.forEach(videoCard => {
      const playButton = videoCard.querySelector('.play-video-button');
      const poster = videoCard.querySelector('.video-card__poster');
      const video = videoCard.querySelector('video');

      if (!playButton || !video) return;

      /*playButton.addEventListener('click', (e) => {
        e.preventDefault();

        videoCard.classList.add('active');

        video.play();
        // video.setAttribute('controls', "controls");
      })*/

      videoCard.addEventListener('click', (e) => {
        if (videoCard.classList.contains('active')) {
          video.pause();
          videoCard.classList.remove('active');
          video.removeAttribute('controls');
        } else {
          video.setAttribute('controls', "controls");
          videoCard.classList.add('active');
          video.play();
        }
      })
    })
  }

  const doctorRating = document.querySelector('.doctor-rating');
  const footer = document.querySelector('.footer');

  if (doctorRating && footer) {

    const checkBreakpoint = () => window.innerWidth <= 768;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!checkBreakpoint()) return;

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            doctorRating.classList.add('disabled');
          } else {
            doctorRating.classList.remove('disabled');
          }
        });
      },
      {
        root: null,
        threshold: 0
      }
    );

    observer.observe(footer);

    window.addEventListener('resize', () => {
      if (!checkBreakpoint()) {
        doctorRating.classList.remove('disabled');
      }
    });
  }

  const serviceStandardsSwiper = document.querySelector('.service-standards__swiper .swiper');
  if (serviceStandardsSwiper) {

    new Swiper(serviceStandardsSwiper, {
      spaceBetween: 20,
      slidesPerView: "auto",
    });
  }

  const serviceTypesSwiper = document.querySelector('.service-types__swiper .swiper');
  if (serviceTypesSwiper) {

    const serviceTypesSwiperBlock = new Swiper(serviceTypesSwiper, {
      spaceBetween: window.innerWidth >= 768 ? 20 : 10,
      slidesPerView: "auto",
    });

    const serviceTypeInforms = document.querySelectorAll('.service-type-information');
    if (serviceTypeInforms.length) {
      const instances = [];

      serviceTypeInforms.forEach(serviceTypeInform => {
        const button = serviceTypeInform.querySelector('.service-type-information__button');
        const content = serviceTypeInform.querySelector('.service-type-information__list');

        if (!button || !content) return;

        const instance = tippy(button, {
          content: content,
          trigger: 'click',
          placement: 'bottom-start',
          allowHTML: true,
          arrow: false,
          // interactive: true,
          theme: 'service-type',
          onShow() {
            instances.forEach(inst => {
              if (inst !== instance) inst.hide();
            });
          }
        });

        instances.push(instance);
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.service-type-information')) {
          instances.forEach(inst => inst.hide());
        }
      });

      serviceTypesSwiperBlock.on('slideChange', function () {
        instances.forEach(inst => inst.hide());
      });
    }
  }
})

document.addEventListener('DOMContentLoaded', () => {

  segmentsInit()
});

function segmentsInit() {
  const segmentedItems = document.querySelectorAll('.segmented');

  if (segmentedItems.length) {
    segmentedItems.forEach(segmented => segmentedInit(segmented))
  }
}

function segmentedInit(segmented) {

  if (!segmented) return;

  const wrap = segmented.querySelector('.segmented__wrap');
  const buttons = segmented.querySelectorAll('.segmented__item');
  const thumb = segmented.querySelector('.segmented__thumb');
  const input = segmented.querySelector('.segmented__input');

  const moveThumb = (activeBtn) => {
    const wrapStyles = getComputedStyle(wrap);
    const padLeft = parseFloat(wrapStyles.paddingLeft);
    const padTop = parseFloat(wrapStyles.paddingTop);
    const padBottom = parseFloat(wrapStyles.paddingBottom);

    const { offsetLeft, offsetWidth } = activeBtn;

    thumb.style.width = `${offsetWidth}px`;
    thumb.style.transform = `translateX(${offsetLeft - padLeft}px)`;
    thumb.style.top = `${padTop}px`;
    thumb.style.height = `${wrap.clientHeight - padTop - padBottom}px`;
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      input.value = btn.getAttribute('data-value');
      input.dispatchEvent(new Event('change', {bubbles: true}))
      moveThumb(btn);
    });
  });

  const activeBtn = segmented.querySelector('.segmented__item.active');
  if (activeBtn) moveThumb(activeBtn);

  window.addEventListener('resize', () => {
    const currentActive = segmented.querySelector('.segmented__item.active');
    if (currentActive) moveThumb(currentActive);
  });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('test 1')
})
document.addEventListener('DOMContentLoaded', () => {
    console.log('test 2')
})