// ===== SECCIÓN PROYECTOS CON NAVEGACIÓN ADAPTATIVA =====

function setupHorizontalScrollNavigation() {
  let currentProjectIndex = 0;
  let isScrolling = false;
  let sectionLocked = false;
  let isChangingSection = false;
  let autoSnapTimeout;
  let isMobileDevice = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  const projects = document.querySelectorAll('.project-card');
  const projectsContainer = document.querySelector('.projects-container');
  const projectsSection = document.querySelector('.section-projects');
  
  // Detectar si es dispositivo móvil o tablet
  function detectMobileDevice() {
    const width = window.innerWidth;
    isMobileDevice = width <= 968; // Tablets pequeñas hacia abajo
    
    // También verificar si es dispositivo táctil
    const hasTouch = ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0) || 
                     (navigator.msMaxTouchPoints > 0);
    
    return isMobileDevice && hasTouch;
  }
  
  // Configurar el container según el dispositivo
  function setupProjectsDisplay() {
    if (detectMobileDevice()) {
      // En móviles: scroll nativo horizontal
      setupMobileScrolling();
    } else {
      // En desktop: navegación controlada
      setupDesktopNavigation();
    }
  }
  
  // ===== CONFIGURACIÓN PARA MÓVILES =====
  function setupMobileScrolling() {
    projectsContainer.style.transform = 'none';
    projectsContainer.style.transition = 'none';
    
    // Hacer el contenedor scrolleable horizontalmente
    projectsContainer.style.overflowX = 'auto';
    projectsContainer.style.overflowY = 'hidden';
    projectsContainer.style.scrollBehavior = 'smooth';
    projectsContainer.style.scrollSnapType = 'x mandatory';
    
    // Configurar scroll snap para cada tarjeta
    projects.forEach(card => {
      card.style.scrollSnapAlign = 'center';
    });
    
    // Detectar el proyecto actual basado en el scroll
    let scrollTimeout;
    projectsContainer.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateCurrentProjectFromScroll, 150);
    });
    
    // Configurar gestos touch
    setupTouchGestures();
  }
  
  // ===== GESTOS TOUCH PARA MÓVILES =====
  function setupTouchGestures() {
    // Touch events para navegación vertical entre secciones
    projectsSection.addEventListener('touchstart', handleTouchStart, { passive: true });
    projectsSection.addEventListener('touchmove', handleTouchMove, { passive: false });
    projectsSection.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
  
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
  
  function handleTouchMove(e) {
    // Permitir scroll horizontal del contenedor
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    
    const deltaX = Math.abs(touchCurrentX - touchStartX);
    const deltaY = Math.abs(touchCurrentY - touchStartY);
    
    // Si el gesto es más horizontal, permitir scroll del contenedor
    if (deltaX > deltaY) {
      // Scroll horizontal - no prevenir
      return;
    }
    
    // Si el gesto es más vertical y estamos en el área de proyectos, manejarlo
    if (deltaY > deltaX && deltaY > 20) {
      const projectsRect = projectsContainer.getBoundingClientRect();
      const touchX = e.touches[0].clientX;
      
      // Solo manejar si el toque está sobre el área de proyectos
      if (touchX >= projectsRect.left && touchX <= projectsRect.right) {
        e.preventDefault(); // Prevenir scroll vertical del body
      }
    }
  }
  
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    const minSwipeDistance = 50;
    
    // Determinar tipo de gesto
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Gesto horizontal - manejado por el scroll nativo
      return;
    } else if (Math.abs(deltaY) > minSwipeDistance) {
      // Gesto vertical - navegar entre secciones
      if (deltaY < 0) {
        // Swipe hacia arriba - sección anterior
        goToPreviousSection();
      } else {
        // Swipe hacia abajo - siguiente sección
        goToNextSection();
      }
    }
  }
  
  // Actualizar proyecto actual basado en scroll
  function updateCurrentProjectFromScroll() {
    if (!isMobileDevice) return;
    
    const containerRect = projectsContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    projects.forEach((project, index) => {
      const projectRect = project.getBoundingClientRect();
      const projectCenter = projectRect.left + projectRect.width / 2;
      const distance = Math.abs(projectCenter - containerCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== currentProjectIndex) {
      currentProjectIndex = closestIndex;
      updateProjectIndicator();
    }
  }
  
  // ===== CONFIGURACIÓN PARA DESKTOP =====
  function setupDesktopNavigation() {
    projectsContainer.style.overflowX = 'hidden';
    projectsContainer.style.transition = 'transform 0.5s ease-in-out';
    
    // Calcular el ancho de cada proyecto incluyendo el gap
    const projectWidth = 350 + 40;
    
    function updateProjectPosition() {
      const containerWidth = projectsSection.offsetWidth;
      const centerOffset = (containerWidth - 350) / 2;
      const offset = centerOffset - (currentProjectIndex * projectWidth);
      projectsContainer.style.transform = `translateX(${offset}px)`;
    }
    
    return updateProjectPosition;
  }
  
  // ===== NAVEGACIÓN ENTRE SECCIONES =====
  function goToNextSection() {
    console.log('Navegando a la siguiente sección');
    const nextSection = projectsSection.nextElementSibling;
    if (nextSection) {
      sectionLocked = false;
      isChangingSection = true;
      nextSection.scrollIntoView({ behavior: 'smooth' });
      
      setTimeout(() => {
        isChangingSection = false;
      }, 1500);
    }
  }
  
  function goToPreviousSection() {
    console.log('Navegando a la sección anterior');
    const prevSection = projectsSection.previousElementSibling;
    if (prevSection) {
      sectionLocked = false;
      isChangingSection = true;
      prevSection.scrollIntoView({ behavior: 'smooth' });
      
      setTimeout(() => {
        isChangingSection = false;
      }, 1500);
    }
  }
  
  // ===== AUTO-SNAP PARA DESKTOP =====
  function autoSnapToSection() {
    if (!isMobileDevice && isInProjectsSection() && !sectionLocked) {
      projectsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      sectionLocked = true;
      
      clearTimeout(autoSnapTimeout);
      autoSnapTimeout = setTimeout(() => {
        sectionLocked = false;
      }, 3000);
    }
  }
  
  // ===== INTERSECTION OBSERVER =====
  function setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0.3, 0.7]
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          if (!isChangingSection && !isMobileDevice) {
            setTimeout(autoSnapToSection, 100);
          }
        } else if (!entry.isIntersecting) {
          sectionLocked = false;
          isChangingSection = false;
          clearTimeout(autoSnapTimeout);
        }
      });
    }, observerOptions);
    
    observer.observe(projectsSection);
    return observer;
  }
  
  function isInProjectsSection() {
    const rect = projectsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibilityRatio = visibleHeight / windowHeight;
    return visibilityRatio > 0.4;
  }
  
  // ===== NAVEGACIÓN CON WHEEL (SOLO DESKTOP) =====
  function handleWheelScroll(e) {
    if (isMobileDevice || isChangingSection) {
      return; // No manejar wheel en móviles
    }
    
    if (!isInProjectsSection()) return;
    
    if (!sectionLocked) {
      autoSnapToSection();
      return;
    }
    
    e.preventDefault();
    
    if (isScrolling) return;
    
    isScrolling = true;
    
    clearTimeout(autoSnapTimeout);
    autoSnapTimeout = setTimeout(() => {
      sectionLocked = false;
    }, 3000);
    
    const deltaY = e.deltaY;
    
    if (deltaY > 0) {
      handleScrollDown();
    } else {
      handleScrollUp();
    }
    
    setTimeout(() => {
      isScrolling = false;
    }, 600);
  }
  
  function handleScrollDown() {
    if (currentProjectIndex < projects.length - 1) {
      currentProjectIndex++;
      if (!isMobileDevice) {
        updateProjectPosition();
      }
      updateProjectIndicator();
    } else {
      isChangingSection = true;
      sectionLocked = false;
      clearTimeout(autoSnapTimeout);
      
      setTimeout(() => {
        goToNextSection();
        setTimeout(() => {
          isChangingSection = false;
        }, 1500);
      }, 200);
    }
  }
  
  function handleScrollUp() {
    if (currentProjectIndex > 0) {
      currentProjectIndex--;
      if (!isMobileDevice) {
        updateProjectPosition();
      }
      updateProjectIndicator();
    } else {
      isChangingSection = true;
      sectionLocked = false;
      clearTimeout(autoSnapTimeout);
      
      setTimeout(() => {
        goToPreviousSection();
        setTimeout(() => {
          isChangingSection = false;
        }, 1500);
      }, 200);
    }
  }
  
  // ===== INDICADOR VISUAL =====
  function createProjectIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'projects-indicator';
    
    const dotsHtml = Array.from(projects).map((_, index) => 
      `<span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
    ).join('');
    
    const directionText = isMobileDevice ? 'Swipe to explore' : 'Scroll to navigate';
    const hintText = isMobileDevice ? '⇅ Swipe up/down for sections' : '↑ About Me | Jobs ↓';
    
    indicator.innerHTML = `
      <div class="indicator-dots">
        ${dotsHtml}
      </div>
      <div class="indicator-direction">
        <span class="direction-arrow">${isMobileDevice ? '⟷' : '⟷'}</span>
        <span class="direction-text">${directionText}</span>
      </div>
      <div class="navigation-hint">
        <span class="hint-text">${hintText}</span>
      </div>
    `;
    
    projectsSection.appendChild(indicator);
    
    // Eventos para los dots
    const dots = indicator.querySelectorAll('.dot');
    dots.forEach(dot => {
      dot.addEventListener('click', handleDotClick);
    });
  }
  
  function handleDotClick(e) {
    const index = parseInt(e.target.dataset.index);
    currentProjectIndex = index;
    
    if (isMobileDevice) {
      // En móviles, hacer scroll al proyecto correspondiente
      const targetProject = projects[index];
      if (targetProject) {
        targetProject.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    } else {
      // En desktop, usar la función de posicionamiento
      updateProjectPosition();
    }
    
    updateProjectIndicator();
    
    // Extender bloqueo
    if (!isMobileDevice) {
      sectionLocked = true;
      clearTimeout(autoSnapTimeout);
      autoSnapTimeout = setTimeout(() => {
        sectionLocked = false;
      }, 5000);
    }
  }
  
  function updateProjectIndicator() {
    const dots = document.querySelectorAll('.projects-indicator .dot');
    const hintText = document.querySelector('.hint-text');
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentProjectIndex);
    });
    
    // Actualizar hint según dispositivo y posición
    if (hintText) {
      if (isMobileDevice) {
        if (currentProjectIndex === 0) {
          hintText.textContent = '⇅ Swipe up: About | Continue →';
          hintText.style.color = '#ff6b35';
        } else if (currentProjectIndex === projects.length - 1) {
          hintText.textContent = '← Continue | Swipe down: Jobs ⇅';
          hintText.style.color = '#ff6b35';
        } else {
          hintText.textContent = '⇅ Swipe up/down for sections';
          hintText.style.color = 'rgba(128, 0, 255, 0.7)';
        }
      } else {
        // Desktop hints
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
  }
  
  // ===== NAVEGACIÓN CON TECLADO (SOLO DESKTOP) =====
  function handleKeyNavigation(e) {
    if (isMobileDevice || !isInProjectsSection()) return;
    
    if (!sectionLocked) {
      autoSnapToSection();
      return;
    }
    
    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        handleScrollDown();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleScrollUp();
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
        sectionLocked = false;
        break;
    }
    
    extendSectionLock();
  }
  
  function extendSectionLock() {
    if (!isMobileDevice) {
      sectionLocked = true;
      clearTimeout(autoSnapTimeout);
      autoSnapTimeout = setTimeout(() => {
        sectionLocked = false;
      }, 4000);
    }
  }
  
  // ===== MANEJO DE REDIMENSIONAMIENTO =====
  function handleResize() {
    const wasMobile = isMobileDevice;
    detectMobileDevice();
    
    // Si cambió el tipo de dispositivo, reconfigurar
    if (wasMobile !== isMobileDevice) {
      setupProjectsDisplay();
      updateIndicatorForDevice();
    }
    
    if (!isMobileDevice) {
      updateProjectPosition();
      if (isInProjectsSection() && sectionLocked) {
        setTimeout(autoSnapToSection, 100);
      }
    }
  }
  
  function updateIndicatorForDevice() {
    const indicator = document.querySelector('.projects-indicator');
    if (indicator) {
      indicator.remove();
      createProjectIndicator();
    }
  }
  
  // ===== FUNCIONES DE LIMPIEZA =====
  function cleanup() {
    if (autoSnapTimeout) {
      clearTimeout(autoSnapTimeout);
    }
    
    // Remover event listeners
    document.removeEventListener('wheel', handleWheelScroll);
    document.removeEventListener('keydown', handleKeyNavigation);
    window.removeEventListener('resize', handleResize);
    
    // Remover touch listeners si existen
    if (projectsSection) {
      projectsSection.removeEventListener('touchstart', handleTouchStart);
      projectsSection.removeEventListener('touchmove', handleTouchMove);
      projectsSection.removeEventListener('touchend', handleTouchEnd);
    }
    
    if (projectsContainer) {
      projectsContainer.removeEventListener('scroll', updateCurrentProjectFromScroll);
    }
  }
  
  // ===== FUNCIÓN DE INICIALIZACIÓN =====
  function init() {
    // Detectar dispositivo y configurar
    detectMobileDevice();
    setupProjectsDisplay();
    createProjectIndicator();
    
    // Variable para updateProjectPosition (solo desktop)
    let updateProjectPosition;
    if (!isMobileDevice) {
      updateProjectPosition = setupDesktopNavigation();
    }
    
    // Configurar intersection observer
    const observer = setupIntersectionObserver();
    
    // Event listeners según dispositivo
    if (!isMobileDevice) {
      document.addEventListener('wheel', handleWheelScroll, { passive: false });
      document.addEventListener('keydown', handleKeyNavigation);
    }
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('beforeunload', cleanup);
    
    // Auto-snap inicial solo para desktop
    setTimeout(() => {
      if (!isMobileDevice && isInProjectsSection()) {
        autoSnapToSection();
      }
    }, 500);
    
    return { cleanup, observer, updateProjectPosition };
  }
  
  // Inicializar después de que GSAP esté listo
  setTimeout(init, 1000);
}

// ===== ANIMACIONES GSAP ACTUALIZADAS =====
function setupSection3Animations() {
  // Detectar si es móvil para ajustar animaciones
  const isMobile = window.innerWidth <= 968;
  
  // Animación para el título
  gsap.from('.section-projects h2', {
    scrollTrigger: {
      trigger: '.section-projects',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: isMobile ? 20 : 30,
    duration: isMobile ? 0.6 : 0.8,
    ease: 'back.out'
  });

  // Animación de entrada para las tarjetas
  if (isMobile) {
    // En móviles, animar todas las tarjetas visibles
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '.section-projects',
        start: 'top 60%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out'
    });
  } else {
    // En desktop, solo la primera tarjeta
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
  }

  // Efecto de vibración al hover (solo desktop)
  function addShakeEffect() {
    if (window.innerWidth > 968) {
      const projects = document.querySelectorAll('.project-card');
      projects.forEach(project => {
        project.addEventListener('mouseenter', () => {
          gsap.to(project, {
            keyframes: [
              { rotate: 1.5, duration: 0.08 },
              { rotate: -1.5, duration: 0.08 },
              { rotate: 0.8, duration: 0.08 },
              { rotate: 0, duration: 0.08 }
            ],
            ease: 'power1.inOut'
          });
        });
      });
    }
  }

  setTimeout(addShakeEffect, 500);
}

// ===== OPTIMIZACIÓN PARA RENDIMIENTO =====
function optimizeForDevice() {
  const isMobile = window.innerWidth <= 968;
  
  if (isMobile) {
    // Configurar para mejor rendimiento en móviles
    gsap.config({
      force3D: false,
      nullTargetWarn: false
    });
    
    // Reducir complejidad visual en dispositivos lentos
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      const projects = document.querySelectorAll('.project-card');
      projects.forEach(project => {
        project.style.backdropFilter = 'none';
        project.style.transition = 'transform 0.2s ease';
      });
    }
  }
}

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', () => {
  optimizeForDevice();
  setupSection3Animations();
  setupHorizontalScrollNavigation();
  
  // Pausar animaciones cuando la pestaña no está visible
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });
});