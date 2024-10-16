
// seleccionamos la sección de estadísticas y la mostramos como activa por defecto
const statsSection = document.getElementById('stats-section');
statsSection.style.display = 'block';

// seleccionamos el enlace del menú bottom que corresponde a la sección de estadísticas y lo mostramos como activo
const statsLink = document.querySelector('.footer-link[data-section="stats-section"]');
statsLink.classList.add('active');

// seleccionamos todos los enlaces del menú bottom
const footerLinks = document.querySelectorAll('.footer-link');

// agregamos un evento de clic a cada enlace
footerLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    // evitamos que el enlace se comporte como un enlace normal
    e.preventDefault();

    // obtenemos el ID de la sección que se debe mostrar
    const sectionId = link.getAttribute('data-section');

    // seleccionamos todas las secciones
    const sections = document.querySelectorAll('.stats-section, .order-section, .develop1-section, .develop2-section');

    // ocultamos todas las secciones
    sections.forEach((section) => {
      section.style.display = 'none';
    });

    // mostramos la sección seleccionada
    const selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = 'block';
  });
});
