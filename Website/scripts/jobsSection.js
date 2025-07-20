// ===== SECCIÓN TRABAJOS - NAVEGACIÓN CON DOTS CORREGIDA =====

function setupHorizontalJobsNavigation() {
  let currentJobIndex = 0;
  let isMobileDevice = false;
  let updateJobPosition = null;
  
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
      return null;
    } else {
      return setupDesktopNavigation();
    }
  }
  
  // ===== CONFIGURACIÓN PARA MÓVILES =====
  function setupMobileScrolling() {
    console.log('Jobs: Configurando scroll móvil');
    
    // Resetear transformaciones de desktop
    jobsContainer.style.transform = 'none';
    jobsContainer.style.transition = 'none';
    
    // Configurar scroll horizontal
    jobsContainer.style.overflowX = 'auto';
    jobsContainer.style.overflowY = 'hidden';
    jobsContainer.style.scrollBehavior = 'smooth';
    jobsContainer.style.scrollSnapType = 'x mandatory';
    jobsContainer.style.overscrollBehaviorX = 'contain';
    jobsContainer.style.webkitOverflowScrolling = 'touch';
    
    // Asegurar que el container ocupe todo el ancho disponible
    jobsContainer.style.width = '100%';
    jobsContainer.style.maxWidth = 'none';
    jobsContainer.style.justifyContent = 'flex-start';
    
    // Configurar scroll snap para cada tarjeta
    jobs.forEach(card => {
      card.style.scrollSnapAlign = 'center';
      card.style.flexShrink = '0';
    });
    
    // Scroll inicial al primer trabajo
    setTimeout(() => {
      if (jobs.length > 0) {
        jobsContainer.scrollLeft = 0;
        console.log('Jobs: Scroll inicial a la izquierda en móvil');
      }
    }, 100);
    
    // Listener para detectar scroll y actualizar dots
    setupMobileScrollListener();
  }
  
  // ===== LISTENER PARA SCROLL EN MÓVILES =====
  function setupMobileScrollListener() {
    let scrollTimeout;
    
    jobsContainer.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateCurrentIndexFromScroll();
      }, 150);
    });
  }
  
  // ===== ACTUALIZAR ÍNDICE BASADO EN SCROLL =====
  function updateCurrentIndexFromScroll() {
    if (!isMobileDevice) return;
    
    const containerRect = jobsContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    jobs.forEach((job, index) => {
      const jobRect = job.getBoundingClientRect();
      const jobCenter = jobRect.left + jobRect.width / 2;
      const distance = Math.abs(containerCenter - jobCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== currentJobIndex) {
      currentJobIndex = closestIndex;
      updateJobIndicator();
      console.log('Jobs: Índice actualizado por scroll:', currentJobIndex);
    }
  }
  
  // ===== CONFIGURACIÓN PARA DESKTOP =====
  function setupDesktopNavigation() {
    console.log('Jobs: Configurando navegación desktop');
    
    // Resetear estilos de móvil
    jobsContainer.style.overflowX = 'visible';
    jobsContainer.style.scrollBehavior = 'auto';
    jobsContainer.style.scrollSnapType = 'none';
    
    // Configurar para navegación con transform
    jobsContainer.style.transition = 'transform 0.6s ease-in-out';
    jobsContainer.style.display = 'flex';
    jobsContainer.style.justifyContent = 'flex-start';
    
    // Calcular ancho de cada trabajo (tarjeta + gap + márgenes)
    const jobWidth = 350 + 40 + 40; // width + gap + margins
    
    function updatePosition() {
      // Calcular offset para mostrar trabajo actual en el extremo izquierdo
      const containerWidth = jobsSection.offsetWidth;
      const leftMargin = 50; // Margen desde el borde izquierdo
      const offset = leftMargin - (currentJobIndex * jobWidth);
      
      jobsContainer.style.transform = `translateX(${offset}px)`;
      console.log(`Jobs: Desktop - Moviendo a trabajo ${currentJobIndex}, offset: ${offset}px`);
    }
    
    // Posición inicial (primer trabajo en extremo izquierdo)
    currentJobIndex = 0;
    updatePosition();
    
    return updatePosition;
  }
  
  // ===== INDICADOR VISUAL CON DOTS =====
  function createJobIndicator() {
    // Eliminar indicador existente
    const existingIndicator = document.querySelector('.jobs-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.className = 'jobs-indicator';
    
    const dotsHtml = Array.from(jobs).map((_, index) => 
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
    
    jobsSection.appendChild(indicator);
    
    // Eventos para los dots
    const dots = indicator.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => handleDotClick(index));
    });
    
    console.log('Jobs: Indicador creado con', dots.length, 'dots');
  }
  
  // ===== MANEJO DE CLICKS EN DOTS =====
  function handleDotClick(index) {
    console.log('Jobs: Click en dot', index);
    
    // Actualizar índice actual
    currentJobIndex = index;
    
    if (isMobileDevice) {
      // En móviles, scroll al trabajo correspondiente
      const targetJob = jobs[index];
      if (targetJob) {
        // Calcular posición de scroll para centrar la tarjeta
        const containerRect = jobsContainer.getBoundingClientRect();
        const jobRect = targetJob.getBoundingClientRect();
        
        const scrollLeft = jobsContainer.scrollLeft + 
                          (jobRect.left - containerRect.left) - 
                          (containerRect.width - jobRect.width) / 2;
        
        jobsContainer.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
        
        console.log('Jobs: Scrolling a trabajo', index, 'en móvil');
      }
    } else {
      // En desktop, usar transform
      if (updateJobPosition) {
        updateJobPosition();
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
    
    // Si cambió el tipo de dispositivo, reconfigurar completamente
    if (wasMobile !== isMobileDevice) {
      console.log('Jobs: Cambio de dispositivo detectado, reconfigurando...');
      
      // Resetear índice al primer trabajo
      currentJobIndex = 0;
      
      // Reconfigurar display
      const newUpdateFunction = setupJobsDisplay();
      if (newUpdateFunction) {
        updateJobPosition = newUpdateFunction;
      }
      
      // Recrear indicador
      createJobIndicator();
      
    } else if (!isMobileDevice && updateJobPosition) {
      // Solo actualizar posición si seguimos en desktop
      updateJobPosition();
    }
  }
  
  // ===== FUNCIONES DE LIMPIEZA =====
  function cleanup() {
    console.log('Jobs: Limpiando event listeners');
    window.removeEventListener('resize', handleResize);
    updateJobPosition = null;
  }
  
  // ===== FUNCIÓN DE INICIALIZACIÓN =====
  function init() {
    console.log('Jobs: Iniciando navegación con dots corregida');
    
    if (!jobs.length || !jobsContainer || !jobsSection) {
      console.warn('Jobs: Elementos necesarios no encontrados');
      return;
    }
    
    // Detectar dispositivo y configurar
    detectMobileDevice();
    updateJobPosition = setupJobsDisplay();
    
    // Crear indicador
    createJobIndicator();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('beforeunload', cleanup);
    
    console.log('Jobs: Navegación inicializada correctamente');
    console.log('Jobs: Dispositivo móvil:', isMobileDevice);
    console.log('Jobs: Total de trabajos:', jobs.length);
    console.log('Jobs: Trabajo inicial:', currentJobIndex);
    
    return { cleanup };
  }
  
  // Inicializar después de que todo esté listo
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
    // En desktop, solo la primera tarjeta inicialmente
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
    
    // Optimizar para dispositivos con poca memoria
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
  console.log('Jobs: DOM cargado, iniciando configuración corregida');
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