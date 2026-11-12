document.addEventListener('DOMContentLoaded', () => {
  // Скрипты для блока "header"

  const header = document.querySelector('.header');

  if (!header) return;

  let headerTimer;

  if (window.innerWidth > 768) {
    headerNavItems(headerTimer)
  } else {
    subNavCollapse()
  }

  if (scrollPosition() > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  menuCategoriesContent()

  window.addEventListener('scroll', () => {

    if (scrollPosition() > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  })

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      headerNavItems(headerTimer)

      if (header.classList.contains('burger-active')) {
        header.classList.remove('burger-active')
        blockWrap(false)
      }
    } else {

      const headerMenu = header.querySelector('.header-menu');

      if (!header.classList.contains('burger-active') && headerMenu.classList.contains('active')) {
        header.classList.remove('burger-active')
        headerMenu.classList.remove('active')
        blockWrap(false)
        subNavCollapse()
      }
    }


  })

  const burgerButton = header.querySelector('.header-burger-button');
  if (burgerButton) {
    burgerButton.addEventListener('click', () => {
      header.classList.toggle('burger-active');

      menuMobile(header.classList.contains('burger-active'))

      if (!header.classList.contains('burger-active')) {
        subNavCollapsesClose();
        mobileMenuCategoriesClose();
      }
    })
  }

  const searchButton = header.querySelector('.header__search--button');
  if (searchButton) {
    const searchBlock = document.querySelector('.search');

    if (!searchBlock) return;

    searchButton.addEventListener('click', () => {
      showSearch()
    })
  }

});

function scrollPosition() {
  return window.pageYOffset || document.documentElement.scrollTop;
}

function headerNavItems(timer) {
  const header = document.querySelector('.header');

  if (!header) return;

  const headerMenu = header.querySelector('.header-menu');

  const navItems = header.querySelectorAll('.header__nav--item');

  if (!navItems.length || !headerMenu) return;

  const headerMenuInner = headerMenu.querySelector('.header-menu__body');

  navItems.forEach(navItem => {

    const navItemCategory = navItem.getAttribute('data-nav');

    if (!navItemCategory) return;

    const navItemCategoryContent = headerMenu.querySelector(`.header-menu-category[data-category="${navItemCategory}"]`);

    if (!navItemCategoryContent) return;

    navItem.addEventListener('mouseenter', (e) => {
      clearTimeout(timer);

      const activeNavItems = document.querySelectorAll('.header__nav--item.active');
      if (activeNavItems.length) {
        activeNavItems.forEach(navItem => {
          navItem.classList.remove('active');
        })
      }

      const menuCategoriesContent = document.querySelectorAll('.header-menu-category');
      if (menuCategoriesContent.length) {
        menuCategoriesContent.forEach(menuCategory => {
          menuCategory.classList.remove('active');
        })
      }

      navItemCategoryContent.classList.add('active')
      navItem.classList.add('active')
      headerMenu.classList.add('active')
    })

    navItem.addEventListener('mouseleave', (e) => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        navItem.classList.remove('active')
        headerMenu.classList.remove('active')
      }, 150);
    })
  })

  headerMenuInner.addEventListener('mouseenter', (e) => {

    if (e.target.closest('.header-menu')) {
      clearTimeout(timer);
    } else {
      clearTimeout(timer);

      timer = setTimeout(() => {
        headerMenu.classList.remove('active');
      }, 50);
    }
  })
  headerMenuInner.addEventListener('mouseleave', () => {
    clearTimeout(timer);

    const activeNavItems = document.querySelectorAll('.header__nav--item');
    if (activeNavItems.length) {
      activeNavItems.forEach(navItem => {
        navItem.classList.remove('active');
      })
    }

    document.querySelectorAll('.header-menu-category__link')
      .forEach(categoryLink => categoryLink.classList.remove('active'));

    document.querySelectorAll(`.header-menu-category__content`)
      .forEach((content) => {
        content.classList.remove('show');
        content.style.display = '';
      })

    timer = setTimeout(() => {
      headerMenu.classList.remove('active')
    }, 50);
  })
}

