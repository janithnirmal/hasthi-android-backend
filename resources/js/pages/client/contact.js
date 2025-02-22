document.addEventListener('DOMContentLoaded', function() {
    const viewportWidth = window.innerWidth;
    const swiperOptions = {
      speed: 400,
      spaceBetween: 0,
      autoplay: {
        delay: 2000,
      },
      loop: true,
    };

    if (viewportWidth >= 992) {
      swiperOptions.slidesPerView = 4;
    } else {
      swiperOptions.slidesPerView = 1;
    }

    const swiper = new Swiper('.swiper', swiperOptions);
});