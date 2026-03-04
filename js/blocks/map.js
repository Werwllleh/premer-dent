document.addEventListener('DOMContentLoaded', () => {
  // Скрипты для блока "map"
  const mapSwiper = document.querySelector('.map .swiper');
  if (mapSwiper) {

    new Swiper(mapSwiper, {
      spaceBetween: 4,
      slidesPerView: "auto",
    });
  }

  const showMap = document.querySelector('.map--show-btn');
  if (showMap) {
    showMap.addEventListener('click', () => {
      const mapModalElement = document.querySelector('.map-modal .map-element');

      if (!mapModalElement) return;

      setTimeout(() => {
        initMap(mapModalElement)
      }, 1000)

    })
  }

  lightGallery(mapSwiper, {
    plugins: [],
    licenseKey: '0000-0000-0000-0000', // тестовый ключ
    speed: 300,
    download: false, // скрыть кнопку загрузки
    animateThumb: false,
    zoomFromOrigin: false,
    allowMediaOverlap: true,
    toggleThumb: true,
    selector: '.map__images--item a'
  });

});
