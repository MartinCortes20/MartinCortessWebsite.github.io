// ===== SECCIÓN INTRO RESPONSIVE (ABOUT ME) CON BURBUJAS ORGANIZADAS =====

// Tecnologías con sus iconos y colores
const technologies = [
  { name: 'Swift', icon: 'fab fa-swift', tech: 'swift', tooltip: 'Swift' },
  { name: 'Flutter', icon: 'fas fa-mobile-alt', tech: 'flutter', tooltip: 'Flutter & Dart' },
  { name: 'JavaScript', icon: 'fab fa-js-square', tech: 'javascript', tooltip: 'JavaScript' },
  { name: 'Python', icon: 'fab fa-python', tech: 'python', tooltip: 'Python' },
  { name: 'Java', icon: 'fab fa-java', tech: 'java', tooltip: 'Java' },
  { name: 'HTML', icon: 'fab fa-html5', tech: 'html', tooltip: 'HTML5' },
  { name: 'CSS', icon: 'fab fa-css3-alt', tech: 'css', tooltip: 'CSS3' },
  { name: 'Figma', icon: 'fab fa-figma', tech: 'figma', tooltip: 'UX/UI Design' },
  { name: 'Postman', icon: 'fas fa-paper-plane', tech: 'postman', tooltip: 'Postman API' },
  { name: 'React', icon: 'fab fa-react', tech: 'react', tooltip: 'React.js' },
  { name: 'Express', icon: 'fas fa-server', tech: 'express', tooltip: 'Express.js' },
  { name: 'Node.js', icon: 'fab fa-node-js', tech: 'nodejs', tooltip: 'Node.js' }
];

// Array de imágenes para mostrar verticalmente
const imageGallery = [
  { src: './images/CamelloCabos.jpeg', alt: 'Martin Cortes - Photo 1' },
  { src: './images/CamelloCabos.jpeg', alt: 'Martin Cortes - Photo 2' },
  { src: './images/CamelloCabos.jpeg', alt: 'Martin Cortes - Photo 3' }
];

// Detectar tipo de dispositivo
function getDeviceType() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  if (width <= 320) return 'mobile-xs';
  if (width <= 480) return 'mobile-sm';
  if (width <= 640) return 'mobile-md';
  if (width <= 768) return 'mobile-lg';
  if (width <= 968) return 'tablet-sm';
  if (width <= 1024) return 'tablet-md';
  if (width <= 1200) return 'tablet-lg';
  return 'desktop';
}

// Obtener configuración responsive mejorada para burbujas
function getResponsiveConfig() {
  const deviceType = getDeviceType();
  const configs = {
    'mobile-xs': { cols: 3, rows: 4, spacing: 20 },
    'mobile-sm': { cols: 3, rows: 4, spacing: 25 },
    'mobile-md': { cols: 3, rows: 4, spacing: 30 },
    'mobile-lg': { cols: 4, rows: 3, spacing: 35 },
    'tablet-sm': { cols: 4, rows: 3, spacing: 40 },
    'tablet-md': { cols: 4, rows: 3, spacing: 45 },
    'tablet-lg': { cols: 4, rows: 3, spacing: 50 },
    'desktop': { cols: 4, rows: 3, spacing: 55 }
  };
  
  return configs[deviceType] || configs.desktop;
}

// Obtener tamaño de burbuja basado en dispositivo
function getBubbleSize() {
  const deviceType = getDeviceType();
  
  // En móviles pequeños, usar más burbujas medianas para consistencia
  if (['mobile-xs', 'mobile-sm'].includes(deviceType)) {
    const sizes = ['medium', 'medium', 'large'];
    const weights = [0.7, 0.2, 0.1];
    const random = Math.random();
    let weightSum = 0;
    
    for (let i = 0; i < weights.length; i++) {
      weightSum += weights[i];
      if (random <= weightSum) {
        return sizes[i];
      }
    }
    return 'medium';
  }
  
  // Para tablets y desktop, distribución normal
  const sizes = ['medium', 'medium', 'large'];
  const weights = [0.6, 0.3, 0.1];
  const random = Math.random();
  let weightSum = 0;
  
  for (let i = 0; i < weights.length; i++) {
    weightSum += weights[i];
    if (random <= weightSum) {
      return sizes[i];
    }
  }
  return 'medium';
}

