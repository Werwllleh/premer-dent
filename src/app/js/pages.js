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
