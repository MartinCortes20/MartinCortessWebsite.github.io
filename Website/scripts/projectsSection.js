// ===== SECCIÓN PROYECTOS - SOLO NAVEGACIÓN CON DOTS =====

function setupHorizontalScrollNavigation() {
  let currentProjectIndex = 0;
  let isMobileDevice = false;
  
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
    } else {
      return setupDesktopNavigation();
    }
  }
  
  // ===== CONFIGURACIÓN PARA MÓVILES =====
  function setupMobileScrolling() {
    // Resetear posición inicial
    projectsContainer.style.transform = 'none';
    projectsContainer.style.transition = 'none';
    
    // Configurar scroll horizontal
    projectsContainer.style.overflowX = 'auto';
    projectsContainer.style.overflowY = 'hidden';
    projectsContainer.style.scrollBehavior = 'smooth';
    projectsContainer.style.scrollSnapType = 'x mandatory';
    
    // Configurar scroll snap para cada tarjeta
    projects.forEach(card => {
      card.style.scrollSnapAlign = 'center';
    });
    
    // Scroll al primer proyecto
    if (projects.length > 0) {
      setTimeout(() => {
        projects[0].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }, 100);
    }
  }
  
  // ===== CONFIGURACIÓN PARA DESKTOP =====
  function setupDesktopNavigation() {
    // Configurar contenedor para desktop
    projectsContainer.style.overflowX = 'hidden';
    projectsContainer.style.transition = 'transform 0.5s ease-in-out';
    
    const projectWidth = 350 + 40; // ancho de tarjeta + gap
    
    function updateProjectPosition() {
      const containerWidth = projectsSection.offsetWidth;
      const centerOffset = (containerWidth - 350) / 2;
      const offset = centerOffset - (currentProjectIndex * projectWidth);
      projectsContainer.style.transform = `translateX(${offset}px)`;
    }
    
    // Mostrar primer proyecto inicialmente
    currentProjectIndex = 0;
    updateProjectPosition();
    
    return updateProjectPosition;
  }
  
  // ===== INDICADOR VISUAL CON DOTS =====
  function createProjectIndicator() {
    // Eliminar indicador existente si existe
    const existingIndicator = document.querySelector('.projects-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.className = 'projects-indicator';
    
    const dotsHtml = Array.from(projects).map((_, index) => 
      `<span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
    ).join('');
    
    indicator.innerHTML = `
      <div class="indicator-dots">
        ${dotsHtml}
      </div>
      <div class="indicator-direction">
        <span class="direction-arrow">⟷</span>
        <span class="direction-text">Click dots to navigate</span>
      </div>
    `;
    
    projectsSection.appendChild(indicator);
    
    // Eventos para los dots
    const dots = indicator.querySelectorAll('.dot');
    dots.forEach(dot => {
      dot.addEventListener('click', handleDotClick);
    });
    
    console.log('Projects: Indicador creado con', dots.length, 'dots');
  }
  
  // ===== MANEJO DE CLICKS EN DOTS =====
  function handleDotClick(e) {
    const index = parseInt(e.target.dataset.index);
    console.log('Projects: Click en dot', index);
    
    // Actualizar índice actual
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
        console.log('Projects: Scrolling a proyecto', index, 'en móvil');
      }
    } else {
      // En desktop, usar transform
      if (typeof window.updateProjectPosition === 'function') {
        window.updateProjectPosition();
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
    
    // Si cambió el tipo de dispositivo, reconfigurar
    if (wasMobile !== isMobileDevice) {
      console.log('Projects: Cambio de dispositivo detectado, reconfigurando...');
      
      // Resetear índice al primer proyecto
      currentProjectIndex = 0;
      
      const updateProjectPosition = setupProjectsDisplay();
      
      // Guardar función para desktop
      if (!isMobileDevice && typeof updateProjectPosition === 'function') {
        window.updateProjectPosition = updateProjectPosition;
      }
      
      // Recrear indicador para el nuevo dispositivo
      createProjectIndicator();
    } else if (!isMobileDevice && typeof window.updateProjectPosition === 'function') {
      // Solo actualizar posición si seguimos en desktop
      window.updateProjectPosition();
    }
  }
  
  // ===== FUNCIONES DE LIMPIEZA =====
  function cleanup() {
    console.log('Projects: Limpiando event listeners');
    
    // Remover event listeners
    window.removeEventListener('resize', handleResize);
    
    // Limpiar variable global
    if (window.updateProjectPosition) {
      delete window.updateProjectPosition;
    }
  }
  
  // ===== FUNCIÓN DE INICIALIZACIÓN =====
  function init() {
    console.log('Projects: Iniciando navegación solo con dots');
    
    if (!projects.length || !projectsContainer || !projectsSection) {
      console.warn('Projects: Elementos necesarios no encontrados');
      return;
    }
    
    // Detectar dispositivo y configurar
    detectMobileDevice();
    const updateProjectPosition = setupProjectsDisplay();
    
    // Guardar función para desktop
    if (!isMobileDevice && typeof updateProjectPosition === 'function') {
      window.updateProjectPosition = updateProjectPosition;
    }
    
    // Crear indicador
    createProjectIndicator();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('beforeunload', cleanup);
    
    console.log('Projects: Navegación inicializada correctamente');
    console.log('Projects: Dispositivo móvil:', isMobileDevice);
    console.log('Projects: Total de proyectos:', projects.length);
    
    return { cleanup };
  }
  
  // Inicializar después de que GSAP esté listo
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
    gsap.config({
      force3D: false,
      nullTargetWarn: false
    });
    
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
  console.log('Projects: DOM cargado, iniciando configuración solo con dots');
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