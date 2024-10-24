/* SLIDE PANEL */
/* SLIDE PANEL */

// Función para abrir el panel deslizante
function openSlidingPanel(content) {
    document.getElementById('panelContent').innerHTML = content;
    document.getElementById('slidingPanel').classList.add('active');
}

// Función para cerrar el panel deslizante
document.addEventListener('DOMContentLoaded', function() {
    // Agregar evento para cerrar el panel
    document.getElementById('closePanel').addEventListener('click', function() {
        document.getElementById('slidingPanel').classList.remove('active');
    });

    // Cambiar la función de los enlaces para abrir el panel en lugar de las modales
    document.querySelectorAll('.nav-link[data-bs-toggle="modal"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-bs-target');
            
            let content = '';
            switch (target) { 
                case '#funcionamientoModal':
                    content = '<h5>Funcionamiento</h5><p>En desarrollo...</p>';
                    break;
                case '#acercaDeModal':
                    content = '<h5>Acerca de</h5><p>En desarrollo...</p>';
                    break;
                case '#soporteModal':
                    content = '<h5>Soporte</h5><p>Información de soporte aquí...</p>';
                    break;
                case '#coffeModal':
                    content = '<h5>Invitanos un cafe</h5><p>Invitanos un cafe y nos ayudaras a crecer</p>';
                    break;
                default:
                    content = '<h5>Error</h5><p>Contenido no encontrado.</p>';
            }
            
            openSlidingPanel(content);
        });
    });
});