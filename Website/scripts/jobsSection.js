// ===== SECCIÓN TRABAJOS CON NAVEGACIÓN ADAPTATIVA =====

function setupHorizontalJobsNavigation() {
  let currentJobIndex = 0;
  let isScrolling = false;
  let sectionLocked = false;
  let isChangingSection = false;
  let autoSnapTimeout;
  let isMobileDevice = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  const jobs = document.querySelectorAll('.job-card');
  const jobsContainer = document.querySelector('.jobs-container');
  const jobsSection = document.querySelector('.section-jobs');
  
  if (!jobs.length || !jobsContainer || !jobsSection) {
    console.warn('Jobs: Elementos necesarios no encontrados');
    return;
  }
  
  // Detectar si es dispositivo móvil o tablet
  function detectMobileDevice() {
    const width = window.innerWidth;
    isMobileDevice = width <= 968;
    
    const hasTouch = ('ontouchstart' in window) || 
                     (navigator.maxTouchPoints > 0) || 
                     (navigator.msMaxTouchPoints > 0);
    
    return isMobileDevice && hasTouch;
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
    jobsContainer.style.transform = 'none';
    jobsContainer.style.transition = 'none';
    
    jobsContainer.style.overflowX = 'auto';
    jobsContainer.style.overflowY = 'hidden';
    jobsContainer.style.scrollBehavior = 'smooth';
    jobsContainer.style.scrollSnapType = 'x mandatory';
    
    jobs.forEach(card => {
      card.style.scrollSnapAlign = 'center';
    });
    
    let scrollTimeout;
    jobsContainer.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateCurrentJobFromScroll, 150);
    });
    
    setupTouchGestures();
  }
  
  // ===== GESTOS TOUCH PARA MÓVILES =====
  function setupTouchGestures() {
    jobsSection.addEventListener('touchstart', handleTouchStart, { passive: true });
    jobsSection.addEventListener('touchmove', handleTouchMove, { passive: false });
    jobsSection.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
  
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
  
  function handleTouchMove(e) {
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    
    const deltaX = Math.abs(touchCurrentX - touchStartX);
    const deltaY = Math.abs(touchCurrentY - touchStartY);
    
    // Si el gesto es más horizontal, permitir scroll del contenedor
    if (deltaX > deltaY) {
      return;
    }
    
    // Si el gesto es más vertical y estamos en el área de trabajos, manejarlo
    if (deltaY > deltaX && deltaY > 20) {
      const jobsRect = jobsContainer.getBoundingClientRect();
      const touchX = e.touches[0].clientX;
      
      if (touchX >= jobsRect.left && touchX <= jobsRect.right) {
        e.preventDefault();
      }
    }
  }
  
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    const minSwipeDistance = 50;
    
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
  
  // Actualizar trabajo actual basado en scroll
  function updateCurrentJobFromScroll() {
    if (!isMobileDevice) return;
    
    const containerRect = jobsContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    
    let closestIndex = 0;
    let closestDistance = Infinity;
    
    jobs.forEach((job, index) => {
      const jobRect = job.getBoundingClientRect();
      const jobCenter = jobRect.left + jobRect.width / 2;
      const distance = Math.abs(jobCenter - containerCenter);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== currentJobIndex) {
      currentJobIndex = closestIndex;
      updateJobIndicator();
    }
  }
  
  // ===== CONFIGURACIÓN PARA DESKTOP =====
  function setupDesktopNavigation() {
    jobsContainer.style.overflowX = 'hidden';
    jobsContainer.style.transition = 'transform 0.6s ease-in-out';
    
    const jobWidth = 350 + 40 + 40;
    
    function updateJobPosition() {
      const containerWidth = jobsSection.offsetWidth;
      const centerOffset = (containerWidth - 350) / 2;
      const offset = centerOffset - (currentJobIndex * jobWidth);
      jobsContainer.style.transform = `translateX(${offset}px)`;
    }
    
    return updateJobPosition;
  }
  
  // ===== NAVEGACIÓN ENTRE SECCIONES =====
  function goToNextSection() {
    console.log('Jobs: Navegando a la siguiente sección');
    const nextSection = jobsSection.nextElementSibling;
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
    console.log('Jobs: Navegando a la sección anterior');
    const prevSection = jobsSection.previousElementSibling;
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
    if (!isMobileDevice && isInJobsSection() && !sectionLocked) {
      jobsSection.scrollIntoView({ 
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
    
    observer.observe(jobsSection);
    return observer;
  }
  
  function isInJobsSection() {
    const rect = jobsSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibilityRatio = visibleHeight / windowHeight;
    return visibilityRatio > 0.4;
  }
  
  // ===== NAVEGACIÓN CON WHEEL (SOLO DESKTOP) =====
  function handleWheelScroll(e) {
    if (isMobileDevice || isChangingSection) {
      return;
    }
    
    if (!isInJobsSection()) return;
    
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
    }, 700);
  }
  
  function handleScrollDown() {
    if (currentJobIndex < jobs.length - 1) {
      currentJobIndex++;
      if (!isMobileDevice && typeof updateJobPosition === 'function') {
        updateJobPosition();
      }
      updateJobIndicator();
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
    if (currentJobIndex > 0) {
      currentJobIndex--;
      if (!isMobileDevice && typeof updateJobPosition === 'function') {
        updateJobPosition();
      }
      updateJobIndicator();
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
  function createJobIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'jobs-indicator';
    
    const dotsHtml = Array.from(jobs).map((_, index) => 
      `<span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`
    ).join('');
    
    const directionText = isMobileDevice ? 'Swipe to explore experience' : 'Scroll to navigate';
    const hintText = isMobileDevice ? '⇅ Swipe up/down for sections' : '↑ Projects | Contact ↓';
    
    indicator.innerHTML = `
      <div class="indicator-dots">
        ${dotsHtml}
      </div>
      <div class="indicator-direction">
        <span class="direction-arrow">⟷</span>
        <span class="direction-text">${directionText}</span>
      </div>
      <div class="navigation-hint">
        <span class="hint-text">${hintText}</span>
      </div>
    `;
    
    jobsSection.appendChild(indicator);
    
    // Eventos para los dots
    const dots = indicator.querySelectorAll('.dot');
    dots.forEach(dot => {
      dot.addEventListener('click', handleDotClick);
    });
  }
  
  function handleDotClick(e) {
    const index = parseInt(e.target.dataset.index);
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
      }
    } else {
      // En desktop, usar la función de posicionamiento
      if (typeof updateJobPosition === 'function') {
        updateJobPosition();
      }
    }
    
    updateJobIndicator();
    
    // Extender bloqueo
    if (!isMobileDevice) {
      sectionLocked = true;
      clearTimeout(autoSnapTimeout);
      autoSnapTimeout = setTimeout(() => {
        sectionLocked = false;
      }, 5000);
    }
  }
  
  function updateJobIndicator() {
    const dots = document.querySelectorAll('.jobs-indicator .dot');
    const hintText = document.querySelector('.jobs-indicator .hint-text');
    
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentJobIndex);
    });
    
    // Actualizar hint según dispositivo y posición
    if (hintText) {
      if (isMobileDevice) {
        if (currentJobIndex === 0) {
          hintText.textContent = '⇅ Swipe up: Projects | Continue →';
          hintText.style.color = '#ff6b35';
        } else if (currentJobIndex === jobs.length - 1) {
          hintText.textContent = '← Continue | Swipe down: Contact ⇅';
          hintText.style.color = '#ff6b35';
        } else {
          hintText.textContent = '⇅ Swipe up/down for sections';
          hintText.style.color = 'rgba(128, 0, 255, 0.7)';
        }
      } else {
        // Desktop hints
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
  }
  
  // ===== NAVEGACIÓN CON TECLADO (SOLO DESKTOP) =====
  function handleKeyNavigation(e) {
    if (isMobileDevice || !isInJobsSection()) return;
    
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
      const updateJobPosition = setupJobsDisplay();
      updateIndicatorForDevice();
      
      // Guardar la función de actualización para desktop
      if (!isMobileDevice && typeof updateJobPosition === 'function') {
        window.updateJobPosition = updateJobPosition;
      }
    }
    
    if (!isMobileDevice && typeof window.updateJobPosition === 'function') {
      window.updateJobPosition();
      if (isInJobsSection() && sectionLocked) {
        setTimeout(autoSnapToSection, 100);
      }
    }
  }
  
  function updateIndicatorForDevice() {
    const indicator = document.querySelector('.jobs-indicator');
    if (indicator) {
      indicator.remove();
      createJobIndicator();
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
    if (jobsSection) {
      jobsSection.removeEventListener('touchstart', handleTouchStart);
      jobsSection.removeEventListener('touchmove', handleTouchMove);
      jobsSection.removeEventListener('touchend', handleTouchEnd);
    }
    
    if (jobsContainer) {
      jobsContainer.removeEventListener('scroll', updateCurrentJobFromScroll);
    }
    
    // Limpiar variable global
    if (window.updateJobPosition) {
      delete window.updateJobPosition;
    }
  }
  
  // ===== FUNCIÓN DE INICIALIZACIÓN =====
  function init() {
    console.log('Jobs: Iniciando navegación horizontal');
    
    // Detectar dispositivo y configurar
    detectMobileDevice();
    const updateJobPosition = setupJobsDisplay();
    createJobIndicator();
    
    // Guardar función para desktop
    if (!isMobileDevice && typeof updateJobPosition === 'function') {
      window.updateJobPosition = updateJobPosition;
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
      if (!isMobileDevice && isInJobsSection()) {
        autoSnapToSection();
      }
    }, 500);
    
    console.log('Jobs: Navegación inicializada correctamente');
    return { cleanup, observer };
  }
  
  // Inicializar después de que GSAP esté listo
  setTimeout(init, 1200);
}

// ===== ANIMACIONES GSAP ACTUALIZADAS =====
function setupSection5Animations() {
  // Detectar si es móvil para ajustar animaciones
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
    // Configurar para mejor rendimiento en móviles
    gsap.config({
      force3D: false,
      nullTargetWarn: false
    });
    
    // Reducir complejidad visual en dispositivos lentos
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
  console.log('Jobs: DOM cargado, iniciando configuración');
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