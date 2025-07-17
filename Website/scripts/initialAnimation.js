// ===== ANIMACIÓN INICIAL Y HEADER RESPONSIVO CORREGIDO =====

// Funciones originales de animación
const n = 19;
const rots = [
  { ry: 290, a: 0.5 },
  { ry: 0, a: 0.85 },
  { ry: 90, a: 0.4 },
  { ry: 180, a: 0.0 }
];

// Registrar el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Set up the cube faces rotation
gsap.set(".face", {
  z: 200,
  rotateY: i => rots[i].ry,
  transformOrigin: "50% 50% -510px"
});

// Clone and animate each die
for (let i = 0; i < n; i++) {
  let die = document.querySelector('.die');
  let cube = die.querySelector('.cube');

  if (i > 0) {
    let clone = die.cloneNode(true);
    document.querySelector('.tray').append(clone);
    cube = clone.querySelector('.cube');
  }

  gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'power3.inOut', duration: 1 } })
    .fromTo(cube, {
      rotateY: -90
    }, {
      rotateY: 90,
      ease: 'power1.inOut',
      duration: 2
    })
    .fromTo(cube.querySelectorAll('.face'), {
      color: (j) => 'hsl(' + (i / n * 75 + 270) + ', 67%,' + (100 * [rots[3].a, rots[0].a, rots[1].a][j]) + '%)'
    }, {
      color: (j) => 'hsl(' + (i / n * 75 + 270) + ', 67%,' + (100 * [rots[0].a, rots[1].a, rots[2].a][j]) + '%)'
    }, 0)
    .to(cube.querySelectorAll('.face'), {
      color: (j) => 'hsl(' + (i / n * 75 + 270) + ', 67%,' + (100 * [rots[1].a, rots[2].a, rots[3].a][j]) + '%)'
    }, 1)
    .progress(i / n);
}

// Global tray animation
const trayAnimation = gsap.timeline()
  .from('.tray', { yPercent: -3, duration: 2, ease: 'power1.inOut', yoyo: true, repeat: -1 }, 0)
  .fromTo('.tray', { rotate: -15 }, { rotate: 15, duration: 4, ease: 'power1.inOut', yoyo: true, repeat: -1 }, 0)
  .from('.die', { duration: 0.01, opacity: 0, stagger: { each: -0.05, ease: 'power1.in' } }, 0)
  .to('.tray', { scale: 1.2, duration: 2, ease: 'power3.inOut', yoyo: true, repeat: -1 }, 0);

// Responsive scaling for the original animation
function updateScale() {
  const h = n * 56;
  gsap.set('.tray', { height: h });
  gsap.set('.pov', { scale: innerHeight / h });
}

// Scroll animation - MEJORADO para transición suave
function setupScrollAnimations() {
  // Animación simple de fade out en la hero section
  gsap.to(".section-hero", {
    scrollTrigger: {
      trigger: ".section-hero",
      start: "top top",
      end: "bottom top",
      scrub: 1
    },
    opacity: 0,
    scale: 1.2,
    ease: "none"
  });

  // Zoom en la animación
  gsap.to(".pov", {
    scrollTrigger: {
      trigger: ".section-hero",
      start: "top top",
      end: "bottom top",
      scrub: 1
    },
    scale: 3,
    ease: "none"
  });

  // Ocultar scroll hint
  gsap.to(".scroll-hint", {
    scrollTrigger: {
      trigger: ".section-hero",
      start: "top top",
      end: "50% top",
      scrub: 1
    },
    opacity: 0,
    ease: "none"
  });
}

