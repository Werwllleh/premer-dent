document.addEventListener('DOMContentLoaded', () => {
  // Скрипты для блока "main-block"
  const mainImagesSwiper = document.querySelector('.main-block__images--swiper.swiper');
  const mainThumbsSwiper = document.querySelector('.main-block__thumbs--swiper.swiper');

  if (!mainImagesSwiper || !mainThumbsSwiper) return;

  const mainThumbsSwiperElem = new Swiper(mainThumbsSwiper, {
    loop: true,
    spaceBetween: 8,
    slidesPerView: "auto",
    freeMode: true,
    breakpoints: {
      768: {
        slidesPerView: 3,
      }
    },
    watchSlidesProgress: true,
  });

  const mainImagesSwiperElem = new Swiper(mainImagesSwiper, {
    loop: true,
    slidesPerView: 1,
    effect: 'creative',
    speed: 1000,
    autoplay: {
      enabled: true,
      // enabled: false,
      delay: 10000,
      disableOnInteraction: false
      // disableOnInteraction: true,
      // pauseOnInteraction: true,
    },
    watchOverflow: true,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    creativeEffect: {
      prev: {
        translate: [0, 0, -400],
      },
      next: {
        translate: ['100%', 0, 0],
      },
    },
    thumbs: {
      swiper: mainThumbsSwiperElem,
    },
  });

  if (!mainImagesSwiperElem || !mainThumbsSwiperElem) return;

  mainImagesSwiperElem.on('autoplayTimeLeft', function (s, time, progress) {

    const swiperThumbs = mainThumbsSwiperElem.el.swiper;
    const thumbsActiveSlide = swiperThumbs.slides[mainImagesSwiperElem.realIndex];

    const allProgressBars = Array.from(mainThumbsSwiperElem.el.querySelectorAll('.main-thumbs-slide__row span'));

    allProgressBars.forEach(bar => {

      // bar.style.transition = 'none';
      bar.style.width = '0';

      // bar.removeAttribute('data-progress-running');
    });

    const activeBar = thumbsActiveSlide.querySelector('.main-thumbs-slide__row span');
    if (activeBar) {
      activeBar.style.width = `${(1 - progress) * 100}%`;
    }
  })
});
