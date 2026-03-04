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
