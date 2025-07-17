// ===== SECCIÓN CONTACTO ADAPTATIVA =====

function setupSection4Animations() {
  // Detectar si es dispositivo móvil
  const isMobile = window.innerWidth <= 968;
  const isVerySmall = window.innerWidth <= 480;
  
  console.log('Contact: Dispositivo móvil:', isMobile);
  
  // Crear partículas solo en desktop
  if (!isMobile) {
    createParticles();
  }

  // ===== ANIMACIONES PARA DESKTOP =====
  if (!isMobile) {
    setupDesktopAnimations();
  } else {
    // ===== CONTENIDO ESTÁTICO PARA MÓVILES =====
    setupMobileStaticContent();
  }

  // Efectos de hover solo para desktop
  if (!isMobile) {
    setupDesktopHoverEffects();
  } else {
    setupMobileInteractions();
  }
}

// ===== ANIMACIONES PARA DESKTOP =====
function setupDesktopAnimations() {
  console.log('Contact: Configurando animaciones para desktop');
  
  // Animación para el título con efecto de letras
  const title = document.querySelector('.section-contact h2');
  if (title) {
    const titleText = title.textContent;
    title.innerHTML = '';
    
    titleText.split('').forEach((letter) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = letter === ' ' ? '\u00A0' : letter;
      title.appendChild(span);
    });

    gsap.from('.section-contact h2 span', {
      scrollTrigger: {
        trigger: '.section-contact',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.05,
      duration: 0.8,
      ease: 'back.out'
    });
  }

  // Animación del párrafo
  gsap.from('.contact-container p', {
    scrollTrigger: {
      trigger: '.section-contact',
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.3,
    ease: 'power2.out'
  });

  // Animación de los íconos con efecto de caída suave
  const contactIcons = document.querySelectorAll('.contact-icon');
  
  contactIcons.forEach((icon, index) => {
    gsap.from(icon, {
      scrollTrigger: {
        trigger: '.section-contact',
        start: 'top 60%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: -100,
      rotation: Math.random() * 360,
      duration: 0.8,
      delay: 0.1 * index,
      ease: 'bounce.out'
    });
  });
}

// ===== CONTENIDO ESTÁTICO PARA MÓVILES =====
function setupMobileStaticContent() {
  console.log('Contact: Configurando contenido estático para móviles');
  
  // Asegurar que todo el contenido sea visible sin animaciones de scroll
  const title = document.querySelector('.section-contact h2');
  const paragraph = document.querySelector('.contact-container p');
  const contactIcons = document.querySelectorAll('.contact-icon');
  
  // Hacer visible todo el contenido inmediatamente
  if (title) {
    gsap.set(title, { opacity: 1, y: 0, rotateX: 0 });
    // Mantener texto original sin efectos de letras
    title.style.opacity = '1';
    title.style.transform = 'none';
  }
  
  if (paragraph) {
    gsap.set(paragraph, { opacity: 1, y: 0 });
    paragraph.style.opacity = '1';
    paragraph.style.transform = 'none';
  }
  
  // Hacer visibles todos los iconos sin animaciones de scroll
  contactIcons.forEach((icon, index) => {
    gsap.set(icon, { opacity: 1, y: 0, rotation: 0 });
    icon.style.opacity = '1';
    icon.style.transform = 'none';
    
    // Añadir una pequeña animación de entrada suave sin ScrollTrigger
    gsap.fromTo(icon, 
      { 
        opacity: 0, 
        scale: 0.8 
      },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.6, 
        delay: index * 0.1, 
        ease: 'back.out(1.3)'
      }
    );
  });
  
  // Animar entrada de elementos sin depender del scroll
  setTimeout(() => {
    if (title) {
      gsap.fromTo(title, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
    
    if (paragraph) {
      gsap.fromTo(paragraph,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
      );
    }
  }, 100);
}

// ===== EFECTOS HOVER PARA DESKTOP =====
function setupDesktopHoverEffects() {
  const contactIcons = document.querySelectorAll('.contact-icon');
  
  contactIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

// ===== INTERACCIONES PARA MÓVILES =====
function setupMobileInteractions() {
  const contactIcons = document.querySelectorAll('.contact-icon');
  
  contactIcons.forEach(icon => {
    // Efecto de toque para móviles
    icon.addEventListener('touchstart', () => {
      gsap.to(icon, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power2.out'
      });
    });
    
    icon.addEventListener('touchend', () => {
      gsap.to(icon, {
        scale: 1,
        duration: 0.2,
        ease: 'back.out(1.3)'
      });
    });
    
    // Feedback visual simplificado
    icon.addEventListener('click', () => {
      gsap.to(icon, {
        scale: 1.05,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    });
  });
}

// ===== CREAR PARTÍCULAS (SOLO DESKTOP) =====
function createParticles() {
  const particlesContainer = document.querySelector('.particles');
  if (!particlesContainer) {
    console.log('Contact: Contenedor de partículas no encontrado');
    return;
  }
  
  const particleCount = 20;
  console.log('Contact: Creando', particleCount, 'partículas');

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (8 + Math.random() * 4) + 's';
    particlesContainer.appendChild(particle);
  }
}

// ===== MANEJO DE REDIMENSIONAMIENTO =====
function handleResize() {
  const wasMobile = window.innerWidth <= 968;
  
  // Limpiar animaciones existentes
  gsap.killTweensOf("*");
  
  // Reconfigurar según el nuevo tamaño
  setTimeout(() => {
    setupSection4Animations();
  }, 100);
}

// ===== OPTIMIZACIÓN DE RENDIMIENTO =====
function optimizePerformance() {
  const isMobile = window.innerWidth <= 968;
  
  if (isMobile) {
    // Configuración optimizada para móviles
    gsap.config({
      force3D: false,
      nullTargetWarn: false
    });
    
    // Simplificar en dispositivos con poca memoria
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      const icons = document.querySelectorAll('.contact-icon-inner');
      icons.forEach(icon => {
        icon.style.backdropFilter = 'none';
        icon.style.transition = 'all 0.2s ease';
      });
      
      console.log('Contact: Optimizaciones aplicadas para dispositivo con poca memoria');
    }
  } else {
    // Configuración para desktop
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });
  }
}

// ===== LIMPIEZA =====
function cleanup() {
  // Limpiar todas las animaciones
  gsap.killTweensOf("*");
  
  // Limpiar ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.killAll();
  }
  
  // Remover event listeners
  window.removeEventListener('resize', handleResize);
  
  console.log('Contact: Limpieza completada');
}

// ===== INICIALIZACIÓN PRINCIPAL =====
function initContactSection() {
  console.log('Contact: Iniciando sección de contacto');
  
  // Optimizar rendimiento
  optimizePerformance();
  
  // Configurar animaciones
  setupSection4Animations();
  
  // Event listener para redimensionamiento
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
  });
  
  // Pausar animaciones cuando la pestaña no está visible
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });
  
  // Limpieza al salir
  window.addEventListener('beforeunload', cleanup);
  
  console.log('Contact: Inicialización completada');
}

// ===== PUNTO DE ENTRADA =====
document.addEventListener('DOMContentLoaded', () => {
  // Pequeño delay para asegurar que otros scripts estén listos
  setTimeout(initContactSection, 500);
});

// Mantener compatibilidad con llamada anterior
function setupSection4Animations() {
  // Esta función ahora es manejada por initContactSection
  // pero mantenemos el nombre para compatibilidad
}