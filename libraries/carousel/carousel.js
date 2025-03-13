document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevButton = document.querySelector('.carousel-button-prev');
    const nextButton = document.querySelector('.carousel-button-next');

    let currentIndex = 0;
    let slideWidth = 0;
    let autoplayInterval;
    const totalSlides = slides.length;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(document.querySelectorAll('.carousel-dot'));

    // Set initial dimensions
    function setCarouselDimensions() {
        slideWidth = document.querySelector('.carousel-container').clientWidth;
        slides.forEach(slide => {
            slide.style.minWidth = `${slideWidth}px`;
        });
        goToSlide(currentIndex, false);
    }

    // Go to specific slide
    function goToSlide(index, animate = true) {
        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }

        currentIndex = index;

        // Update track position
        if (!animate) {
            track.style.transition = 'none';
        } else {
            track.style.transition = 'transform 0.5s ease';
        }

        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');

        // Reset transition after transform is complete
        if (!animate) {
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease';
            }, 10);
        }
    }

    // Button event listeners
    prevButton.addEventListener('click', () => {
        resetAutoplay();
        goToSlide(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        resetAutoplay();
        goToSlide(currentIndex + 1);
    });

    // Start autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 4000);
    }

    // Reset autoplay
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Handle window resize
    window.addEventListener('resize', setCarouselDimensions);

    // Initialize carousel
    setCarouselDimensions();
    startAutoplay();

    // Handle touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swiped left
            resetAutoplay();
            goToSlide(currentIndex + 1);
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swiped right
            resetAutoplay();
            goToSlide(currentIndex - 1);
        }
    }
});