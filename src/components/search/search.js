document.addEventListener('DOMContentLoaded', () => {
  // Скрипты для компонента "search"
  const searchBlock = document.querySelector('.search');

  if (!searchBlock) return;

  searchBlock.addEventListener('click', (evt) => {
    if (!evt.target.closest('.search__window')) {
      hideSearch()
    }
  })

  const searchInput = document.querySelector('.search__field--input');
  const searchResult = document.querySelector('.search__result');
  const searchClearButton = document.querySelector('.search__field--clear-button');

  if (searchInput && searchResult && searchClearButton) {
    searchInput.addEventListener('input', () => {

      const value = searchInput.value.trim();

      if (value.length) {
        searchResult.classList.add('show');
        searchClearButton.classList.add('show');

        if (value.toLowerCase() === 'тест') {
          searchResult.classList.add('error')
        } else {
          searchResult.classList.remove('error')
        }
      } else {
        searchClearButton.classList.remove('show');
        searchResult.classList.remove('show', 'error');
      }
    })

    searchClearButton.addEventListener('click', () => {
      searchInput.value = '';
      searchInput?.focus();
      searchClearButton.classList.remove('show');
      searchResult.classList.remove('show', 'error');
    })
  }

  const closeSearchButton = document.querySelector('.search__close');
  if (closeSearchButton) {
    closeSearchButton.addEventListener('click', () => {
      hideSearch()
    })
  }
});

function showSearch() {
  const searchBlock = document.querySelector('.search');

  if (!searchBlock) return;

  const searchInput = searchBlock.querySelector('.search__field--input');
  setTimeout(() => {
    searchInput?.focus();
  }, 300)


  blockWrap(true);

  searchBlock.style.display = 'flex';

  setTimeout(() => {
    searchBlock.classList.add('active');
  }, 50)

}

function hideSearch() {
  const searchBlock = document.querySelector('.search');

  if (!searchBlock) return;

  const searchInput = searchBlock.querySelector('.search__field--input');
  const searchResult = searchBlock.querySelector('.search__result');
  const searchClearButton = searchBlock.querySelector('.search__field--clear-button');


  setTimeout(() => {
    searchBlock.classList.remove('active');

    if (searchInput && searchResult && searchClearButton) {
      searchInput.value = '';
      searchInput?.focus();
      searchClearButton.classList.remove('show');
      searchResult.classList.remove('show', 'error');
    }

    setTimeout(() => {
      blockWrap(false)
      searchBlock.style.display = '';
    }, 300);
  });
}
