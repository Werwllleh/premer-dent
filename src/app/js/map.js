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
