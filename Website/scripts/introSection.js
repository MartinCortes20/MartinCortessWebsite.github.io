// ===== SECCIÓN INTRO RESPONSIVE (ABOUT ME) - 3 COLUMNAS CON FOTOS SIMULTÁNEAS =====

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

// Array de imágenes para mostrar simultáneamente
const imageGallery = [
  { src: './images/CamelloCabos.jpeg', alt: 'Martin Cortes - Photo 1' },
  { src: './images/escomFriends.jpg', alt: 'Martin Cortes - Photo 2' },
  { src: './images/motorBike.jpg', alt: 'Martin Cortes - Photo 3' }
];

// Detectar tipo de dispositivo
function getDeviceType() {
  const width = window.innerWidth;
  
  if (width <= 360) return 'mobile-xs';
  if (width <= 480) return 'mobile-sm';
  if (width <= 640) return 'mobile-md';
  if (width <= 768) return 'mobile-lg';
  if (width <= 968) return 'tablet-sm';
  if (width <= 1024) return 'tablet-md';
  if (width <= 1200) return 'tablet-lg';
  return 'desktop';
}

// Obtener tamaño de burbuja basado en dispositivo
function getBubbleSize() {
  const deviceType = getDeviceType();
  
  // En móviles, usar más burbujas medianas para mejor visibilidad
  if (['mobile-xs', 'mobile-sm', 'mobile-md'].includes(deviceType)) {
    const sizes = ['small', 'medium', 'medium', 'large'];
    const weights = [0.25, 0.5, 0.2, 0.05];
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
  
  // Para tablets y desktop, distribución balanceada
  const sizes = ['small', 'medium', 'large'];
  const weights = [0.3, 0.6, 0.1];
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

// Layout compacto en grid 3x4 para las burbujas (más pegado a la izquierda)
function positionBubblesInGrid(container, bubbles) {
  const containerRect = container.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;
  
  // Configuración del grid: 3 columnas x 4 filas
  const positions = [
    // Fila 1: [Swift, Flutter, JavaScript]
    { col: 0, row: 0 }, { col: 1, row: 0 }, { col: 2, row: 0 },
    // Fila 2: [Python, Java, HTML]
    { col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 },
    // Fila 3: [CSS, Figma, Postman]
    { col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 },
    // Fila 4: [React, Express, Node.js]
    { col: 0, row: 3 }, { col: 1, row: 3 }, { col: 2, row: 3 }
  ];
  
  // Calcular espaciado más compacto y pegado a la izquierda
  const cols = 3;
  const rows = 4;
  const padding = 10; // Reducido de 20 a 10
  const leftOffset = 5; // Offset adicional hacia la izquierda
  const topOffset = 35; // Espacio para el título
  const bottomPadding = 25; // Espacio adicional en la parte inferior
  
  const cellWidth = (containerWidth - padding * 2 - leftOffset) / cols;
  const cellHeight = (containerHeight - topOffset - padding - bottomPadding) / rows;
  
  bubbles.forEach((bubble, index) => {
    if (index >= positions.length) return;
    
    const pos = positions[index];
    
    // Calcular posición centrada en cada celda, más hacia la izquierda
    const baseX = pos.col * cellWidth + cellWidth / 2 + padding - leftOffset;
    const baseY = pos.row * cellHeight + cellHeight / 2 + topOffset;
    
    // Obtener el tamaño real de la burbuja para centrar correctamente
    const bubbleSize = parseInt(getComputedStyle(bubble).width) / 2 || 32;
    
    // Posicionar la burbuja
    bubble.style.left = (baseX - bubbleSize) + 'px';
    bubble.style.top = (baseY - bubbleSize) + 'px';
    
    // Agregar animación de flotación sutil
    addFloatingAnimation(bubble, index);
  });
}

// Animación de flotación sutil para las burbujas
function addFloatingAnimation(bubble, index) {
  const duration = 3.5 + (index % 3) * 0.5; // 3.5-5 segundos
  const delay = index * 0.12; // Desfase entre burbujas
  const amplitude = 3 + (index % 4); // Amplitud 3-6px
  
  // Flotación vertical muy suave
  gsap.to(bubble, {
    y: `+=${amplitude}`,
    duration: duration,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: delay
  });
  
  // Flotación horizontal mínima
  gsap.to(bubble, {
    x: `+=${amplitude * 0.3}`,
    duration: duration * 1.3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: delay + 0.4
  });
  
  // Micro rotación para dinamismo
  gsap.to(bubble, {
    rotation: `+=${2 + (index % 2)}`,
    duration: duration * 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: delay + 0.8
  });
}

// Crear burbujas organizadas en grid compacto
function createOptimizedBubbles() {
  const container = document.getElementById('techBubblesZone');
  if (!container) {
    console.warn('Container techBubblesZone not found');
    return;
  }
  
  // Limpiar contenedor
  const existingBubbles = container.querySelectorAll('.bubble');
  existingBubbles.forEach(bubble => bubble.remove());
  
  const createdBubbles = [];
  
  // Crear todas las burbujas
  technologies.forEach((tech, index) => {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${getBubbleSize()}`;
    bubble.setAttribute('data-tech', tech.tech);
    bubble.setAttribute('data-tooltip', tech.tooltip);
    bubble.innerHTML = `<i class="${tech.icon}"></i>`;
    
    container.appendChild(bubble);
    createdBubbles.push(bubble);
  });
  
  // Esperar a que el DOM se actualice antes de posicionar
  setTimeout(() => {
    positionBubblesInGrid(container, createdBubbles);
  }, 100);
  
  // Aplicar animaciones de entrada
  createdBubbles.forEach((bubble, index) => {
    // Animación de aparición escalonada
    gsap.fromTo(bubble, {
      scale: 0,
      opacity: 0,
      y: 40,
      rotation: 180
    }, {
      scale: 1,
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 0.6,
      delay: index * 0.08,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '.section-about',
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });
    
    // Hacer las burbujas arrastrables solo en desktop
    if (typeof Draggable !== 'undefined' && !isTouchDevice() && getDeviceType() === 'desktop') {
      Draggable.create(bubble, {
        type: "x,y",
        bounds: container,
        onDragStart: function() {
          bubble.classList.add('dragging');
          gsap.killTweensOf(bubble);
        },
        onDragEnd: function() {
          bubble.classList.remove('dragging');
          setTimeout(() => {
            addFloatingAnimation(bubble, index);
          }, 150);
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

// Crear imágenes simultáneas (todas visibles al mismo tiempo)
function createSimultaneousImages() {
  const imageContainer = document.querySelector('.about-image');
  if (!imageContainer) return;

  // Limpiar contenido existente
  imageContainer.innerHTML = '';

  // Crear contenedor de imágenes apiladas
  const imageStack = document.createElement('div');
  imageStack.className = 'image-stack';

  // Crear todas las imágenes simultáneamente
  imageGallery.forEach((imageData, index) => {
    const img = document.createElement('img');
    img.src = imageData.src;
    img.alt = imageData.alt;
    img.className = 'stack-image';
    img.loading = 'lazy';
    
    // Agregar data-index para animaciones
    img.setAttribute('data-index', index);
    
    imageStack.appendChild(img);
  });

  imageContainer.appendChild(imageStack);

  // Animar aparición de todas las imágenes
  animateSimultaneousImages();
}

// Animar aparición de todas las imágenes al mismo tiempo
function animateSimultaneousImages() {
  const images = document.querySelectorAll('.stack-image');
  
  // Ajustar tiempos según el dispositivo
  const deviceType = getDeviceType();
  const isMobile = ['mobile-xs', 'mobile-sm', 'mobile-md'].includes(deviceType);
  
  // Animación inicial de aparición escalonada pero rápida
  images.forEach((img, index) => {
    gsap.fromTo(img, {
      opacity: 0,
      y: 30,
      scale: 0.95,
      rotateX: -15
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      duration: isMobile ? 0.7 : 0.9,
      delay: index * (isMobile ? 0.1 : 0.15),
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-image',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    // Animación sutil de hover y flotación individual para desktop
    if (!isMobile) {
      // Flotación muy sutil para cada imagen
      gsap.to(img, {
        y: 2 + (index * 1.5),
        duration: 2.5 + (index * 0.3),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.4
      });
      
      // Micro rotación alternada
      gsap.to(img, {
        rotateZ: (index % 2 === 0 ? 0.5 : -0.5),
        duration: 4 + (index * 0.5),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.6
      });
    }
  });
}

// Animaciones de texto responsive mejoradas
function setupEnhancedTextAnimations() {
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

  // Animación de letras del título - más dramática
  const deviceType = getDeviceType();
  const isMobile = ['mobile-xs', 'mobile-sm', 'mobile-md'].includes(deviceType);
  
  gsap.from('.section-about .char', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: isMobile ? 30 : 50,
    rotateX: isMobile ? -45 : -90,
    stagger: isMobile ? 0.04 : 0.06,
    duration: isMobile ? 0.7 : 1,
    ease: 'back.out(1.5)'
  });

  // Animación del subtítulo con efecto de escritura
  gsap.from('.subtitle', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: isMobile ? -20 : -30,
    duration: isMobile ? 0.8 : 1,
    delay: 0.4,
    ease: 'power2.out'
  });

  // Animación de párrafos con efecto de revelado
  gsap.from('.about-text p:not(.subtitle)', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: isMobile ? 25 : 35,
    duration: isMobile ? 0.7 : 0.9,
    stagger: isMobile ? 0.2 : 0.25,
    delay: 0.6,
    ease: 'power2.out'
  });

  // Animación de la columna de imágenes
  gsap.from('.about-image', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: isMobile ? 30 : 50,
    duration: isMobile ? 0.8 : 1.1,
    ease: 'power2.out',
    delay: 0.8
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
    duration: isMobile ? 0.8 : 1.1,
    ease: 'power2.out',
    delay: 1
  });

  // Animación de las habilidades con efecto rebote
  gsap.from('.skill-tag', {
    scrollTrigger: {
      trigger: '.skills-highlight',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: isMobile ? 20 : 25,
    scale: 0.8,
    duration: isMobile ? 0.6 : 0.7,
    stagger: isMobile ? 0.1 : 0.12,
    delay: 1.2,
    ease: 'back.out(1.3)'
  });

  // Efecto de texto shuffling mejorado
  const textShuffleElement = document.querySelector('.text-shuffle');
  if (textShuffleElement) {
    const words = ["passionate", "creative", "innovative", "dedicated", "self-taught", "focused", "curious", "driven"];

    const textShuffle = gsap.timeline({
      repeat: -1,
      repeatDelay: isMobile ? 1.5 : 2,
      scrollTrigger: {
        trigger: '.section-about',
        start: 'top 80%'
      }
    });

    words.forEach((word, index) => {
      textShuffle.to('.text-shuffle', {
        duration: isMobile ? 0.5 : 0.6,
        text: word,
        ease: "power2.out",
        delay: index > 0 ? (isMobile ? 1.8 : 2.5) : 0
      });
    });
  }
}

// Manejar redimensionamiento optimizado
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    createOptimizedBubbles();
  }, 250);
}

// Optimizar performance según el dispositivo
function optimizePerformance() {
  const deviceType = getDeviceType();
  const isMobile = ['mobile-xs', 'mobile-sm', 'mobile-md'].includes(deviceType);
  
  if (isMobile) {
    // Configurar GSAP para móviles
    gsap.config({
      force3D: false,
      nullTargetWarn: false
    });
    
    // Reducir complejidad en dispositivos muy pequeños
    if (deviceType === 'mobile-xs') {
      const bubbles = document.querySelectorAll('.bubble');
      bubbles.forEach(bubble => {
        bubble.style.transition = 'transform 0.2s ease-out';
      });
    }
  } else {
    // Configurar para desktop
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });
  }
}

// Función principal para configurar la sección
function setupAboutSection() {
  optimizePerformance();
  setupEnhancedTextAnimations();
  createOptimizedBubbles();
  createSimultaneousImages();
}

// Event listeners optimizados
document.addEventListener('DOMContentLoaded', function() {
  setupAboutSection();
  
  // Manejar redimensionamiento con debounce mejorado
  window.addEventListener('resize', handleResize);
  
  // Manejar cambio de orientación en móviles
  window.addEventListener('orientationchange', function() {
    setTimeout(() => {
      createOptimizedBubbles();
    }, 600); // Tiempo extra para orientación
  });
  
  // Optimización para dispositivos con poca memoria
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    const images = document.querySelectorAll('.stack-image');
    images.forEach(img => {
      img.style.transition = 'all 0.4s ease-in-out';
    });
    
    // Reducir frecuencia de animaciones
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
      bubble.style.animationDuration = '4s';
    });
  }
  
  // Pausar animaciones cuando la pestaña no está visible (ahorro de batería)
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });
});

// Cleanup mejorado al salir
window.addEventListener('beforeunload', function() {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  
  // Limpiar todas las animaciones GSAP
  gsap.killTweensOf("*");
  
  // Limpiar ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.killAll();
  }
});