let bannerSlides = document.querySelectorAll('.banner-slide');
let currentSlide = 0;

setInterval(() => {
    bannerSlides[currentSlide].classList.remove('active');
    bannerIndicators[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % bannerSlides.length;
    bannerSlides[currentSlide].classList.add('active');
    bannerIndicators[currentSlide].classList.add('active');
}, 5000);

const bannerIndicators = document.querySelectorAll('.banner-indicator');

bannerIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        bannerSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            bannerIndicators[i].classList.remove('active');
        });
        bannerSlides[index].classList.add('active');
        bannerIndicators[index].classList.add('active');
        currentSlide = index;
    });
});