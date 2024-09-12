
	// JavaScript para manejar la interactividad y mostrar/ocultar la ventana modal

const orderButton = document.getElementById('order-button');
const modal = document.getElementById('modal');
const closeBtn = document.getElementsByClassName('close')[0];
const confirmOrderBtn = document.getElementById('confirm-order');

// Mostrar la ventana modal al hacer clic en el botón de pedido
orderButton.addEventListener('click', function() {
    modal.style.display = 'block';
});

// Ocultar la ventana modal al hacer clic en el botón de cierre
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Ocultar la ventana modal al hacer clic fuera de ella
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Procesar el pedido al hacer clic en el botón de confirmar pedido
confirmOrderBtn.addEventListener('click', function() {
    // Aquí puedes agregar la lógica para procesar el pedido, como enviar los datos a un servidor, etc.
    // Puedes acceder a los valores de los campos de entrada, como fullname, phone, address, email, details, quantity, etc.
    // Luego, puedes cerrar la ventana modal y mostrar un mensaje de confirmación al usuario.
    modal.style.display = 'none';
});

    function openTab(tabName) {
        var tabcontent = document.getElementsByClassName("tabcontent");
        for (var i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        document.getElementById(tabName).style.display = "block";
    }

    function confirmarReserva() {
        // Aquí puedes agregar la lógica para enviar los datos del formulario de reserva
        // Por ejemplo, puedes validar los campos y enviar una solicitud al servidor
        // Una vez que se haya completado la reserva, puedes mostrar una notificación o mensaje al usuario
        showModal();
    }

    function cancelarReserva() {
        document.getElementById("cancelModal").style.display = "block";
    }

    function enviarCancelacion() {
        // Aquí puedes agregar la lógica para enviar la cancelación de la reserva
        // Por ejemplo, validar los campos y enviar la solicitud al servidor
        // Una vez cancelada la reserva, puedes mostrar una notificación o mensaje al usuario
        closeCancelModal();
    }

    function showModal() {
        document.getElementById("notificacionesModal").style.display = "block";
    }

    function closeModal() {
        document.getElementById("notificacionesModal").style.display = "none";
    }

    function closeCancelModal() {
        document.getElementById("cancelModal").style.display = "none";
    }
	
	function redirectToProduct1() {
        window.location.href = 'menu/p1.html';
    }