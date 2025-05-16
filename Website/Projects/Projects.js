document.addEventListener('DOMContentLoaded', function () {
  const clickableElements = document.querySelectorAll('.clickable');

  clickableElements.forEach(function (clickableElement) {
    clickableElement.addEventListener('click', function (event) {
      const targetElement = event.target;

      // Si se hizo clic en el texto h1 dentro del proyecto, mostrar overlay-text2
      if (targetElement.tagName === 'H1') {
        const overlayText = clickableElement.querySelector('.overlay-text2');
        if (overlayText) {
          overlayText.style.display = 'block';
        }
      }

      // Si se hizo clic en la imagen o enlace, redirigir al enlace del proyecto
      if (targetElement.tagName === 'IMG' || targetElement.tagName === 'A') {
        const linkElement = clickableElement.querySelector('a');
        if (linkElement) {
          linkElement.click();
        }
      }
    });
  });
});

// Lenis horizontal scroll for projects section
document.addEventListener('DOMContentLoaded', function () {
  // Initialize Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Get scroll animation going
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Get DOM elements
  const projectsSection = document.getElementById('projects');
  const projectsContainer = document.querySelector('.projects-container');
  const projectItems = document.querySelectorAll('.project-item');
  const totalProjects = projectItems.length;
  const nextSection = document.querySelector('[data-section="contact-me"]');
  let currentIndex = 0;
  let isAnimating = false;
  
  // Set up the horizontal scroll sections
  projectItems.forEach((item, index) => {
    item.setAttribute('data-index', index);
    if (index === 0) {
      item.classList.add('active');
    }
  });

  // Lock scroll when inside projects section
  lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    // Check if we're in the projects section
    const projectsRect = projectsSection.getBoundingClientRect();
    const projectsTop = projectsRect.top;
    const projectsBottom = projectsRect.bottom;
    
    // If projects section is in view
    if (projectsTop <= 0 && projectsBottom >= window.innerHeight * 0.5) {
      // Lock the page scroll to manipulate horizontal scroll
      if (!projectsSection.classList.contains('active-section')) {
        projectsSection.classList.add('active-section');
      }
    } else {
      projectsSection.classList.remove('active-section');
    }
  });

  // Detect scroll direction and navigate projects
  window.addEventListener('wheel', function(e) {
    // If we're in the projects section and not currently animating
    if (projectsSection.classList.contains('active-section') && !isAnimating) {
      e.preventDefault();
      
      // Determine scroll direction
      if (e.deltaY > 0) {
        // Scroll down - go to next project
        if (currentIndex < totalProjects - 1) {
          navigateToProject(currentIndex + 1);
        } else {
          // If at last project, navigate to next section
          navigateToNextSection();
        }
      } else if (e.deltaY < 0) {
        // Scroll up - go to previous project
        if (currentIndex > 0) {
          navigateToProject(currentIndex - 1);
        }
      }
    }
  }, { passive: false });

  // Touch events for mobile
  let touchStartY = 0;
  
  projectsSection.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  
  projectsSection.addEventListener('touchmove', function(e) {
    if (projectsSection.classList.contains('active-section') && !isAnimating) {
      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY;
      
      // Threshold to detect intentional swipe
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe up - next project
          if (currentIndex < totalProjects - 1) {
            navigateToProject(currentIndex + 1);
          } else {
            navigateToNextSection();
          }
        } else {
          // Swipe down - previous project
          if (currentIndex > 0) {
            navigateToProject(currentIndex - 1);
          }
        }
        touchStartY = touchY; // Reset start position
      }
    }
  }, { passive: false });

  // Function to navigate to a specific project
  function navigateToProject(index) {
    if (isAnimating) return;
    isAnimating = true;
    
    // Remove active class from current project
    projectItems[currentIndex].classList.remove('active');
    // Add active class to new project
    projectItems[index].classList.add('active');
    
    // Update current index
    currentIndex = index;
    
    // Update the transform of the container
    projectsContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update progress indicator
    updateProgressIndicator();
    
    // Reset animating flag after transition completes
    setTimeout(() => {
      isAnimating = false;
    }, 1000);
  }

  // Function to navigate to the next section
  function navigateToNextSection() {
    if (nextSection) {
      lenis.scrollTo(nextSection, {
        offset: 0,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  }

  // Create progress indicator
  function createProgressIndicator() {
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'projects-progress';
    
    // Create dots for each project
    for (let i = 0; i < totalProjects; i++) {
      const dot = document.createElement('div');
      dot.className = 'progress-dot';
      if (i === 0) dot.classList.add('active');
      
      // Add click event to navigate directly to that project
      dot.addEventListener('click', () => {
        navigateToProject(i);
      });
      
      progressIndicator.appendChild(dot);
    }
    
    projectsSection.appendChild(progressIndicator);
  }

  // Update progress indicator
  function updateProgressIndicator() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Handle clickable project elements 
  const clickableElements = document.querySelectorAll('.clickable');

  clickableElements.forEach(function (clickableElement) {
    clickableElement.addEventListener('click', function (event) {
      const targetElement = event.target;

      // If clicked on h1 text inside project, show overlay-text2
      if (targetElement.tagName === 'H1') {
        const overlayText = clickableElement.querySelector('.overlay-text2');
        if (overlayText) {
          overlayText.style.display = 'block';
        }
      }

      // If clicked on image or link, redirect to project link
      if (targetElement.tagName === 'IMG' || targetElement.tagName === 'A') {
        const linkElement = clickableElement.querySelector('a');
        if (linkElement) {
          linkElement.click();
        }
      }
    });
  });

  // Initialize the progress indicator
  createProgressIndicator();
  
  // Fix for keyboard navigation and accessibility
  document.addEventListener('keydown', function(e) {
    if (projectsSection.classList.contains('active-section')) {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentIndex < totalProjects - 1) {
          navigateToProject(currentIndex + 1);
        } else {
          navigateToNextSection();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentIndex > 0) {
          navigateToProject(currentIndex - 1);
        }
      }
    }
  });
});