function menuCategoriesContent() {
  let hoverTimer = null;
  let currentCategory = null;

  const categoryLinks = document.querySelectorAll('.header-menu-category__link');

  if (!categoryLinks.length) return;

  categoryLinks.forEach(link => {

    const categoryValue = link.getAttribute('data-category-item');

    link.addEventListener('mouseenter', () => {

      clearTimeout(hoverTimer);

      hoverTimer = setTimeout(() => {

        if (!categoryValue) return;

        if (currentCategory === categoryValue) return;

        currentCategory = categoryValue;

        categoryLinks.forEach(categoryLink => categoryLink.classList.remove('active'));
        document.querySelectorAll('.header-menu-category__content').forEach(content => {
          content.classList.remove('show');
          content.style.display = '';
        });

        if (!categoryValue) return;

        const categoryContent = document.querySelector(`.header-menu-category__content[data-category-content="${categoryValue}"]`);
        if (!categoryContent) return;

        categoryContent.style.display = 'grid';
        link.classList.add('active');

        setTimeout(() => {
          categoryContent.classList.add('show');
        }, 50);

      }, 180);
    });

    link.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      currentCategory = null;
    });
  });
}

function menuMobile(active) {

  const headerMenu = document.querySelector('.header-menu');

  if (!headerMenu) return;

  blockWrap(active)

  if (active) {
    headerMenu.classList.add('active');
  } else {
    headerMenu.classList.remove('active');
  }

  const navLinks = headerMenu.querySelectorAll('.header-menu__nav--link');
  if (navLinks.length) {
    navLinks.forEach(link => {

      const categoryAttribute = link.getAttribute('data-nav');

      link.addEventListener('click', (e) => {
        if (categoryAttribute) {
          e.preventDefault();

          const subnavsCategory = headerMenu.querySelectorAll('.menu-subnavs__category');
          if (!subnavsCategory.length) return;

          subnavsCategory.forEach(subnavCategory => subnavCategory.classList.remove('show'));

          const category = headerMenu.querySelector(`.menu-subnavs__category[data-category="${categoryAttribute}"]`);

          if (category) {
            category.classList.add('show');
          }
        }
      })
    })
  }

  const closeSubnavCategoryButtons = headerMenu.querySelectorAll('.menu-subnavs__back-button');
  if (closeSubnavCategoryButtons.length) {
    closeSubnavCategoryButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const subnavsCategory = headerMenu.querySelectorAll('.menu-subnavs__category');
        if (!subnavsCategory.length) return;

        subnavsCategory.forEach(subnavCategory => subnavCategory.classList.remove('show'));

        subNavCollapsesClose()
      })
    })
  }
}

function subNavCollapse() {
  const subNavsLinks = document.querySelectorAll('.menu-subnav__link');
  if (!subNavsLinks.length) return;

  subNavsLinks.forEach(subnavLink => {

    const parent = subnavLink.closest('.menu-subnav');
    const wrap = parent.querySelector('.menu-subnav__items');

    if (wrap) {

      const content = wrap.querySelector('ul');

      subnavLink.addEventListener('click', (e) => {
        e.preventDefault();

        if (parent.classList.contains('active')) {
          parent.classList.remove('active');
          wrap.style.maxHeight = '';
        } else {
          parent.classList.add('active');
          wrap.style.maxHeight = content.offsetHeight + 'px';
        }

      })
    }

  });

}

function subNavCollapsesClose() {
  const menuSubnavActiveCollapses = document.querySelectorAll('.menu-subnav.active');
  if (menuSubnavActiveCollapses.length) {
    menuSubnavActiveCollapses.forEach(subnav => {

      const subnavWrap = subnav.querySelector('.menu-subnav__items');
      subnavWrap.style.maxHeight = '';
      subnav.classList.remove('active');
    })
  }
}

function mobileMenuCategoriesClose() {
  const mobileCategories = document.querySelectorAll('.menu-subnavs__category.show');
  if (mobileCategories.length) {
    mobileCategories.forEach(mobileCategory => {
      mobileCategory.classList.remove('show');
    })
  }
}
