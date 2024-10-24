let cartItems = [];
        function addToCart(product, price) {
            let existingItem = cartItems.find(item => item.name === product);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({name: product, quantity: 1, price: price});
            }
            updateCartCount();
            showNotification(`${product} agregado al carrito`, 'success');
        }

        function updateCartCount() {
            let totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cartCount').textContent = totalItems;
        }

        function showDetails(productName, productDescription) {
            document.getElementById('modalBody').innerHTML = `<strong>${productName}</strong><p>${productDescription}</p>`;
            new bootstrap.Modal(document.getElementById('detailsModal')).show();
        }

       function viewCart() {
    const cartModalBody = document.getElementById('cartModalBody');
    if (cartItems.length > 0) {
        let cartHTML = '';
        let subtotal = 0;
        cartItems.forEach(item => {
            let itemTotal = item.quantity * item.price;
            subtotal += itemTotal;
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <strong>${item.name}</strong> - $${item.price.toFixed(2)} x ${item.quantity}
                    </div>
                    <div class="cart-item-actions">
                        <button onclick="changeQuantity('${item.name}', 1)" class="btn btn-sm btn-primary">+</button>
                        <button onclick="changeQuantity('${item.name}', -1)" class="btn btn-sm btn-danger">-</button>
                        <button onclick="removeFromCart('${item.name}')" class="btn btn-sm btn-warning">Eliminar</button>
                    </div>
                </div>
            `;
        });
 

         let deliveryCost = subtotal <= 500 ? 150 : 0;
        let total = subtotal + deliveryCost;

        cartHTML += `<div class="cart-subtotal">Subtotal: $${subtotal.toFixed(2)}</div>`;
        if (deliveryCost > 0) {
            cartHTML += `<div class="cart-delivery">Costo por domicilio: $${deliveryCost.toFixed(2)}</div>`;
        }
        cartHTML += `<div class="cart-total">Total a pagar: $${total.toFixed(2)}</div>`;

        cartModalBody.innerHTML = cartHTML;
    } else {
        cartModalBody.innerHTML = 'No hay productos en el carrito.';
    }
    $('#cartModal').modal('show');
}

        function changeQuantity(productName, change) {
            let item = cartItems.find(item => item.name === productName);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productName);
                }
                updateCartCount();
                viewCart();
            }
        }

        function removeFromCart(productName) {
            cartItems = cartItems.filter(item => item.name !== productName);
            updateCartCount();
            viewCart();
            showNotification(`${productName} eliminado del carrito`, 'success');
        }

       function showPaymentModal() {
    $('#cartModal').modal('hide');
    let subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let deliveryCost = subtotal <= 500 ? 150 : 0;
    let total = subtotal + deliveryCost;

    let paymentDetails = `Subtotal: $${subtotal.toFixed(2)}`;
    if (deliveryCost > 0) {
        paymentDetails += `<br>Costo por domicilio: $${deliveryCost.toFixed(2)}<br>`;
    }
    paymentDetails += `<br>Total a pagar: $${total.toFixed(2)}`;

    document.getElementById('paymentAmount').innerHTML = `<p><strong>${paymentDetails}</strong></p>`;

    // Ocultar o mostrar los elementos según el estado del switch
    const payWithDeliveryInput = document.getElementById('payWithDelivery');
    const celNumberDiv = document.querySelector('div.mb-3:has(#celNumber)');
    const transactionSMSInput = document.getElementById('transactionSMS').closest('div.mb-3');

    if (payWithDeliveryInput.checked) {
        celNumberDiv.style.display = 'none';
        transactionSMSInput.style.display = 'none';
    } else {
        celNumberDiv.style.display = 'block';
        transactionSMSInput.style.display = 'block';
    }

    $('#paymentModal').modal('show');
}

document.getElementById('payWithDelivery').addEventListener('change', function() {
    const celNumberDiv = document.querySelector('div.mb-3:has(#celNumber)');
    const transactionSMSInput = document.getElementById('transactionSMS').closest('div.mb-3');

    if (this.checked) {
        celNumberDiv.style.display = 'none';
        transactionSMSInput.style.display = 'none';
    } else {
        celNumberDiv.style.display = 'block';
        transactionSMSInput.style.display = 'block';
    }
});
		
		
		document.getElementById('payWithDelivery').addEventListener('change', function() {
    const paymentDetailsDiv = document.getElementById('paymentDetails');
    const celNumberDiv = document.querySelector('div.mb-3:has(#celNumber)');
    const transactionSMSInput = document.getElementById('transactionSMS').closest('div.mb-3');

    if (this.checked) {
        paymentDetailsDiv.style.display = 'none';
        celNumberDiv.style.display = 'none';
        transactionSMSInput.style.display = 'none';
    } else {
        paymentDetailsDiv.style.display = 'block';
        celNumberDiv.style.display = 'block';
        transactionSMSInput.style.display = 'block';
    }
});
 
document.addEventListener('DOMContentLoaded', function() {
    const userProfileIcon = document.getElementById('userProfileIcon');
    const userProfileModal = new bootstrap.Modal(document.getElementById('userProfileModal'));
    const saveUserProfileBtn = document.getElementById('saveUserProfile');

    // Cargar datos del usuario si existen
    loadUserProfile();

    userProfileIcon.addEventListener('click', function(e) {
        e.preventDefault();
        userProfileModal.show();
    });

    saveUserProfileBtn.addEventListener('click', function() {
        saveUserProfile();
        userProfileModal.hide();
    });

// Función para establecer la hora actual + 30 minutos como valor predeterminado
function setDefaultDeliveryTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 35); // Sumar 30 minutos

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convertir a formato de 12 horas
    const formattedHour = hours % 12 || 12; // Convertir 0 a 12
    const formattedMinute = minutes < 10 ? '0' + minutes : minutes; // Asegurar dos dígitos

    // Establecer los valores en los campos
    document.getElementById('deliveryHour').value = formattedHour;
    document.getElementById('deliveryMinute').value = formattedMinute;
    document.getElementById('deliveryPeriod').value = period;
}

// Función para validar el tiempo de entrega
function validateDeliveryTime() {
    const hour = parseInt(document.getElementById('deliveryHour').value);
    const minute = parseInt(document.getElementById('deliveryMinute').value);
    const period = document.getElementById('deliveryPeriod').value;

    // Convertir la hora a formato de 24 horas para la comparación
    const deliveryHour24 = (period === 'PM' && hour < 12) ? hour + 12 : hour;
    const deliveryTime = new Date();
    deliveryTime.setHours(deliveryHour24);
    deliveryTime.setMinutes(minute);

    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Hora actual + 30 minutos

    if (deliveryTime < now) {
        alert('El tiempo de entrega debe ser al menos 30 minutos a partir de la hora actual.');
        return false; // Evitar el envío del formulario
    }
    return true; // Permitir el envío del formulario
}

// Llamar a la función para establecer la hora predeterminada al cargar la página
window.onload = setDefaultDeliveryTime;

// Ejemplo de cómo validar al enviar el formulario
document.getElementById('yourFormId').addEventListener('submit', function(event) {
    if (!validateDeliveryTime()) {
        event.preventDefault(); // Evitar el envío si la validación falla
    }
});


    function saveUserProfile() {
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        const userProfile = {
            fullName: fullName,
            phone: phone,
            address: address
        };
		
		 toggleSpinner(true); // Mostrar el spinner

    // Simular una espera de 1 segundo antes de guardar los datos
    setTimeout(() => {
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        toggleSpinner(false); // Ocultar el spinner
        location.reload(); // Recargar la página
        showNotification('Perfil guardado correctamente', 'success');
    }, 1000);


        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        showNotification('Perfil guardado correctamente', 'success');
    }
	
	document.addEventListener('DOMContentLoaded', function() {
    const welcomeMessage = document.getElementById('welcome-message');
    const userProfileIcon = document.getElementById('userProfileIcon');
    const userProfileModal = new bootstrap.Modal(document.getElementById('userProfileModal'));
    const saveUserProfileBtn = document.getElementById('saveUserProfile');

    // Cargar datos del usuario si existen
    loadUserProfile();

    userProfileIcon.addEventListener('click', function(e) {
        e.preventDefault();
        userProfileModal.show();
    });

    saveUserProfileBtn.addEventListener('click', function() {
        saveUserProfile();
        userProfileModal.hide();
    });

    function saveUserProfile() {
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;

        const userProfile = {
            fullName: fullName,
            phone: phone,
            address: address
        };

        // Actualizar el mensaje de bienvenida con el nombre del usuario
        welcomeMessage.textContent = `Hola: ${userProfile.fullName}`;
    }

    function loadUserProfile() {
        // Cargar datos del usuario desde la base de datos o desde una fuente de datos
        const userProfile = {
            fullName: 'Juan Pérez',
            phone: '123456789',
            address: 'Calle 123'
        };

        // Actualizar el mensaje de bienvenida con el nombre del usuario
      
    }
});

   function loadUserProfile() {
  const userProfile = JSON.parse(localStorage.getItem('userProfile'));
  if (userProfile && userProfile.fullName && userProfile.phone && userProfile.address) {
    const { fullName, phone, address } = userProfile;
    document.getElementById('fullName').value = fullName;
    document.getElementById('phone').value = phone;
    document.getElementById('address').value = address;

    // Autollenado de los campos del pago
    const paymentForm = document.getElementById('paymentForm');
    const fullNameInput = paymentForm.querySelector('input[id="fullName"]');
    const phoneInput = paymentForm.querySelector('input[id="phone"]');
    const addressInput = paymentForm.querySelector('input[id="address"]');

    fullNameInput.value = fullName;
    phoneInput.value = phone;
    addressInput.value = address;

    // Mostrar el nombre del usuario
    document.getElementById('userName').textContent = `Hola, ${fullName}`;
  } else {
    const userProfileModal = new bootstrap.Modal(document.getElementById('userProfileModal'));
    userProfileModal.show();
  }
}
});


function showDetails(productName, productDescription, productImage, details) {
    let html = `
        <img src="${productImage}" alt="${productName}">
        <strong>${productName}</strong>
        <p>${productDescription}</p>
    `;

    if (Array.isArray(details)) {
        html += `
            <ul>
                ${details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        `;
    } else if (typeof details === 'string' && details.includes('Litros')) {
        html += `
            <p>Volume: ${details}</p>
        `;
    }

    document.getElementById('modalBody').innerHTML = html;
    new bootstrap.Modal(document.getElementById('detailsModal')).show();
}


       // Configuración de Telegram
const BOT_TOKEN = '6998902940:AAHWICrBuD2ROmUjuvd8IIHWWECv9s_-CEY';
const CHAT_ID = '-4581973425';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// Función para enviar mensaje a Telegram
async function sendToTelegram(message) {
    try {
        const response = await fetch(TELEGRAM_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta de Telegram');
        }

        return true;
    } catch (error) {
        console.error('Error al enviar mensaje a Telegram:', error);
        return false;
    }
}

function showNotification(message, type) {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `notification ${type === 'success' ? 'notification-success' : 'notification-error'}`;
    notificationDiv.innerHTML = `
        ${message}
        <button class="close-btn">&times;</button>
    `;
    document.body.appendChild(notificationDiv);

    // Mostrar la notificación
    setTimeout(() => {
        notificationDiv.classList.add('show');
    }, 10);

    // Configurar el botón de cerrar
    const closeBtn = notificationDiv.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        notificationDiv.classList.remove('show');
        setTimeout(() => {
            notificationDiv.remove();
        }, 300);
    });

    // Eliminar la notificación después de 5 segundos
    setTimeout(() => {
        notificationDiv.classList.remove('show');
        setTimeout(() => {
            notificationDiv.remove();
        }, 300);
    }, 5000);
}

// Función para mostrar/ocultar el spinner
function toggleSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'flex' : 'none';
}

// Función para generar un código único
function generateUniqueCode() {
    const now = new Date();
    return now.getFullYear().toString().substr(-2) +
           (now.getMonth() + 1).toString().padStart(2, '0') +
           now.getDate().toString().padStart(2, '0') +
           now.getHours().toString().padStart(2, '0') +
           now.getMinutes().toString().padStart(2, '0') +
           now.getSeconds().toString().padStart(2, '0');
}

async function submitOrder() {
    if (document.getElementById('paymentForm').checkValidity()) {
        toggleSpinner(true);

        const fullNameInput = document.getElementById('paymentForm').querySelector('input[id="fullName"]');
        const phoneInput = document.getElementById('paymentForm').querySelector('input[id="phone"]');
        const addressInput = document.getElementById('paymentForm').querySelector('input[id="address"]');
        const referenceInput = document.getElementById('paymentForm').querySelector('input[id="reference"]');
        const deliveryHourInput = document.getElementById('paymentForm').querySelector('input[id="deliveryHour"]');
        const deliveryMinuteInput = document.getElementById('paymentForm').querySelector('input[id="deliveryMinute"]');
        const deliveryPeriodInput = document.getElementById('paymentForm').querySelector('select[id="deliveryPeriod"]');
        const transactionSMSInput = document.getElementById('paymentForm').querySelector('input[id="transactionSMS"]');
        const payWithDeliveryInput = document.getElementById('payWithDelivery');

        const fullName = fullNameInput.value;
        const phone = phoneInput.value;
        const address = addressInput.value;
        const reference = referenceInput.value;
        const deliveryHour = parseInt(deliveryHourInput.value);
        const deliveryMinute = parseInt(deliveryMinuteInput.value);
        const deliveryPeriod = deliveryPeriodInput.value;
        const deliveryTime = `${deliveryHourInput.value}:${deliveryMinuteInput.value} ${deliveryPeriodInput.value}`;
        const payWithDelivery = payWithDeliveryInput.checked;
        const transactionSMS = payWithDelivery ? "PAGO CON LA ENTREGA" : transactionSMSInput.value;

        // Validar que el tiempo de entrega no sea menor a la hora actual + 30 minutos
        const now = new Date();
        const minTime = new Date(now.getTime() + 30 * 60000); // Hora actual + 30 minutos

        const deliveryDateTime = new Date();
        deliveryDateTime.setHours(deliveryHour + (deliveryPeriod === 'PM' ? 12 : 0));
        deliveryDateTime.setMinutes(deliveryMinute);

        if (deliveryDateTime < minTime) {
            showNotification('El tiempo de entrega debe ser al menos 30 minutos a partir de la hora actual.', 'error');
            toggleSpinner(false);
            return;
        }

        let orderDetails = `🛒 NUEVO PEDIDO\n\n`;
        orderDetails += `👤 Nombre: #${fullName}\n`;
        orderDetails += `📞 Teléfono: ${phone}\n`;
        orderDetails += `🏠 Dirección: ${address}\n`;
        orderDetails += `🚩 Punto de referencia: ${reference}\n`;
        orderDetails += `🕒 Hora de entrega: ${deliveryTime}\n\n`; // Usar la hora establecida por el usuario
        orderDetails += payWithDelivery ? `💳 Pago con la entrega\n\n` : `💳 SMS de transacción: ${transactionSMS}\n\n`;

        orderDetails += `📦 Productos:\n`;
        let total = 0;
        let productsDetails = '';

        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            productsDetails += `${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}\n`;
            orderDetails += `- ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}\n`;
        });

        let deliveryCost = total <= 500 ? 150 : 0;
        if (deliveryCost > 0) {
            orderDetails += `\n💰 Costo por domicilio: $${deliveryCost.toFixed(2)}`;
        }
        orderDetails += `\n💰 Total a pagar: $${(total + deliveryCost).toFixed(2)}`;

        const uniqueCode = generateUniqueCode();
        orderDetails += `\n\nCódigo: ${uniqueCode}`;

        // Guardar el pedido en localStorage y mostrar en consola
        const orderData = {
            fullName,
            phone,
            address,
            reference,
            deliveryTime, // Usar la hora establecida por el usuario
            transactionSMS,
            products: productsDetails,
            total: total + deliveryCost,
            date: new Date().toISOString() // Guarda la fecha en formato ISO
        };
        try {
            const telegramSuccess = await sendToTelegram(orderDetails);
            
            if (telegramSuccess) {
                const sheetData = {
                    code: uniqueCode,
                    fullName: fullName,
                    phone: phone,
                    address: address,
                    reference: reference,
                    deliveryTime: deliveryTime, // Usar la hora establecida por el usuario
                    transactionSMS: transactionSMS,
                    payWithDelivery: payWithDelivery,
                    products: productsDetails,
                    total: total + deliveryCost
                };

                // Enviar datos a Google Sheets
                const sheetSuccess = await sendToGoogleSheet(sheetData);

                if (sheetSuccess) {          
                     // Guardar los datos en Historial de Pedidos          
                    saveOrderToHistory(orderData);
                    console.log("Detalles del pedido guardados:", orderData); // Agregado para ver en consola")

                    showNotification('¡Pedido realizado con éxito!', 'success');
                    $('#paymentModal').modal('hide');
                    cartItems = [];
                    updateCartCount();
                } else {
                    showNotification('Error al enviar el pedido. Por favor, inténtelo de nuevo.', 'warning');
                }
            } else {
                showNotification('Error al enviar el pedido. Por favor, inténtelo de nuevo.', 'error');
            }
        } catch (error) {
            console.error('Error en el proceso de envío:', error);
            showNotification('Error al procesar el pedido. Por favor, inténtelo de nuevo.', 'error');
        } finally {
            toggleSpinner(false);
        }
    } else {
        showNotification('Por favor, complete todos los campos requeridos.', 'error');
    }
}

function saveOrderToHistory(orderData) {
    // Obtener el historial de pedidos existente del localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    
    // Agregar el nuevo pedido al historial
    existingOrders.push(orderData);
    
    // Guardar el historial actualizado en el localStorage
    localStorage.setItem('orderHistory', JSON.stringify(existingOrders));
    
    console.log("Pedido guardado en el historial:", existingOrders); // Mostrar el historial actualizado en consola
}

function showOrderHistory() {
    const existingOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const orderHistoryList = document.getElementById('orderHistoryList');
    orderHistoryList.innerHTML = ''; // Limpiar contenido previo

    existingOrders.forEach((order, index) => {
        const orderDate = new Date(order.date).toLocaleString(); // Usar la fecha guardada
        const orderElement = document.createElement('div');
        orderElement.innerHTML = `
            <div>
                <button class="btn btn-link" onclick="showOrderDetailModal(${index})">Pedido ${index + 1} - ${orderDate}</button>
            </div>
        `;
        orderHistoryList.appendChild(orderElement);
    });

    console.log("Historial de pedidos mostrado:", existingOrders); // Verifica que se muestre el historial
}

function showOrderDetailModal(orderIndex) {
    const existingOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const order = existingOrders[orderIndex];

    // Mostrar los detalles en otra modal
    const orderDetailsContent = `
    <h5>Detalles del Pedido</h5>
    <p><strong>Nombre:</strong> ${order.fullName}</p>
    <p><strong>Teléfono:</strong> ${order.phone}</p>
    <p><strong>Dirección:</strong> ${order.address}</p>
    <p><strong>Punto de referencia:</strong> ${order.reference}</p>
    <p><strong>Hora de entrega:</strong> ${formatDeliveryTime(order.deliveryTime)}</p>
    <p><strong>SMS de transacción:</strong> ${order.transactionSMS}</p>
    <p><strong>Productos:</strong></p>
    <p>${order.products}</p>
    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
`;

// Función para formatear la hora de entrega
function formatDeliveryTime(deliveryTime) {
    const [time, period] = deliveryTime.split(' '); // Separar la hora y el periodo (AM/PM)
    const [hour, minute] = time.split(':'); // Separar horas y minutos
    const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`; // Asegurarse de que tenga dos dígitos
    return formattedTime;
}


    // Crear una nueva modal para mostrar los detalles
    const orderDetailsModal = document.createElement('div');
    orderDetailsModal.className = 'modal fade';
    orderDetailsModal.id = 'orderDetailsModal';
    orderDetailsModal.tabIndex = '-1';
    orderDetailsModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Detalles del Pedido</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ${orderDetailsContent}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(orderDetailsModal);
    const modal = new bootstrap.Modal(orderDetailsModal);
    modal.show();
    modal._element.addEventListener('hidden.bs.modal', () => {
        orderDetailsModal.remove(); // Elimina el modal del DOM al cerrarlo
    });
}

async function sendToGoogleSheet(data) {
    const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxoY6t07GMxfF7dCAArrINCXgXUc4tSwou48km1rmAPVmAsXVKODSceR5v9EYodUoVm/exec';
    try {
        const response = await fetch(SHEET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'no-cors'
        });
        
        // Debido al modo 'no-cors', no podemos verificar la respuesta
        // Asumimos que fue exitoso si no hubo errores
        return true;
    } catch (error) {
        console.error('Error al enviar datos a Google Sheet:', error);
        return false;
    }
}

	document.getElementById('payWithDelivery').addEventListener('change', function() {
    const transactionSMSInput = document.getElementById('transactionSMS');
    if (this.checked) {
        transactionSMSInput.disabled = true;
    } else {
        transactionSMSInput.disabled = false;
    }
});
	
	document.addEventListener('DOMContentLoaded', (event) => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    function setDarkMode(isDark) {
        body.classList.toggle('dark-mode', isDark);
        const toggleText = darkModeToggle.querySelector('span');
        const toggleIcon = darkModeToggle.querySelector('svg');

        if (isDark) {
            toggleText.textContent = 'Modo Claro';
            toggleIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high" viewBox="0 0 16 16">
                    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
                </svg>
            `;
        } else {
            toggleText.textContent = 'Modo Oscuro';
            toggleIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-stars" viewBox="0 0 16 16">
                    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/>
                    <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/>
                </svg>
            `;
        }
        localStorage.setItem('darkMode', isDark ? 'enabled' : null);
    }

    // Comprobar si el modo oscuro estaba activado anteriormente
    if (localStorage.getItem('darkMode') === 'enabled') {
        setDarkMode(true);
    }

    darkModeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        setDarkMode(!body.classList.contains('dark-mode'));
    });
});


document.getElementById('accountNumber').addEventListener('click', function() {
  navigator.clipboard.writeText('9204 0699 9818 9625');
  showNotification('Número de cuenta copiado al portapapeles', 'success');
});

document.getElementById('celNumber').addEventListener('click', function() {
  navigator.clipboard.writeText('+53 59072053');
  showNotification('Número de teléfono copiado al portapapeles', 'success');
});

 // SOPORTE POR WHATSAPP
document.querySelector('.contactSuport').addEventListener('click', function(e) {
    var appUrl = this.href;
    var webUrl = 'https://web.whatsapp.com/send?phone=18632541732'; // URL de respaldo

    var start = new Date().getTime();
    setTimeout(function() {
        var end = new Date().getTime();
        if (end - start < 1500) {
            window.location = webUrl;
        }
    }, 1500);
});

// SOPORTE POR TELEGRAM
document.getElementById('telegramLink').addEventListener('click', function(e) {
    e.preventDefault();
    var appUrl = 'tg://join?invite=TnCwk8_IVcAyNDNh';
    var webUrl = '';

    // Intenta abrir la aplicación
    window.location = appUrl;

    // Si la aplicación no se abre después de un segundo, redirige a la versión web
    setTimeout(function() {
        if (document.hidden || document.webkitHidden) {
            // La aplicación se abrió
        } else {
            window.location = webUrl;
        }
    }, 1500);
});


// Agregar evento de clic a los botones de cerrar
document.querySelectorAll('.btn-close').forEach(button => {
    button.addEventListener('click', () => {
        // Obtener el modal padre
        const modal = button.closest('.modal');
        // Ocultar el modal
        modal.classList.remove('show');
        // Eliminar el atributo aria-hidden
        modal.setAttribute('aria-hidden', 'true');
        // Eliminar el atributo style
        modal.removeAttribute('style');
        // Eliminar el atributo tabindex
        modal.removeAttribute('tabindex');
    });
});
	function formatHour(input) {
        let value = input.value.replace(/[^0-9]/g, ''); // Solo números
        if (value.length > 2) value = value.slice(0, 2); // Limitar a 2 dígitos
        
        if (parseInt(value) > 12) value = '12'; // Limitar a 12
        input.value = value;
    }

    function formatMinute(input) {
        let value = input.value.replace(/[^0-9]/g, ''); // Solo números
        if (value.length > 2) value = value.slice(0, 2); // Limitar a 2 dígitos
        
        if (parseInt(value) > 59) value = '59'; // Limitar a 59
        input.value = value;
     }


     document.getElementById('accountNumber').addEventListener('click', function() {
        const accountNumber = '9204 0699 9818 9625';
        navigator.clipboard.writeText(accountNumber)
            .then(() => {
                showNotification('Número de cuenta copiado al portapapeles', 'success');
            })
            .catch(err => {
                console.error('Error al copiar al portapapeles: ', err);
                showNotification('Error al copiar el número de cuenta', 'error');
            });
    });    