// ===== HEADER RESPONSIVO MEJORADO Y CORREGIDO =====
function setupHeaderFunctionality() {
  console.log('Header: Configurando funcionalidad del header');
  
  // Mostrar el header al hacer scroll
  gsap.to(".site-header", {
    scrollTrigger: {
      trigger: ".section-about",
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
    onComplete: () => {
      const header = document.querySelector('.site-header');
      if (header) header.classList.add('visible');
    },
    onReverseComplete: () => {
      const header = document.querySelector('.site-header');
      if (header) header.classList.remove('visible');
    }
  });

  // ===== FUNCIONALIDAD DEL MENÚ MÓVIL CORREGIDA =====
  setupMobileMenu();
  
  // ===== NAVEGACIÓN SUAVE ENTRE SECCIONES =====
  setupSmoothNavigation();
}

// ===== CONFIGURACIÓN DEL MENÚ MÓVIL =====
function setupMobileMenu() {
  console.log('Header: Configurando menú móvil');
  
  // Buscar elementos con diferentes posibles IDs/clases
  const mobileToggle = document.querySelector('.mobile-nav-toggle') || 
                      document.querySelector('#mobile-toggle') ||
                      document.querySelector('[data-toggle="mobile-menu"]');
                      
  const mobileMenu = document.querySelector('.mobile-nav-menu') || 
                    document.querySelector('#mobile-nav-menu') ||
                    document.querySelector('#header-nav');

  console.log('Toggle encontrado:', !!mobileToggle);
  console.log('Menu encontrado:', !!mobileMenu);
  
  if (!mobileToggle) {
    console.warn('Header: Botón de toggle móvil no encontrado');
    return;
  }
  
  if (!mobileMenu) {
    console.warn('Header: Menú móvil no encontrado');
    return;
  }

  // Asegurar que el menú tenga la clase correcta
  mobileMenu.classList.add('mobile-nav-menu');
  
  // Encontrar o crear el ícono
  let toggleIcon = mobileToggle.querySelector('i');
  if (!toggleIcon) {
    toggleIcon = document.createElement('i');
    toggleIcon.className = 'fas fa-bars';
    mobileToggle.appendChild(toggleIcon);
  }

  // Variable para controlar el estado del menú
  let menuOpen = false;

  // Función para abrir el menú
  function openMenu() {
    console.log('Header: Abriendo menú móvil');
    mobileMenu.classList.add('active');
    mobileMenu.style.display = 'block';
    toggleIcon.className = 'fas fa-times';
    menuOpen = true;
    
    // Animación de apertura
    gsap.fromTo(mobileMenu, 
      { 
        opacity: 0, 
        y: -20 
      },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.3, 
        ease: 'power2.out' 
      }
    );
  }

  // Función para cerrar el menú
  function closeMenu() {
    console.log('Header: Cerrando menú móvil');
    
    // Animación de cierre
    gsap.to(mobileMenu, {
      opacity: 0,
      y: -20,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        mobileMenu.classList.remove('active');
        mobileMenu.style.display = 'none';
      }
    });
    
    toggleIcon.className = 'fas fa-bars';
    menuOpen = false;
  }

  // Event listener para el botón toggle
  mobileToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Header: Click en toggle, menú abierto:', menuOpen);
    
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Cerrar menú al hacer clic en un enlace de navegación
  const navLinks = mobileMenu.querySelectorAll('a, .nav-button');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      console.log('Header: Click en enlace de navegación');
      setTimeout(closeMenu, 100); // Pequeño delay para que se vea el click
    });
  });

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener('click', (e) => {
    if (menuOpen && 
        !mobileToggle.contains(e.target) && 
        !mobileMenu.contains(e.target)) {
      console.log('Header: Click fuera del menú');
      closeMenu();
    }
  });

  // Cerrar menú al redimensionar la ventana (si se hace más grande)
  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    console.log('Header: Resize detectado, ancho:', width);
    
    // Si la pantalla se hace más grande que el breakpoint móvil, cerrar menú
    if (width > 670 && menuOpen) {
      closeMenu();
    }
  });

  // Cerrar menú con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) {
      console.log('Header: Escape presionado');
      closeMenu();
    }
  });

  console.log('Header: Menú móvil configurado correctamente');
}

// ===== NAVEGACIÓN SUAVE ENTRE SECCIONES =====
function setupSmoothNavigation() {
  console.log('Header: Configurando navegación suave');
  
  // Obtener todos los enlaces de navegación
  const navLinks = document.querySelectorAll('.nav-button, .header-nav a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Solo manejar enlaces que apunten a secciones (#)
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId) || 
                            document.querySelector(`.section-${targetId}`) ||
                            document.querySelector(`[data-section="${targetId}"]`);
        
        if (targetSection) {
          console.log('Header: Navegando a sección:', targetId);
          
          // Scroll suave a la sección
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Actualizar botón activo
          updateActiveNavButton(link);
        } else {
          console.warn('Header: Sección no encontrada:', targetId);
        }
      }
    });
  });
}

// ===== ACTUALIZAR BOTÓN ACTIVO =====
function updateActiveNavButton(activeLink) {
  // Remover clase active de todos los botones
  document.querySelectorAll('.nav-button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Agregar clase active al botón clickeado
  if (activeLink.classList.contains('nav-button')) {
    activeLink.classList.add('active');
  }
}

// ===== DETECCIÓN DE SECCIÓN ACTUAL AL HACER SCROLL =====
function setupScrollDetection() {
  const sections = document.querySelectorAll('.section, [class*="section-"]');
  const navButtons = document.querySelectorAll('.nav-button');
  
  if (sections.length === 0 || navButtons.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        const sectionId = entry.target.id || 
                         entry.target.className.match(/section-(\w+)/)?.[1];
        
        if (sectionId) {
          // Actualizar botón activo basado en la sección visible
          navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('href') === `#${sectionId}`) {
              btn.classList.add('active');
            }
          });
        }
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '-20% 0px -20% 0px'
  });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

// ===== INICIALIZACIÓN PRINCIPAL =====
function initializeHeader() {
  console.log('Header: Inicializando header');
  
  // Configurar funcionalidad del header
  setupHeaderFunctionality();
  
  // Configurar detección de scroll
  setupScrollDetection();
  
  console.log('Header: Inicialización completada');
}

// ===== PUNTO DE ENTRADA =====
// Inicializar animación inicial cuando la página esté cargada
window.addEventListener('load', () => {
  console.log('Página cargada, iniciando animaciones');
  updateScale();
  setupScrollAnimations();
  
  // Delay pequeño para asegurar que el DOM esté completamente listo
  setTimeout(initializeHeader, 100);
});

// Actualizar escala cuando se redimensione la ventana
window.addEventListener('resize', updateScale);

// Inicializar también en DOMContentLoaded como respaldo
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado, inicializando header como respaldo');
  setTimeout(initializeHeader, 200);
});