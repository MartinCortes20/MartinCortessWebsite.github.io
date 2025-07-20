// ===== SECCIÓN TRABAJOS - SOLO NAVEGACIÓN CON DOTS =====

function setupHorizontalJobsNavigation() {
  let currentJobIndex = 0;
  let isMobileDevice = false;
  
  const jobs = document.querySelectorAll('.job-card');
  const jobsContainer = document.querySelector('.jobs-container');
  const jobsSection = document.querySelector('.section-jobs');
  
  // Detectar si es dispositivo móvil o tablet
  function detectMobileDevice() {
    const width = window.innerWidth;
    isMobileDevice = width <= 968;
    return isMobileDevice;
  }
  
  // Configurar el container según el dispositivo
  function setupJobsDisplay() {
    if (detectMobileDevice()) {
      setupMobileScrolling();
    } else {
      return setupDesktopNavigation();
    }
  }
  
  // ===== CONFIGURACIÓN PARA MÓVILES =====
  function setupMobileScrolling() {
    // Resetear posición inicial
    jobsContainer.style.transform = 'none';
    jobsContainer.style.transition = 'none';
    
    // Configurar scroll horizontal con límites
    jobsContainer.style.overflowX = 'auto';
    jobsContainer.style.overflowY = 'hidden';
    jobsContainer.style.scrollBehavior = 'smooth';
    jobsContainer.style.scrollSnapType = 'x mandatory';
    
    // Prevenir el overscroll que causa la pestañita negra
    jobsContainer.style.overscrollBehaviorX = 'contain';
    jobsContainer.style.webkitOverflowScrolling = 'touch';
    
    // Limitar el ancho del contenedor para evitar scroll extra
    jobsContainer.style.maxWidth = '100%';
    jobsContainer.style.boxSizing = 'border-box';
    
    // Configurar scroll snap para cada tarjeta
    jobs.forEach(card => {
      card.style.scrollSnapAlign = 'center';
      card.style.boxSizing = 'border-box';
    });
    
    // Scroll al primer trabajo
    if (jobs.length > 0) {
      setTimeout(() => {
        jobs[0].scrollIntoView({
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
    jobsContainer.style.overflowX = 'hidden';
    jobsContainer.style.transition = 'transform 0.6s ease-in-out';
    
    const jobWidth = 350 + 40 + 40; // ancho de tarjeta + gap + márgenes
    
    function updateJobPosition() {
      const containerWidth = jobsSection.offsetWidth;
      const centerOffset = (containerWidth - 350) / 2;
      const offset = centerOffset - (currentJobIndex * jobWidth);
      jobsContainer.style.transform = `translateX(${offset}px)`;
    }
    
    // Mostrar primer trabajo inicialmente
    currentJobIndex = 0;
    updateJobPosition();
    
    return updateJobPosition;
  }
  
  // ===== INDICADOR VISUAL CON DOTS =====
  function createJobIndicator() {
    // Eliminar indicador existente si existe
    const existingIndicator = document.querySelector('.jobs-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.className = 'jobs-indicator';
    
    const dotsHtml = Array.from(jobs).map((_, index) => 
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
    
    jobsSection.appendChild(indicator);
    
    // Eventos para los dots
    const dots = indicator.querySelectorAll('.dot');
    dots.forEach(dot => {
      dot.addEventListener('click', handleDotClick);
    });
    
    console.log('Jobs: Indicador creado con', dots.length, 'dots');
  }
  
  // ===== MANEJO DE CLICKS EN DOTS =====
  function handleDotClick(e) {
    const index = parseInt(e.target.dataset.index);
    console.log('Jobs: Click en dot', index);
    
    // Actualizar índice actual
    currentJobIndex = index;
    
    if (isMobileDevice) {
      // En móviles, hacer scroll al trabajo correspondiente
      const targetJob = jobs[index];
      if (targetJob) {
        targetJob.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
        console.log('Jobs: Scrolling a trabajo', index, 'en móvil');
      }
    } else {
      // En desktop, usar transform
      if (typeof window.updateJobPosition === 'function') {
        window.updateJobPosition();
        console.log('Jobs: Actualizando posición a trabajo', index, 'en desktop');
      }
    }
    
    // Actualizar indicador visual
    updateJobIndicator();
  }
  
  // ===== ACTUALIZAR INDICADOR VISUAL =====
  function updateJobIndicator() {
    const dots = document.querySelectorAll('.jobs-indicator .dot');
    
    dots.forEach((dot, index) => {
      if (index === currentJobIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    console.log('Jobs: Indicador actualizado, trabajo activo:', currentJobIndex);
  }
  
  // ===== MANEJO DE REDIMENSIONAMIENTO =====
  function handleResize() {
    const wasMobile = isMobileDevice;
    detectMobileDevice();
    
    // Si cambió el tipo de dispositivo, reconfigurar
    if (wasMobile !== isMobileDevice) {
      console.log('Jobs: Cambio de dispositivo detectado, reconfigurando...');
      
      // Resetear índice al primer trabajo
      currentJobIndex = 0;
      
      const updateJobPosition = setupJobsDisplay();
      
      // Guardar función para desktop
      if (!isMobileDevice && typeof updateJobPosition === 'function') {
        window.updateJobPosition = updateJobPosition;
      }
      
      // Recrear indicador para el nuevo dispositivo
      createJobIndicator();
    } else if (!isMobileDevice && typeof window.updateJobPosition === 'function') {
      // Solo actualizar posición si seguimos en desktop
      window.updateJobPosition();
    }
  }
  
  // ===== FUNCIONES DE LIMPIEZA =====
  function cleanup() {
    console.log('Jobs: Limpiando event listeners');
    
    // Remover event listeners
    window.removeEventListener('resize', handleResize);
    
    // Limpiar variable global
    if (window.updateJobPosition) {
      delete window.updateJobPosition;
    }
  }
  
  // ===== FUNCIÓN DE INICIALIZACIÓN =====
  function init() {
    console.log('Jobs: Iniciando navegación solo con dots');
    
    if (!jobs.length || !jobsContainer || !jobsSection) {
      console.warn('Jobs: Elementos necesarios no encontrados');
      return;
    }
    
    // Detectar dispositivo y configurar
    detectMobileDevice();
    const updateJobPosition = setupJobsDisplay();
    
    // Guardar función para desktop
    if (!isMobileDevice && typeof updateJobPosition === 'function') {
      window.updateJobPosition = updateJobPosition;
    }
    
    // Crear indicador
    createJobIndicator();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('beforeunload', cleanup);
    
    console.log('Jobs: Navegación inicializada correctamente');
    console.log('Jobs: Dispositivo móvil:', isMobileDevice);
    console.log('Jobs: Total de trabajos:', jobs.length);
    
    return { cleanup };
  }
  
  // Inicializar después de que GSAP esté listo
  setTimeout(init, 1200);
}

// ===== ANIMACIONES GSAP =====
function setupSection5Animations() {
  const isMobile = window.innerWidth <= 968;
  
  // Animación para el título
  gsap.from('.section-jobs h2', {
    scrollTrigger: {
      trigger: '.section-jobs',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: isMobile ? 20 : 30,
    duration: isMobile ? 0.6 : 0.8,
    ease: 'back.out'
  });

  // Animación para el subtítulo (si existe)
  gsap.from('.section-jobs .section-subtitle', {
    scrollTrigger: {
      trigger: '.section-jobs',
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
    gsap.from('.job-card', {
      scrollTrigger: {
        trigger: '.section-jobs',
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
  }

  // Efecto wobble al hover (solo desktop)
  function addWobbleEffect() {
    if (window.innerWidth > 968) {
      const jobs = document.querySelectorAll('.job-card');
      jobs.forEach(job => {
        job.addEventListener('mouseenter', () => {
          gsap.to(job, {
            keyframes: [
              { rotate: -2.5, duration: 0.12 },
              { rotate: 1.8, duration: 0.12 },
              { rotate: -1, duration: 0.08 },
              { rotate: 0, duration: 0.08 }
            ],
            ease: 'power1.inOut'
          });
        });
      });
    }
  }

  setTimeout(addWobbleEffect, 500);
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
      const jobs = document.querySelectorAll('.job-card');
      jobs.forEach(job => {
        job.style.backdropFilter = 'none';
        job.style.transition = 'transform 0.2s ease';
      });
    }
  }
}

// ===== INICIALIZACIÓN PRINCIPAL =====
document.addEventListener('DOMContentLoaded', () => {
  console.log('Jobs: DOM cargado, iniciando configuración solo con dots');
  optimizeForDevice();
  setupSection5Animations();
  setupHorizontalJobsNavigation();
  
  // Pausar animaciones cuando la pestaña no está visible
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });
});