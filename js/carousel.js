document.addEventListener('DOMContentLoaded', function() {
  // Carousel setup
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextButton = document.querySelector('.carousel-button.next');
  const prevButton = document.querySelector('.carousel-button.prev');
  const dotsNav = document.querySelector('.carousel-nav');
  
  // Initialize carousel with existing slides
  function initCarousel() {
    // Create navigation dots based on existing slides
    createDots();
    
    // Clone first and last slides for infinite effect
    const firstSlide = slides[0].cloneNode(true);
    const lastSlide = slides[slides.length - 1].cloneNode(true);
    
    track.insertBefore(lastSlide, slides[0]);
    track.appendChild(firstSlide);
    
    // Update slides array with cloned slides
    slides.unshift(lastSlide);
    slides.push(firstSlide);
    
    // Set initial position
    track.style.transform = `translateX(-100%)`;
    currentSlide = 1;
    updateDots();
  }
  
  // Create navigation dots
  function createDots() {
    dotsNav.innerHTML = '';
    const slideCount = document.querySelectorAll('.carousel-slide').length;
    
    for (let i = 0; i < slideCount; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-indicator';
      dot.setAttribute('data-slide', i);
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsNav.appendChild(dot);
    }
    
    // Create navigation dots
    dotsNav.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-indicator';
      dot.setAttribute('data-slide', index);
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsNav.appendChild(dot);
    });
    
    // Clone slides for infinite effect
    const firstSlide = slides[0].cloneNode(true);
    const lastSlide = slides[slides.length - 1].cloneNode(true);
    track.insertBefore(lastSlide, slides[0]);
    track.appendChild(firstSlide);
    
    // Update slides array
    slides.unshift(lastSlide);
    slides.push(firstSlide);
    
    // Set initial position
    track.style.transform = `translateX(-100%)`;
    currentSlide = 1;
    updateDots();
  }
  
  let currentSlide = 1;
  let isTransitioning = false;
  
  // Navigation functions
  function goToSlide(slideIndex) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(${-slideIndex * 100}%)`;
    currentSlide = slideIndex;
    updateDots();
    
    // Reset position for infinite effect
    setTimeout(() => {
      if (currentSlide === 0) {
        currentSlide = slides.length - 2;
        track.style.transition = 'none';
        track.style.transform = `translateX(${-currentSlide * 100}%)`;
      } else if (currentSlide === slides.length - 1) {
        currentSlide = 1;
        track.style.transition = 'none';
        track.style.transform = `translateX(${-currentSlide * 100}%)`;
      }
      isTransitioning = false;
    }, 500);
  }
  
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }
  
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }
  
  function updateDots() {
    const dots = document.querySelectorAll('.carousel-indicator');
    const activeIndex = currentSlide === 0 ? dots.length - 1 : 
                       currentSlide === slides.length - 1 ? 0 : currentSlide - 1;
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }
  
  // Event listeners
  nextButton.addEventListener('click', nextSlide);
  prevButton.addEventListener('click', prevSlide);
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });
  
  // Touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = touchStartX - touchEndX;
    
    if (Math.abs(swipeDistance) < swipeThreshold) return;
    
    if (swipeDistance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
  
  // Auto-advance slides
  let slideInterval = setInterval(nextSlide, 5000);
  
  // Pause auto-advance on hover
  const carousel = document.querySelector('.carousel-container');
  carousel.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
  });
  
  carousel.addEventListener('mouseleave', () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  });
  
  // Initialize carousel
  initCarousel();
});