// Layout tipo teclado numérico para las burbujas
function positionBubblesInNumpadLayout(container, bubbles) {
  const containerRect = container.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;
  
  // Layout tipo teclado numérico: 3 columnas x 4 filas
  // Distribución: [1,2,3], [4,5,6], [7,8,9], [*,0,#] 
  const positions = [
    // Fila 1: [1,2,3]
    { col: 0, row: 0 }, // Swift
    { col: 1, row: 0 }, // Flutter  
    { col: 2, row: 0 }, // JavaScript
    
    // Fila 2: [4,5,6]
    { col: 0, row: 1 }, // Python
    { col: 1, row: 1 }, // Java
    { col: 2, row: 1 }, // HTML
    
    // Fila 3: [7,8,9]
    { col: 0, row: 2 }, // CSS
    { col: 1, row: 2 }, // Figma
    { col: 2, row: 2 }, // Postman
    
    // Fila 4: [*,0,#]
    { col: 0, row: 3 }, // React
    { col: 1, row: 3 }, // Express
    { col: 2, row: 3 }  // Node.js
  ];
  
  // Calcular espaciado basado en el tamaño del contenedor
  const cols = 3;
  const rows = 4;
  const padding = 40;
  
  const cellWidth = (containerWidth - padding * 2) / cols;
  const cellHeight = (containerHeight - 100) / rows; // -100 para título y padding
  
  bubbles.forEach((bubble, index) => {
    if (index >= positions.length) return;
    
    const pos = positions[index];
    
    // Calcular posición base
    const baseX = pos.col * cellWidth + cellWidth / 2 + padding;
    const baseY = pos.row * cellHeight + cellHeight / 2 + 80; // +80 para título
    
    // Posicionar la burbuja
    bubble.style.left = (baseX - 40) + 'px'; // -40 para centrar (tamaño promedio burbuja)
    bubble.style.top = (baseY - 40) + 'px';
    
    // Agregar animación de flotación individual
    addFloatingAnimation(bubble, index);
  });
}

// Agregar animación de flotación a cada burbuja
function addFloatingAnimation(bubble, index) {
  // Cada burbuja tiene un patrón de flotación único
  const duration = 3 + (index % 3); // 3-5 segundos
  const delay = index * 0.2; // Desfase entre burbujas
  const amplitude = 8 + (index % 5); // Amplitud de movimiento 8-12px
  
  // Flotación vertical
  gsap.to(bubble, {
    y: `+=${amplitude}`,
    duration: duration,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: delay
  });
  
  // Flotación horizontal más sutil
  gsap.to(bubble, {
    x: `+=${amplitude * 0.6}`,
    duration: duration * 1.3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: delay + 0.5
  });
  
  // Rotación muy sutil
  gsap.to(bubble, {
    rotation: `+=${3 + (index % 3)}`,
    duration: duration * 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: delay + 1
  });
}

