// ===== SECCIÓN PROYECTOS - NAVEGACIÓN CON DOTS CORREGIDA =====

function setupHorizontalScrollNavigation() {
  let currentProjectIndex = 0;
  let isMobileDevice = false;
  let updateProjectPosition = null;
  
  const projects = document.querySelectorAll('.project-card');
  const projectsContainer = document.querySelector('.projects-container');
  const projectsSection = document.querySelector('.section-projects');
  
  // Detectar si es dispositivo móvil o tablet
  function detectMobileDevice() {
    const width = window.innerWidth;
    isMobileDevice = width <= 968;
    return isMobileDevice;
  }
  
  // Configurar el container según el dispositivo
  function setupProjectsDisplay() {
    if (detectMobileDevice()) {
      setupMobileScrolling();
      return null;
    } else {
      return setupDesktopNavigation();
    }
  }
  
  // ===== CONFIGURACIÓN PARA MÓVILES =====
  function setupMobileScrolling() {
    console.log('Projects: Configurando scroll móvil');
    
    // Resetear transformaciones de desktop
    projectsContainer.style.transform = 'none';
    projectsContainer.style.transition = 'none';
    
    // Configurar scroll horizontal
    projectsContainer.style.overflowX = 'auto';
    projectsContainer.style.overflowY = 'hidden';
    projectsContainer.style.scrollBehavior = 'smooth';
    projectsContainer.style.scrollSnapType = 'x mandatory';
    projectsContainer.style.overscrollBehaviorX = 'contain';
    projectsContainer.style.webkitOverflowScrolling = 'touch';
    
    // Asegurar que el container ocupe todo el ancho disponible
    projectsContainer.style.width = '100%';
    projectsContainer.style.maxWidth = 'none';
    projectsContainer.style.justifyContent = 'flex-start';
    
    // Configurar scroll snap para cada tarjeta
    projects.forEach(card => {
      card.style.scrollSnapAlign = 'center';
      card.style.flexShrink = '0';
    });
    
    // Scroll inicial al primer proyecto
    setTimeout(() => {
      if (projects.length > 0) {
        projectsContainer.scrollLeft = 0;
        console.log('Projects: Scroll inicial a la izquierda en móvil');
      }
    }, 100);
    
    // Listener para detectar scroll y actualizar dots
    setupMobileScrollListener();
  }
  
  // ===== LISTENER PARA SCROLL EN MÓVILES =====
  function setupMobileScrollListener() {
    let scrollTimeout;
    
    projectsContainer.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateCurrentIndexFromScroll();
      }, 150);
    });
  }
  
  // ===== ACTUALIZAR ÍNDICE BASADO EN SCROLL =====
  function updateCurrentIndexFromScroll() {
    if (!isMobileDevice) return;
    
    const containerRect = projectsContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    projects.forEach((project, index) => {
      const projectRect = project.getBoundingClientRect();
      const projectCenter = projectRect.left + projectRect.width / 2;
      const distance = Math.abs(containerCenter - projectCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== currentProjectIndex) {
      currentProjectIndex = closestIndex;
      updateProjectIndicator();
      console.log('Projects: Índice actualizado por scroll:', currentProjectIndex);
    }
  }
  
  // ===== CONFIGURACIÓN PARA DESKTOP =====
  function setupDesktopNavigation() {
    console.log('Projects: Configurando navegación desktop');
    
    // Resetear estilos de móvil
    projectsContainer.style.overflowX = 'visible';
    projectsContainer.style.scrollBehavior = 'auto';
    projectsContainer.style.scrollSnapType = 'none';
    
    // Configurar para navegación con transform
    projectsContainer.style.transition = 'transform 0.5s ease-in-out';
    projectsContainer.style.display = 'flex';
    projectsContainer.style.justifyContent = 'flex-start';
    
    // Calcular ancho de cada proyecto (tarjeta + gap)
    const projectWidth = 350 + 30; // width + gap
    
    function updatePosition() {
      // Calcular offset para mostrar proyecto actual en el extremo izquierdo
      const containerWidth = projectsSection.offsetWidth;
      const leftMargin = 50; // Margen desde el borde izquierdo
      const offset = leftMargin - (currentProjectIndex * projectWidth);
      
      projectsContainer.style.transform = `translateX(${offset}px)`;
      console.log(`Projects: Desktop - Moviendo a proyecto ${currentProjectIndex}, offset: ${offset}px`);
    }
    
    // Posición inicial (primer proyecto en extremo izquierdo)
    currentProjectIndex = 0;
    updatePosition();
    
    return updatePosition;
  }
  
  // ===== INDICADOR VISUAL CON DOTS =====
  function createProjectIndicator() {
    // Eliminar indicador existente
    const existingIndicator = document.querySelector('.projects-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.className = 'projects-indicator';
    
    const dotsHtml = Array.from(projects).map((_, index) => 
      `<span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
    ).join('');
    
    const directionText = isMobileDevice ? 'Swipe or click dots' : 'Click dots to navigate';
    
    indicator.innerHTML = `
      <div class="indicator-dots">
        ${dotsHtml}
      </div>
      <div class="indicator-direction">
        <span class="direction-arrow">⟷</span>
        <span class="direction-text">${directionText}</span>
      </div>
    `;
    
    projectsSection.appendChild(indicator);
    
    // Eventos para los dots
    const dots = indicator.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => handleDotClick(index));
    });
    
    console.log('Projects: Indicador creado con', dots.length, 'dots');
  }
  
  // ===== MANEJO DE CLICKS EN DOTS =====
  function handleDotClick(index) {
    console.log('Projects: Click en dot', index);
    
    // Actualizar índice actual
    currentProjectIndex = index;
    
    if (isMobileDevice) {
      // En móviles, scroll al proyecto correspondiente
      const targetProject = projects[index];
      if (targetProject) {
        // Calcular posición de scroll para centrar la tarjeta
        const containerRect = projectsContainer.getBoundingClientRect();
        const projectRect = targetProject.getBoundingClientRect();
        
        const scrollLeft = projectsContainer.scrollLeft + 
                          (projectRect.left - containerRect.left) - 
                          (containerRect.width - projectRect.width) / 2;
        
        projectsContainer.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
        
        console.log('Projects: Scrolling a proyecto', index, 'en móvil');
      }
    } else {
      // En desktop, usar transform
      if (updateProjectPosition) {
        updateProjectPosition();
        console.log('Projects: Actualizando posición a proyecto', index, 'en desktop');
      }
    }
    
    // Actualizar indicador visual
    updateProjectIndicator();
  }
  
  // ===== ACTUALIZAR INDICADOR VISUAL =====
  function updateProjectIndicator() {
    const dots = document.querySelectorAll('.projects-indicator .dot');
    
    dots.forEach((dot, index) => {
      if (index === currentProjectIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    console.log('Projects: Indicador actualizado, proyecto activo:', currentProjectIndex);
  }
  
  // ===== MANEJO DE REDIMENSIONAMIENTO =====
  function handleResize() {
    const wasMobile = isMobileDevice;
    detectMobileDevice();
    
    // Si cambió el tipo de dispositivo, reconfigurar completamente
    if (wasMobile !== isMobileDevice) {
      console.log('Projects: Cambio de dispositivo detectado, reconfigurando...');
      
      // Resetear índice al primer proyecto
      currentProjectIndex = 0;
      
      // Reconfigurar display
      const newUpdateFunction = setupProjectsDisplay();
      if (newUpdateFunction) {
        updateProjectPosition = newUpdateFunction;
      }
      
      // Recrear indicador
      createProjectIndicator();
      
    } else if (!isMobileDevice && updateProjectPosition) {
      // Solo actualizar posición si seguimos en desktop
      updateProjectPosition();
    }
  }
  
  // ===== FUNCIONES DE LIMPIEZA =====
  function cleanup() {
    console.log('Projects: Limpiando event listeners');
    window.removeEventListener('resize', handleResize);
    updateProjectPosition = null;
  }
  
  // ===== FUNCIÓN DE INICIALIZACIÓN =====
  function init() {
    console.log('Projects: Iniciando navegación con dots corregida');
    
    if (!projects.length || !projectsContainer || !projectsSection) {
      console.warn('Projects: Elementos necesarios no encontrados');
      return;
    }
    
    // Detectar dispositivo y configurar
    detectMobileDevice();
    updateProjectPosition = setupProjectsDisplay();
    
    // Crear indicador
    createProjectIndicator();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('beforeunload', cleanup);
    
    console.log('Projects: Navegación inicializada correctamente');
    console.log('Projects: Dispositivo móvil:', isMobileDevice);
    console.log('Projects: Total de proyectos:', projects.length);
    console.log('Projects: Proyecto inicial:', currentProjectIndex);
    
    return { cleanup };
  }
  
  // Inicializar después de que todo esté listo
  setTimeout(init, 1000);
}

// ===== ANIMACIONES GSAP =====
function setupSection3Animations() {
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

  // Animación para el subtítulo
  gsap.from('.section-subtitle', {
    scrollTrigger: {
      trigger: '.section-projects',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: isMobile ? 15 : 20,
    duration: isMobile ? 0.5 : 0.7,
    delay: 0.2,
    ease: 'power2.out'
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
    // En desktop, solo la primera tarjeta inicialmente
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
    gsap.config({
      force3D: false,
      nullTargetWarn: false
    });
    
    // Optimizar para dispositivos con poca memoria
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
  console.log('Projects: DOM cargado, iniciando configuración corregida');
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