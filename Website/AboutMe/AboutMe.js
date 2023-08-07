document.addEventListener('DOMContentLoaded', function () {
  const clickableElements = document.querySelectorAll('.clickable');

  clickableElements.forEach(function (clickableElement) {
    const h1Element = clickableElement.querySelector('h1');
    const overlayText = clickableElement.querySelector('.overlay-text');

    h1Element.addEventListener('click', function () {
      console.log('Clic en el texto');
      if (overlayText) {
        overlayText.style.display = 'block';
      }
    });

    clickableElement.addEventListener('click', function (event) {
      const linkElement = clickableElement.querySelector('a');
      if (linkElement) {
        linkElement.click(); // Simular clic en el enlace si existe
      }
    });
  });
});
