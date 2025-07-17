// ===== SECCIÓN INTRO (ABOUT ME) CON BURBUJAS ORGANIZADAS =====

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

// Obtener tamaño aleatorio para las burbujas
function getBubbleSize() {
  const sizes = ['small', 'medium', 'large'];
  const weights = [0.3, 0.5, 0.2]; // 30% small, 50% medium, 20% large
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

// Función para verificar colisiones entre burbujas
function checkCollision(bubble1, bubble2) {
  const rect1 = bubble1.getBoundingClientRect();
  const rect2 = bubble2.getBoundingClientRect();
  
  const distance = Math.sqrt(
    Math.pow(rect1.left + rect1.width/2 - rect2.left - rect2.width/2, 2) +
    Math.pow(rect1.top + rect1.height/2 - rect2.top - rect2.height/2, 2)
  );
  
  return distance < (rect1.width/2 + rect2.width/2 + 20); // 20px de separación mínima
}

// Encontrar posición válida sin colisiones
function findValidPosition(container, bubble, existingBubbles) {
  const containerRect = container.getBoundingClientRect();
  const bubbleSize = bubble.classList.contains('large') ? 90 : 
                    bubble.classList.contains('medium') ? 75 : 60;
  
  let attempts = 0;
  let validPosition = false;
  let x, y;

  while (!validPosition && attempts < 50) {
    x = Math.random() * (containerRect.width - bubbleSize - 40) + 20;
    y = Math.random() * (containerRect.height - bubbleSize - 60) + 40;
    
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    
    validPosition = true;
    
    // Verificar colisiones con burbujas existentes
    for (let existingBubble of existingBubbles) {
      if (checkCollision(bubble, existingBubble)) {
        validPosition = false;
        break;
      }
    }
    
    attempts++;
  }

  // Si no encuentra posición válida, usar grid layout
  if (!validPosition) {
    const cols = Math.floor(containerRect.width / 100);
    const index = existingBubbles.length;
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    x = col * 100 + 50;
    y = row * 100 + 70;
    
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
  }
}

// Crear burbujas organizadas
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
  
  technologies.forEach((tech, index) => {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${getBubbleSize()}`;
    bubble.setAttribute('data-tech', tech.tech);
    bubble.setAttribute('data-tooltip', tech.tooltip);
    bubble.innerHTML = `<i class="${tech.icon}"></i>`;
    
    container.appendChild(bubble);
    
    // Encontrar posición válida sin colisiones
    findValidPosition(container, bubble, createdBubbles);
    createdBubbles.push(bubble);
    
    // Animación de aparición simple
    gsap.fromTo(bubble, {
      scale: 0,
      opacity: 0
    }, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      delay: index * 0.05,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.section-about',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    // Hacer las burbujas arrastrables (funcionalidad simple)
    if (typeof Draggable !== 'undefined') {
      Draggable.create(bubble, {
        type: "x,y",
        bounds: container,
        onDragStart: function() {
          bubble.classList.add('dragging');
        },
        onDragEnd: function() {
          bubble.classList.remove('dragging');
        }
      });
    }
  });
}

// Animaciones de texto
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

  // Animación de letras del título
  gsap.from('.section-about .char', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    rotateX: -90,
    stagger: 0.05,
    duration: 0.8,
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
    y: 20,
    duration: 0.8,
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
    y: 30,
    duration: 0.8,
    stagger: 0.2,
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
    x: 50,
    duration: 1,
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
    x: -50,
    duration: 1,
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
    y: 20,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.8,
    ease: 'power2.out'
  });

  // Efecto de texto shuffling para palabras cambiantes
  const textShuffleElement = document.querySelector('.text-shuffle');
  if (textShuffleElement) {
    const words = ["passionate", "creative", "innovative", "dedicated", "self-taught", "focused", "curious", "driven"];

    const textShuffle = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
      scrollTrigger: {
        trigger: '.section-about',
        start: 'top 80%'
      }
    });

    words.forEach((word, index) => {
      textShuffle.to('.text-shuffle', {
        duration: 0.5,
        text: word,
        ease: "power2.out",
        delay: index > 0 ? 2 : 0
      });
    });
  }
}

// Función principal para configurar todas las animaciones
function setupSection2Animations() {
  setupTextAnimations();
  createOrganizedBubbles();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  setupSection2Animations();
  
  // Recrear burbujas al redimensionar la ventana
  window.addEventListener('resize', function() {
    setTimeout(createOrganizedBubbles, 100);
  });
});