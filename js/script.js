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
	
	