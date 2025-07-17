// ===== SECCIÓN TRABAJOS CON NAVEGACIÓN HORIZONTAL Y AUTO-CENTRADO =====

function setupHorizontalJobsNavigation() {
  let currentJobIndex = 0;
  let isScrolling = false;
  let sectionLocked = false; // Para controlar cuando la sección está "bloqueada"
  let isChangingSection = false; // NUEVO: Para prevenir loops al cambiar sección
  let autoSnapTimeout;
  
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
  
  // ===== NUEVA FUNCIÓN: AUTO-SNAP AL ENTRAR A LA SECCIÓN =====
  function autoSnapToSection() {
    if (isInJobsSection() && !sectionLocked) {
      // Centrar automáticamente la sección en la pantalla
      jobsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      // Bloquear la sección por un momento para permitir la navegación horizontal
      sectionLocked = true;
      
      // Desbloquear después de un tiempo si no hay actividad
      clearTimeout(autoSnapTimeout);
      autoSnapTimeout = setTimeout(() => {
        sectionLocked = false;
      }, 3000); // 3 segundos de gracia
    }
  }
  
  // ===== DETECTAR CUANDO SE ENTRA A LA SECCIÓN =====
  function setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Activar cuando la sección esté al 20% visible
      threshold: [0.3, 0.7] // Activar entre 30% y 70% de visibilidad
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          // La sección está visible, hacer auto-snap
          if (!isChangingSection) { // NUEVO: Solo auto-snap si no estamos cambiando sección
            setTimeout(autoSnapToSection, 100); // Pequeño delay para suavizar
          }
        } else if (!entry.isIntersecting) {
          // La sección ya no está visible, desbloquear
          sectionLocked = false;
          isChangingSection = false; // NUEVO: Resetear flag cuando salimos de la sección
          clearTimeout(autoSnapTimeout);
        }
      });
    }, observerOptions);
    
    observer.observe(jobsSection);
    return observer;
  }
  
  // Mejorar la detección de estar en la sección
  function isInJobsSection() {
    const rect = jobsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Considerar que estamos en la sección si está visible al menos 40%
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibilityRatio = visibleHeight / windowHeight;
    
    return visibilityRatio > 0.4;
  }
  
  // ===== FUNCIONES DE NAVEGACIÓN SIMPLIFICADAS =====
  function goToNextSection() {
    console.log('Jobs: Intentando ir a la siguiente sección');
    // Ir simplemente a la siguiente sección (contact-me)
    const nextSection = jobsSection.nextElementSibling;
    console.log('Jobs: Siguiente sección encontrada:', nextSection);
    if (nextSection) {
      sectionLocked = false;
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('Jobs: No hay siguiente sección');
    }
  }
  
  function goToPreviousSection() {
    console.log('Jobs: Intentando ir a la sección anterior');
    // Ir simplemente a la sección anterior (projects)
    const prevSection = jobsSection.previousElementSibling;
    console.log('Jobs: Sección anterior encontrada:', prevSection);
    if (prevSection) {
      sectionLocked = false;
      prevSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('Jobs: No hay sección anterior');
    }
  }
  
  // ===== LÓGICA SIMPLIFICADA DE NAVEGACIÓN =====
  function handleWheelScroll(e) {
    // NUEVO: Si estamos cambiando de sección, ignorar todos los scrolls
    if (isChangingSection) {
      e.preventDefault();
      return;
    }
    
    // Solo manejar si estamos en la sección de trabajos
    if (!isInJobsSection()) return;
    
    // Si la sección no está centrada, centrarla primero
    if (!sectionLocked) {
      autoSnapToSection();
      return;
    }
    
    e.preventDefault();
    
    if (isScrolling) return;
    
    isScrolling = true;
    
    // Extender el tiempo de bloqueo cuando hay actividad
    clearTimeout(autoSnapTimeout);
    autoSnapTimeout = setTimeout(() => {
      sectionLocked = false;
    }, 3000);
    
    // Determinar dirección del scroll
    const deltaY = e.deltaY;
    
    console.log('Jobs - Scroll detectado:', deltaY > 0 ? 'ABAJO' : 'ARRIBA', 'Job actual:', currentJobIndex, 'Total jobs:', jobs.length);
    
    if (deltaY > 0) {
      // Scroll hacia abajo - navegar hacia adelante
      handleScrollDown();
    } else {
      // Scroll hacia arriba - navegar hacia atrás
      handleScrollUp();
    }
    
    // Resetear flag después de la animación
    setTimeout(() => {
      isScrolling = false;
    }, 700);
  }
  
  function handleScrollDown() {
    console.log('Jobs - HandleScrollDown - Índice actual:', currentJobIndex, 'Máximo:', jobs.length - 1);
    
    if (currentJobIndex < jobs.length - 1) {
      // Hay más trabajos, avanzar
      console.log('Jobs - Avanzando al trabajo:', currentJobIndex + 1);
      currentJobIndex++;
      updateJobPosition();
      updateJobIndicator();
    } else {
      // No hay más trabajos, ir a la siguiente sección
      console.log('Jobs - Fin de trabajos, yendo a la siguiente sección');
      isChangingSection = true; // NUEVO: Bloquear scrolls mientras cambiamos
      sectionLocked = false; 
      clearTimeout(autoSnapTimeout);
      
      setTimeout(() => {
        goToNextSection();
        // NUEVO: Resetear el flag después de un tiempo
        setTimeout(() => {
          isChangingSection = false;
        }, 1500); // 1.5 segundos para que termine la animación
      }, 200);
    }
  }
  
  function handleScrollUp() {
    console.log('Jobs - HandleScrollUp - Índice actual:', currentJobIndex);
    
    if (currentJobIndex > 0) {
      // Hay trabajos anteriores, retroceder
      console.log('Jobs - Retrocediendo al trabajo:', currentJobIndex - 1);
      currentJobIndex--;
      updateJobPosition();
      updateJobIndicator();
    } else {
      // No hay trabajos anteriores, ir a la sección anterior
      console.log('Jobs - Inicio de trabajos, yendo a la sección anterior');
      isChangingSection = true; // NUEVO: Bloquear scrolls mientras cambiamos
      sectionLocked = false; 
      clearTimeout(autoSnapTimeout);
      
      setTimeout(() => {
        goToPreviousSection();
        // NUEVO: Resetear el flag después de un tiempo
        setTimeout(() => {
          isChangingSection = false;
        }, 1500); // 1.5 segundos para que termine la animación
      }, 200);
    }
  }
  
  // Crear indicador visual mejorado para trabajos
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
        <span class="direction-arrow">⟷</span>
        <span class="direction-text">Swipe to explore experience</span>
      </div>
      <div class="navigation-hint">
        <span class="hint-text">↑ Projects | Contact ↓</span>
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
        
        // Extender el bloqueo al interactuar manualmente
        sectionLocked = true;
        clearTimeout(autoSnapTimeout);
        autoSnapTimeout = setTimeout(() => {
          sectionLocked = false;
        }, 5000);
      });
    });
  }
  
  function updateJobIndicator() {
    const dots = document.querySelectorAll('.jobs-indicator .dot');
    const hintText = document.querySelector('.jobs-indicator .hint-text');
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentJobIndex);
    });
    
    // Actualizar hint de navegación según la posición
    if (hintText) {
      if (currentJobIndex === 0) {
        hintText.textContent = '↑ Projects | Continue →';
        hintText.style.color = '#ff6b35';
      } else if (currentJobIndex === jobs.length - 1) {
        hintText.textContent = '← Continue | Contact ↓';
        hintText.style.color = '#ff6b35';
      } else {
        hintText.textContent = '↑ Projects | Contact ↓';
        hintText.style.color = 'rgba(128, 0, 255, 0.7)';
      }
    }
  }
  
  // Manejar navegación con teclado mejorada
  function handleKeyNavigation(e) {
    if (!isInJobsSection()) return;
    
    // Auto-centrar si no está bloqueada la sección
    if (!sectionLocked) {
      autoSnapToSection();
      return;
    }
    
    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        handleScrollDown(); // Usar la misma lógica que scroll hacia abajo
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleScrollUp(); // Usar la misma lógica que scroll hacia arriba
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleScrollDown();
        break;
      case 'ArrowUp':
        e.preventDefault();
        handleScrollUp();
        break;
      case 'Escape':
        // Salir de la sección de trabajos
        sectionLocked = false;
        break;
    }
    
    // Extender el bloqueo al usar teclado
    extendSectionLock();
  }
  
  function extendSectionLock() {
    sectionLocked = true;
    clearTimeout(autoSnapTimeout);
    autoSnapTimeout = setTimeout(() => {
      sectionLocked = false;
    }, 4000);
  }
  
  // Recalcular posición al redimensionar la ventana
  function handleResize() {
    updateJobPosition();
    // Re-centrar si estamos en la sección
    if (isInJobsSection() && sectionLocked) {
      setTimeout(autoSnapToSection, 100);
    }
  }
  
  // ===== FUNCIÓN DE LIMPIEZA =====
  function cleanup() {
    if (autoSnapTimeout) {
      clearTimeout(autoSnapTimeout);
    }
    document.removeEventListener('wheel', handleWheelScroll);
    document.removeEventListener('keydown', handleKeyNavigation);
    window.removeEventListener('resize', handleResize);
  }
  
  // Inicializar todo
  function init() {
    if (jobs.length > 0) {
      createJobIndicator();
      updateJobPosition();
      
      // Configurar el observer para auto-snap
      const observer = setupIntersectionObserver();
      
      // Event listeners
      document.addEventListener('wheel', handleWheelScroll, { passive: false });
      document.addEventListener('keydown', handleKeyNavigation);
      window.addEventListener('resize', handleResize);
      
      // Limpiar event listeners al salir
      window.addEventListener('beforeunload', cleanup);
      
      // Auto-snap inicial si ya estamos en la sección
      setTimeout(() => {
        if (isInJobsSection()) {
          autoSnapToSection();
        }
      }, 500);
      
      return { cleanup, observer };
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