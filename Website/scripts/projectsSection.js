// ===== SECCIÓN PROYECTOS CON NAVEGACIÓN HORIZONTAL =====

function setupHorizontalScrollNavigation() {
  let currentProjectIndex = 0;
  let isScrolling = false;
  let scrollDirection = 'right'; // 'right' o 'left'
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
  
  // Prevenir el scroll normal en la sección de proyectos
  function preventNormalScroll(e) {
    if (projectsSection.contains(e.target)) {
      e.preventDefault();
    }
  }
  
  // Manejar el scroll del mouse
  function handleWheelScroll(e) {
    // Solo manejar si estamos en la sección de proyectos
    if (!projectsSection.contains(e.target)) return;
    
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
    
    // Resetear flag después de la animación (más tiempo para scroll más lento)
    setTimeout(() => {
      isScrolling = false;
    }, 900); // Aumentado de 600ms a 900ms
  }
  
  function handleDownScroll() {
    if (scrollDirection === 'right') {
      // Navegando hacia la derecha
      if (currentProjectIndex < projects.length - 1) {
        currentProjectIndex++;
        updateProjectPosition();
        updateProjectIndicator();
      } else {
        // Se acabaron los proyectos hacia la derecha, ir a la siguiente sección
        goToNextSection();
      }
    } else {
      // Navegando hacia la izquierda, cambiar dirección
      scrollDirection = 'right';
      if (currentProjectIndex < projects.length - 1) {
        currentProjectIndex++;
        updateProjectPosition();
        updateProjectIndicator();
      } else {
        goToNextSection();
      }
    }
  }
  
  function handleUpScroll() {
    if (scrollDirection === 'left') {
      // Navegando hacia la izquierda
      if (currentProjectIndex > 0) {
        currentProjectIndex--;
        updateProjectPosition();
        updateProjectIndicator();
      } else {
        // Se acabaron los proyectos hacia la izquierda, ir a la sección anterior
        goToPreviousSection();
      }
    } else {
      // Navegando hacia la derecha, cambiar dirección
      scrollDirection = 'left';
      if (currentProjectIndex > 0) {
        currentProjectIndex--;
        updateProjectPosition();
        updateProjectIndicator();
      } else {
        goToPreviousSection();
      }
    }
  }
  
  function goToNextSection() {
    // Ir a la siguiente sección
    const nextSection = projectsSection.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  function goToPreviousSection() {
    // Ir a la sección anterior
    const prevSection = projectsSection.previousElementSibling;
    if (prevSection) {
      prevSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Crear indicador visual
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
        <span class="direction-arrow">→</span>
        <span class="direction-text">Desliza para navegar</span>
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
      });
    });
  }
  
  function updateProjectIndicator() {
    const dots = document.querySelectorAll('.projects-indicator .dot');
    const directionArrow = document.querySelector('.direction-arrow');
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentProjectIndex);
    });
    
    // Actualizar flecha de dirección
    if (directionArrow) {
      directionArrow.textContent = scrollDirection === 'right' ? '→' : '←';
    }
  }
  
  // Manejar navegación con teclado
  function handleKeyNavigation(e) {
    if (!isInProjectsSection()) return;
    
    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (currentProjectIndex < projects.length - 1) {
          scrollDirection = 'right';
          currentProjectIndex++;
          updateProjectPosition();
          updateProjectIndicator();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (currentProjectIndex > 0) {
          scrollDirection = 'left';
          currentProjectIndex--;
          updateProjectPosition();
          updateProjectIndicator();
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
  
  function isInProjectsSection() {
    const rect = projectsSection.getBoundingClientRect();
    return rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
  }
  
  // Recalcular posición al redimensionar la ventana
  function handleResize() {
    updateProjectPosition();
  }
  
  // Inicializar todo
  function init() {
    createProjectIndicator();
    updateProjectPosition();
    
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