// Crear burbujas organizadas en layout teclado numérico
function createOrganizedBubbles() {
  const container = document.getElementById('techBubblesZone');
  if (!container) {
    console.warn('Container techBubblesZone not found');
    return;
  }
  
  // Limpiar contenedor
  const existingBubbles = container.querySelectorAll('.bubble');
  existingBubbles.forEach(bubble => bubble.remove());
  
  const createdBubbles = [];
  
  // Crear todas las burbujas primero
  technologies.forEach((tech, index) => {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${getBubbleSize()}`;
    bubble.setAttribute('data-tech', tech.tech);
    bubble.setAttribute('data-tooltip', tech.tooltip);
    bubble.innerHTML = `<i class="${tech.icon}"></i>`;
    
    container.appendChild(bubble);
    createdBubbles.push(bubble);
  });
  
  // Posicionar todas las burbujas en layout teclado numérico
  positionBubblesInNumpadLayout(container, createdBubbles);
  
  // Aplicar animaciones y funcionalidad
  createdBubbles.forEach((bubble, index) => {
    // Animación de aparición escalonada
    gsap.fromTo(bubble, {
      scale: 0,
      opacity: 0,
      y: 50
    }, {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.section-about',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    // Hacer las burbujas arrastrables solo en dispositivos con puntero preciso
    if (typeof Draggable !== 'undefined' && !isTouchDevice()) {
      Draggable.create(bubble, {
        type: "x,y",
        bounds: container,
        onDragStart: function() {
          bubble.classList.add('dragging');
          // Pausar animaciones de flotación mientras se arrastra
          gsap.killTweensOf(bubble);
        },
        onDragEnd: function() {
          bubble.classList.remove('dragging');
          // Reiniciar animaciones de flotación
          setTimeout(() => {
            addFloatingAnimation(bubble, index);
          }, 100);
        }
      });
    }
  });
}

// Detectar dispositivos touch
function isTouchDevice() {
  return (('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0) ||
          (navigator.msMaxTouchPoints > 0));
}

// Crear imágenes apiladas verticalmente responsive
function createVerticalImageStack() {
  const imageContainer = document.querySelector('.about-image');
  if (!imageContainer) return;

  // Limpiar contenido existente
  imageContainer.innerHTML = '';

  // Crear contenedor de imágenes apiladas
  const imageStack = document.createElement('div');
  imageStack.className = 'image-stack';

  // Crear imágenes
  imageGallery.forEach((imageData, index) => {
    const img = document.createElement('img');
    img.src = imageData.src;
    img.alt = imageData.alt;
    img.className = 'stack-image';
    img.loading = 'lazy'; // Lazy loading para mejor performance
    imageStack.appendChild(img);
  });

  imageContainer.appendChild(imageStack);

  // Animar aparición de imágenes una por una
  animateImagesAppearance();
}

// Animar aparición de imágenes con efecto responsive
function animateImagesAppearance() {
  const images = document.querySelectorAll('.stack-image');
  let currentIndex = 0;
  let isVisible = true;
  
  // Ajustar tiempos según el dispositivo
  const deviceType = getDeviceType();
  const isMobile = ['mobile-xs', 'mobile-sm', 'mobile-md'].includes(deviceType);
  
  const timings = {
    showDelay: isMobile ? 400 : 500,
    hideDelay: isMobile ? 300 : 400,
    displayTime: isMobile ? 1500 : 2000,
    restartDelay: isMobile ? 800 : 1000
  };

  function toggleImageVisibility() {
    if (isVisible) {
      // Mostrar imagen actual
      if (currentIndex < images.length) {
        images[currentIndex].classList.add('visible');
        currentIndex++;
        
        if (currentIndex >= images.length) {
          setTimeout(() => {
            isVisible = false;
            currentIndex = 0;
            toggleImageVisibility();
          }, timings.displayTime);
        }
      }
    } else {
      // Ocultar imagen actual
      if (currentIndex < images.length) {
        images[currentIndex].classList.remove('visible');
        images[currentIndex].classList.add('fade-out');
        currentIndex++;
        
        if (currentIndex >= images.length) {
          setTimeout(() => {
            // Limpiar clases y reiniciar
            images.forEach(img => {
              img.classList.remove('visible', 'fade-out');
            });
            isVisible = true;
            currentIndex = 0;
            toggleImageVisibility();
          }, timings.restartDelay);
        } else {
          setTimeout(toggleImageVisibility, timings.hideDelay);
        }
      }
    }
  }

  // Iniciar la animación cuando la sección sea visible
  gsap.delayedCall(1, toggleImageVisibility);
}

// Animaciones de texto responsive
function setupTextAnimations() {
  // Animación del título
  const aboutTitle = document.querySelector('.section-about h2');
  if (!aboutTitle) return;
  
  const titleText = aboutTitle.textContent;
  aboutTitle.innerHTML = '';
  
  // Crear span para cada letra del título
  titleText.split('').forEach((letter) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = letter === ' ' ? '\u00A0' : letter;
    aboutTitle.appendChild(span);
  });

  // Animación de letras del título - ajustada para móviles
  const deviceType = getDeviceType();
  const isMobile = ['mobile-xs', 'mobile-sm', 'mobile-md'].includes(deviceType);
  
  gsap.from('.section-about .char', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: isMobile ? 20 : 40,
    rotateX: isMobile ? -45 : -90,
    stagger: isMobile ? 0.03 : 0.05,
    duration: isMobile ? 0.6 : 0.8,
    ease: 'back.out'
  });

  // Animación del subtítulo
  gsap.from('.subtitle', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: isMobile ? 15 : 20,
    duration: isMobile ? 0.6 : 0.8,
    delay: 0.3,
    ease: 'power2.out'
  });

  // Animación del texto
  gsap.from('.about-text p:not(.subtitle)', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: isMobile ? 20 : 30,
    duration: isMobile ? 0.6 : 0.8,
    stagger: isMobile ? 0.15 : 0.2,
    delay: 0.5,
    ease: 'power2.out'
  });

  // Animación de la imagen
  gsap.from('.about-image', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: isMobile ? 30 : 50,
    duration: isMobile ? 0.8 : 1,
    ease: 'power2.out',
    delay: 0.7
  });

  // Animación de la zona de burbujas
  gsap.from('.tech-bubbles-zone', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: isMobile ? -30 : -50,
    duration: isMobile ? 0.8 : 1,
    ease: 'power2.out',
    delay: 0.9
  });

  // Animación de las habilidades
  gsap.from('.skill-tag', {
    scrollTrigger: {
      trigger: '.skills-highlight',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: isMobile ? 15 : 20,
    duration: isMobile ? 0.5 : 0.6,
    stagger: isMobile ? 0.08 : 0.1,
    delay: 0.8,
    ease: 'power2.out'
  });

  // Efecto de texto shuffling para palabras cambiantes
  const textShuffleElement = document.querySelector('.text-shuffle');
  if (textShuffleElement) {
    const words = ["passionate", "creative", "innovative", "dedicated", "self-taught", "focused", "curious", "driven"];

    const textShuffle = gsap.timeline({
      repeat: -1,
      repeatDelay: isMobile ? 1.2 : 1.5,
      scrollTrigger: {
        trigger: '.section-about',
        start: 'top 80%'
      }
    });

    words.forEach((word, index) => {
      textShuffle.to('.text-shuffle', {
        duration: isMobile ? 0.4 : 0.5,
        text: word,
        ease: "power2.out",
        delay: index > 0 ? (isMobile ? 1.5 : 2) : 0
      });
    });
  }
}

// Manejar redimensionamiento de ventana de forma optimizada
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    createOrganizedBubbles();
  }, 300); // Debounce de 300ms
}

// Optimizar performance en dispositivos móviles
function optimizeForMobile() {
  const deviceType = getDeviceType();
  const isMobile = ['mobile-xs', 'mobile-sm', 'mobile-md'].includes(deviceType);
  
  if (isMobile) {
    // Reducir calidad de animaciones en móviles para mejor performance
    gsap.config({
      force3D: false,
      nullTargetWarn: false
    });
    
    // Deshabilitar algunas animaciones complejas en móviles muy pequeños
    if (deviceType === 'mobile-xs') {
      const bubbles = document.querySelectorAll('.bubble');
      bubbles.forEach(bubble => {
        bubble.style.transition = 'transform 0.15s ease-out';
      });
    }
  }
}

// Función principal para configurar todas las animaciones
function setupSection2Animations() {
  optimizeForMobile();
  setupTextAnimations();
  createOrganizedBubbles();
  createVerticalImageStack();
}

// Event listeners optimizados
document.addEventListener('DOMContentLoaded', function() {
  setupSection2Animations();
  
  // Manejar redimensionamiento con debounce
  window.addEventListener('resize', handleResize);
  
  // Manejar cambio de orientación en móviles
  window.addEventListener('orientationchange', function() {
    setTimeout(() => {
      createOrganizedBubbles();
    }, 500); // Esperar a que complete el cambio de orientación
  });
  
  // Optimizar para dispositivos con memoria limitada
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    // Reducir frecuencia de animaciones en dispositivos con poca memoria
    const images = document.querySelectorAll('.stack-image');
    images.forEach(img => {
      img.style.transition = 'all 0.5s ease-in-out';
    });
  }
});

// Cleanup al salir de la página para liberar memoria
window.addEventListener('beforeunload', function() {
  // Limpiar intervals y timeouts si existen
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  
  // Matar animaciones GSAP activas
  gsap.killTweensOf("*");
});