document.addEventListener('DOMContentLoaded', () => {
  // Скрипты для блока "clinic-achievements"
  const clinicAchievementsSwiperBg = document.querySelector('.clinic-achievements__swiper-bg .swiper');
  const clinicAchievementsSwiperInfo = document.querySelector('.clinic-achievements__swiper-info .swiper');
  if (!clinicAchievementsSwiperBg || !clinicAchievementsSwiperInfo) return;

  const swiperBgElem = new Swiper(clinicAchievementsSwiperBg, {
    // loop: true,
    slidesPerView: 1,
    // effect: 'fade',
    effect: 'creative',
    speed: 1000,
    creativeEffect: {
      prev: {
        translate: [0, 0, -400],
      },
      next: {
        translate: ['100%', 0, 0],
      },
    },
    watchSlidesProgress: true,
  });

  const swiperInfoElem = new Swiper(clinicAchievementsSwiperInfo, {
    // loop: true,
    slidesPerView: 1,
    effect: 'cards',
    speed: 500,
    cardsEffect: {
      perSlideRotate: 0,
      rotate: false,
    },
    thumbs: {
      swiper: swiperBgElem,
    },
    breakpoints: {
      992: {
        speed: 1000,
      }
    }
  });

  swiperInfoElem.on('slideChange', function (e) {
    const activeIndex = e.activeIndex;
    swiperBgElem.slideTo(activeIndex);

    updateActiveIndex(swiperInfoElem)
  });

  swiperBgElem.on('slideChange', function (e) {
    const activeIndex = e.activeIndex;
    swiperInfoElem.slideTo(activeIndex);
  });


  const countSlides = clinicAchievementsSwiperInfo.querySelector('.countSlides');
  if (countSlides) {
    countSlides.textContent = clinicAchievementsSwiperInfo.querySelectorAll('.swiper-slide').length;
  }

  const navigateButtons = clinicAchievementsSwiperInfo.querySelectorAll('button.btn--nav');
  if (navigateButtons.length) {
    navigateButtons.forEach(navigateButton => {

      const direction = navigateButton.dataset.navigate;

      navigateButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (direction === 'prev') {
          swiperInfoElem.slidePrev();
        } else {
          swiperInfoElem.slideNext();
        }
      })

    })
  }

  function updateActiveIndex(swiper) {
    const currentIndex = clinicAchievementsSwiperInfo.querySelector('.currentIndex');
    if (currentIndex) {
      currentIndex.textContent = swiper.activeIndex + 1;
    }
  }

});
