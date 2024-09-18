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
                let total = 0;
                cartItems.forEach(item => {
                    let itemTotal = item.quantity * item.price;
                    total += itemTotal;
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
            let total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
            $('#paymentModal').modal('show');
        }

        document.getElementById('accountNumber').addEventListener('click', function() {
            navigator.clipboard.writeText(this.textContent.trim()).then(() => {
                showNotification('Número de cuenta copiado al portapapeles', 'success');
            });
        });

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

// Función modificada para enviar el pedido
async function submitOrder() {
    if (document.getElementById('paymentForm').checkValidity()) {
        toggleSpinner(true); // Mostrar el spinner

        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const reference = document.getElementById('reference').value;
        const transactionSMS = document.getElementById('transactionSMS').value;

        let orderDetails = `🛒 NUEVO PEDIDO\n\n`;
        orderDetails += `👤 Nombre: #${fullName}\n`;
        orderDetails += `📞 Teléfono: ${phone}\n`;
        orderDetails += `🏠 Dirección: ${address}\n`;
        orderDetails += `🚩 Punto de referencia: ${reference}\n`;
        orderDetails += `💳 SMS de transacción: ${transactionSMS}\n\n`;
        orderDetails += `📦 Productos:\n`;

        let total = 0;
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            orderDetails += `- ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}\n`;
        });

        orderDetails += `\n💰 Total a pagar: $${total.toFixed(2)}`;

        try {
            const success = await sendToTelegram(orderDetails);

            if (success) {
                showNotification('¡Pedido realizado con éxito!', 'success');
                $('#paymentModal').modal('hide');
                cartItems = [];
                updateCartCount();
            } else {
                showNotification('Error al enviar el pedido. Por favor, inténtelo de nuevo.', 'error');
            }
        } catch (error) {
            showNotification('Error al enviar el pedido. Por favor, inténtelo de nuevo.', 'error');
        } finally {
            toggleSpinner(false); // Ocultar el spinner
        }
    } else {
        showNotification('Por favor, complete todos los campos requeridos.', 'error');
    }
}
	
	
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
