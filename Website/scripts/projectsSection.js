// ===== SECCIÓN PROYECTOS CON NAVEGACIÓN HORIZONTAL Y AUTO-CENTRADO =====

function setupHorizontalScrollNavigation() {
  let currentProjectIndex = 0;
  let isScrolling = false;
  let sectionLocked = false; // Para controlar cuando la sección está "bloqueada"
  let isChangingSection = false; // NUEVO: Para prevenir loops al cambiar sección
  let autoSnapTimeout;
  
  const projects = document.querySelectorAll('.project-card');
  const projectsContainer = document.querySelector('.projects-container');
  const projectsSection = document.querySelector('.section-projects');
  
  // Configurar el container para mostrar solo un proyecto
  function setupProjectsDisplay() {
    projectsContainer.style.transform = 'translateX(0px)';
    projectsContainer.style.transition = 'transform 0.5s ease-in-out';
    
    // Calcular el ancho de cada proyecto incluyendo el gap
    const projectWidth = 350 + 40; // ancho de la tarjeta + gap
    
    // Calcular offset para centrar el proyecto
    function updateProjectPosition() {
      const containerWidth = projectsSection.offsetWidth;
      const centerOffset = (containerWidth - 350) / 2; // Centrar la tarjeta de 350px
      const offset = centerOffset - (currentProjectIndex * projectWidth);
      projectsContainer.style.transform = `translateX(${offset}px)`;
    }
    
    return updateProjectPosition;
  }
  
  const updateProjectPosition = setupProjectsDisplay();
  
  // ===== NUEVA FUNCIÓN: AUTO-SNAP AL ENTRAR A LA SECCIÓN =====
  function autoSnapToSection() {
    if (isInProjectsSection() && !sectionLocked) {
      // Centrar automáticamente la sección en la pantalla
      projectsSection.scrollIntoView({ 
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
    
    observer.observe(projectsSection);
    return observer;
  }
  
  // Mejorar la detección de estar en la sección
  function isInProjectsSection() {
    const rect = projectsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Considerar que estamos en la sección si está visible al menos 40%
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibilityRatio = visibleHeight / windowHeight;
    
    return visibilityRatio > 0.4;
  }
  
  // ===== FUNCIONES DE NAVEGACIÓN SIMPLIFICADAS =====
  function goToNextSection() {
    console.log('Intentando ir a la siguiente sección');
    // Ir simplemente a la siguiente sección (jobs)
    const nextSection = projectsSection.nextElementSibling;
    console.log('Siguiente sección encontrada:', nextSection);
    if (nextSection) {
      sectionLocked = false;
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('No hay siguiente sección');
    }
  }
  
  function goToPreviousSection() {
    console.log('Intentando ir a la sección anterior');
    // Ir simplemente a la sección anterior (about-me)
    const prevSection = projectsSection.previousElementSibling;
    console.log('Sección anterior encontrada:', prevSection);
    if (prevSection) {
      sectionLocked = false;
      prevSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.log('No hay sección anterior');
    }
  }
  
  // ===== LÓGICA SIMPLIFICADA DE NAVEGACIÓN =====
  function handleWheelScroll(e) {
    // NUEVO: Si estamos cambiando de sección, ignorar todos los scrolls
    if (isChangingSection) {
      e.preventDefault();
      return;
    }
    
    // Solo manejar si estamos en la sección de proyectos
    if (!isInProjectsSection()) return;
    
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
    
    console.log('Scroll detectado:', deltaY > 0 ? 'ABAJO' : 'ARRIBA', 'Proyecto actual:', currentProjectIndex, 'Total proyectos:', projects.length);
    
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
    }, 600);
  }
  
  function handleScrollDown() {
    console.log('HandleScrollDown - Índice actual:', currentProjectIndex, 'Máximo:', projects.length - 1);
    
    if (currentProjectIndex < projects.length - 1) {
      // Hay más proyectos, avanzar
      console.log('Avanzando al proyecto:', currentProjectIndex + 1);
      currentProjectIndex++;
      updateProjectPosition();
      updateProjectIndicator();
    } else {
      // No hay más proyectos, ir a la siguiente sección
      console.log('Fin de proyectos, yendo a la siguiente sección');
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
    console.log('HandleScrollUp - Índice actual:', currentProjectIndex);
    
    if (currentProjectIndex > 0) {
      // Hay proyectos anteriores, retroceder
      console.log('Retrocediendo al proyecto:', currentProjectIndex - 1);
      currentProjectIndex--;
      updateProjectPosition();
      updateProjectIndicator();
    } else {
      // No hay proyectos anteriores, ir a la sección anterior
      console.log('Inicio de proyectos, yendo a la sección anterior');
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
  
  // Crear indicador visual mejorado
  function createProjectIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'projects-indicator';
    indicator.innerHTML = `
      <div class="indicator-dots">
        ${Array.from(projects).map((_, index) => 
          `<span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
        ).join('')}
      </div>
      <div class="indicator-direction">
        <span class="direction-arrow">⟷</span>
        <span class="direction-text">Swipe to watch more</span>
      </div>
      <div class="navigation-hint">
        <span class="hint-text">↑ About Me | Jobs ↓</span>
      </div>
    `;
    
    projectsSection.appendChild(indicator);
    
    // Agregar eventos a los dots
    const dots = indicator.querySelectorAll('.dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        currentProjectIndex = index;
        updateProjectPosition();
        updateProjectIndicator();
        
        // Extender el bloqueo al interactuar manualmente
        sectionLocked = true;
        clearTimeout(autoSnapTimeout);
        autoSnapTimeout = setTimeout(() => {
          sectionLocked = false;
        }, 5000);
      });
    });
  }
  
  function updateProjectIndicator() {
    const dots = document.querySelectorAll('.projects-indicator .dot');
    const hintText = document.querySelector('.hint-text');
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentProjectIndex);
    });
    
    // Actualizar hint de navegación según la posición
    if (hintText) {
      if (currentProjectIndex === 0) {
        hintText.textContent = '↑ About Me | Continue →';
        hintText.style.color = '#ff6b35';
      } else if (currentProjectIndex === projects.length - 1) {
        hintText.textContent = '← Continue | Jobs ↓';
        hintText.style.color = '#ff6b35';
      } else {
        hintText.textContent = '↑ About Me | Jobs ↓';
        hintText.style.color = 'rgba(128, 0, 255, 0.7)';
      }
    }
  }
  
  // Manejar navegación con teclado mejorada
  function handleKeyNavigation(e) {
    if (!isInProjectsSection()) return;
    
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
        // Salir de la sección de proyectos
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
    updateProjectPosition();
    // Re-centrar si estamos en la sección
    if (isInProjectsSection() && sectionLocked) {
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
    createProjectIndicator();
    updateProjectPosition();
    
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
      if (isInProjectsSection()) {
        autoSnapToSection();
      }
    }, 500);
    
    return { cleanup, observer };
  }
  
  // Inicializar después de que las animaciones GSAP estén listas
  setTimeout(init, 1000);
}

// Animaciones GSAP actualizadas
function setupSection3Animations() {
  // Animación para el título
  gsap.from('.section-projects h2', {
    scrollTrigger: {
      trigger: '.section-projects',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'back.out'
  });

  // Animación de entrada para las tarjetas de proyectos (solo la primera)
  gsap.from('.project-card:first-child', {
    scrollTrigger: {
      trigger: '.section-projects',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'back.out'
  });

  // Efecto de vibración al hover (mantenido)
  function addShakeEffect() {
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
      project.addEventListener('mouseenter', () => {
        gsap.to(project, {
          keyframes: [
            { rotate: 2, duration: 0.1 },
            { rotate: -2, duration: 0.1 },
            { rotate: 1, duration: 0.1 },
            { rotate: 0, duration: 0.1 }
          ],
          ease: 'power1.inOut'
        });
      });
    });
  }

  setTimeout(addShakeEffect, 500);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  setupSection3Animations();
  setupHorizontalScrollNavigation();
});