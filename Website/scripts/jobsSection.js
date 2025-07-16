// ===== SECCIÓN TRABAJOS CON NAVEGACIÓN HORIZONTAL =====

function setupHorizontalJobsNavigation() {
  let currentJobIndex = 0;
  let isScrolling = false;
  let scrollDirection = 'right'; // 'right' o 'left'
  const jobs = document.querySelectorAll('.job-card');
  const jobsContainer = document.querySelector('.jobs-container');
  const jobsSection = document.querySelector('.section-jobs');
  
  // Configurar el container para mostrar solo un trabajo
  function setupJobsDisplay() {
    jobsContainer.style.transform = 'translateX(0px)';
    jobsContainer.style.transition = 'transform 0.6s ease-in-out';
    
    // Calcular el ancho de cada trabajo incluyendo el gap y márgenes
    const jobWidth = 350 + 40 + 40; // ancho de la tarjeta + gap + márgenes
    
    // Calcular offset para centrar el trabajo
    function updateJobPosition() {
      const containerWidth = jobsSection.offsetWidth;
      const centerOffset = (containerWidth - 350) / 2; // Centrar la tarjeta de 350px
      const offset = centerOffset - (currentJobIndex * jobWidth);
      jobsContainer.style.transform = `translateX(${offset}px)`;
    }
    
    return updateJobPosition;
  }
  
  const updateJobPosition = setupJobsDisplay();
  
  // Manejar el scroll del mouse
  function handleWheelScroll(e) {
    // Solo manejar si estamos en la sección de trabajos
    if (!jobsSection.contains(e.target)) return;
    
    e.preventDefault();
    
    if (isScrolling) return;
    
    isScrolling = true;
    
    // Determinar dirección del scroll
    const deltaY = e.deltaY;
    
    if (deltaY > 0) {
      // Scroll hacia abajo
      handleDownScroll();
    } else {
      // Scroll hacia arriba
      handleUpScroll();
    }
    
    // Resetear flag después de la animación (scroll más lento)
    setTimeout(() => {
      isScrolling = false;
    }, 950); // Un poco más lento que proyectos
  }
  
  function handleDownScroll() {
    if (scrollDirection === 'right') {
      // Navegando hacia la derecha
      if (currentJobIndex < jobs.length - 1) {
        currentJobIndex++;
        updateJobPosition();
        updateJobIndicator();
      } else {
        // Se acabaron los trabajos hacia la derecha, ir a la siguiente sección
        goToNextSection();
      }
    } else {
      // Navegando hacia la izquierda, cambiar dirección
      scrollDirection = 'right';
      if (currentJobIndex < jobs.length - 1) {
        currentJobIndex++;
        updateJobPosition();
        updateJobIndicator();
      } else {
        goToNextSection();
      }
    }
  }
  
  function handleUpScroll() {
    if (scrollDirection === 'left') {
      // Navegando hacia la izquierda
      if (currentJobIndex > 0) {
        currentJobIndex--;
        updateJobPosition();
        updateJobIndicator();
      } else {
        // Se acabaron los trabajos hacia la izquierda, ir a la sección anterior
        goToPreviousSection();
      }
    } else {
      // Navegando hacia la derecha, cambiar dirección
      scrollDirection = 'left';
      if (currentJobIndex > 0) {
        currentJobIndex--;
        updateJobPosition();
        updateJobIndicator();
      } else {
        goToPreviousSection();
      }
    }
  }
  
  function goToNextSection() {
    // Ir a la siguiente sección
    const nextSection = jobsSection.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  function goToPreviousSection() {
    // Ir a la sección anterior
    const prevSection = jobsSection.previousElementSibling;
    if (prevSection) {
      prevSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Crear indicador visual para trabajos
  function createJobIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'jobs-indicator';
    indicator.innerHTML = `
      <div class="indicator-dots">
        ${Array.from(jobs).map((_, index) => 
          `<span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
        ).join('')}
      </div>
      <div class="indicator-direction">
        <span class="direction-arrow">→</span>
        <span class="direction-text">Explora mi experiencia</span>
      </div>
    `;
    
    jobsSection.appendChild(indicator);
    
    // Agregar eventos a los dots
    const dots = indicator.querySelectorAll('.dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        currentJobIndex = index;
        updateJobPosition();
        updateJobIndicator();
      });
    });
  }
  
  function updateJobIndicator() {
    const dots = document.querySelectorAll('.jobs-indicator .dot');
    const directionArrow = document.querySelector('.jobs-indicator .direction-arrow');
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentJobIndex);
    });
    
    // Actualizar flecha de dirección
    if (directionArrow) {
      directionArrow.textContent = scrollDirection === 'right' ? '→' : '←';
    }
  }
  
  // Manejar navegación con teclado
  function handleKeyNavigation(e) {
    if (!isInJobsSection()) return;
    
    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (currentJobIndex < jobs.length - 1) {
          scrollDirection = 'right';
          currentJobIndex++;
          updateJobPosition();
          updateJobIndicator();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (currentJobIndex > 0) {
          scrollDirection = 'left';
          currentJobIndex--;
          updateJobPosition();
          updateJobIndicator();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleDownScroll();
        break;
      case 'ArrowUp':
        e.preventDefault();
        handleUpScroll();
        break;
    }
  }
  
  function isInJobsSection() {
    const rect = jobsSection.getBoundingClientRect();
    return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
  }
  
  // Recalcular posición al redimensionar la ventana
  function handleResize() {
    updateJobPosition();
  }
  
  // Inicializar todo
  function init() {
    if (jobs.length > 0) {
      createJobIndicator();
      updateJobPosition();
      
      // Event listeners
      document.addEventListener('wheel', handleWheelScroll, { passive: false });
      document.addEventListener('keydown', handleKeyNavigation);
      window.addEventListener('resize', handleResize);
      
      // Limpiar event listeners al salir
      window.addEventListener('beforeunload', () => {
        document.removeEventListener('wheel', handleWheelScroll);
        document.removeEventListener('keydown', handleKeyNavigation);
        window.removeEventListener('resize', handleResize);
      });
    }
  }
  
  // Inicializar después de que las animaciones GSAP estén listas
  setTimeout(init, 1200);
}

// Animaciones GSAP para trabajos
function setupSection5Animations() {
  // Animación para el título
  gsap.from('.section-jobs h2', {
    scrollTrigger: {
      trigger: '.section-jobs',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'back.out'
  });

  // Animación de entrada para la primera tarjeta de trabajo
  gsap.from('.job-card:first-child', {
    scrollTrigger: {
      trigger: '.section-jobs',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'back.out'
  });

  // Efecto wobble al hover (diferente al de proyectos)
  function addWobbleEffect() {
    const jobs = document.querySelectorAll('.job-card');
    jobs.forEach(job => {
      job.addEventListener('mouseenter', () => {
        gsap.to(job, {
          keyframes: [
            { rotate: -3, duration: 0.15 },
            { rotate: 2, duration: 0.15 },
            { rotate: -1, duration: 0.1 },
            { rotate: 0, duration: 0.1 }
          ],
          ease: 'power1.inOut'
        });
      });
    });
  }

  // Inicializar efecto después de cargar la página
  setTimeout(addWobbleEffect, 500);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  setupSection5Animations();
  setupHorizontalJobsNavigation();
});