
//* TABS
// seleccionamos todas las tabs
const tabs = document.querySelectorAll('.tab');

// seleccionamos la tab de diarios y la mostramos como activa por defecto
const defaultTab = document.querySelector('[data-period="total"]');
defaultTab.classList.add('active');

// agregamos un evento de clic a cada tab
tabs.forEach((tab) => {
  tab.addEventListener('click', (e) => {
    // evitamos que la tab se comporte como un enlace normal
    e.preventDefault();

    // ocultamos todas las tabs activas
    tabs.forEach((tab) => {
      tab.classList.remove('active');
      tab.classList.add('inactive');
    });

    // mostramos la tab seleccionada
    tab.classList.remove('inactive');
    tab.classList.add('active');
  });
});

const navLinks = document.querySelectorAll('.footer nav a');
const navIcons = document.querySelectorAll('.footer nav i');

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navLinks.forEach((otherLink) => {
      otherLink.classList.remove('active');
    });
    link.classList.add('active');
  });
});

navIcons.forEach((icon) => {
  icon.addEventListener('click', (e) => {
    e.preventDefault();
    navIcons.forEach((otherIcon) => {
      otherIcon.classList.remove('active');
    });
    icon.classList.add('active');
  });
});