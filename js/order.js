
	// Comprobar si hay información guardada en el almacenamiento local
if (!localStorage.getItem('usuario') || localStorage.getItem('usuario') === '') {
  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = 'login.html';
}
	
// **Buscar**
const searchInput = document.getElementById('inputSearch');
const googleAppScriptDataContainer = document.getElementById('google-app-script-data');

searchInput.addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase();
  const cards = googleAppScriptDataContainer.children;

  if (searchTerm === '') {
    // Restablecer el estilo de las tarjetas si el campo de búsqueda está vacío
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      card.style.display = 'block';
      card.classList.remove('match');
    }
  } else {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardText = card.textContent.toLowerCase();

      if (cardText.includes(searchTerm)) {
        card.style.display = 'block';
        card.classList.add('match');
      } else {
        card.style.display = 'none';
        card.classList.remove('match');
      }
    }
  }
});


// Define the cargarDatos function
function cargarDatos() {
// Cargar datos desde Google App Script
fetch('https://script.google.com/macros/s/AKfycbxoY6t07GMxfF7dCAArrINCXgXUc4tSwou48km1rmAPVmAsXVKODSceR5v9EYodUoVm/exec')
  .then(response => response.json())
  .then(data => {
    // Sort data by date in descending order (newest first)
    data.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
    
    // Display the data from Google App Script
    const googleAppScriptDataContainer = document.getElementById('google-app-script-data');
    googleAppScriptDataContainer.innerHTML = '';
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card mb-3';
      const fecha = new Date(item.Fecha);
      const fechaFormat = fecha.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const horaEntrega = item['Hora de entrega'];
      const cuentaRegresiva = document.createElement('div');
      cuentaRegresiva.className = 'cuenta-regresiva';   
	 
      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';
      cardBody.style.position = 'relative'; 	
      cardBody.innerHTML = `
        <h5 class="card-title">${item.Nombre}</h5>
        <p class="card-text">
          <strong>Fecha:</strong> ${fechaFormat}<br>
          <strong>Código:</strong> ${item.Código}<br>
          <strong>Teléfono:</strong> ${item.Teléfono}<br>
          <strong>Dirección:</strong> ${item.Dirección}<br>
          <strong>Punto de referencia:</strong> ${item['Punto de referencia']}<br>
          <strong>Hora de entrega:</strong> ${horaEntrega}<br>
          <strong>SMS:</strong> ${item.SMS}<br>
          <strong>Productos:</strong> ${item.Productos}<br><br>
          <strong>TOTAL:</strong> <strong>${item.Total}</strong><br>
		  <br>
          </p>
      `;
      cardBody.appendChild(cuentaRegresiva);
      card.appendChild(cardBody);
      googleAppScriptDataContainer.appendChild(card);
      actualizarCuentaRegresiva(cuentaRegresiva, horaEntrega, item.Fecha);
    });
    ordenarPorEntrega(); // Llamar a la función para ordenar los datos por tiempo restante de entrega
  })
  .catch(error => console.error('Error:', error));
}

// **Ordenar datos**
// Variables para almacenar el orden actual de los datos
let ordenNombre = 'asc';
let ordenFecha = 'asc';

// Función para ordenar los datos por nombre
function ordenarPorNombre() {
  const cards = googleAppScriptDataContainer.children;
  const arrayCards = Array.from(cards);
  arrayCards.sort((a, b) => {
    const nombreA = a.querySelector('.card-title').textContent;
    const nombreB = b.querySelector('.card-title').textContent;
    if (ordenNombre === 'asc') {
      return nombreA.localeCompare(nombreB);
    } else {
      return nombreB.localeCompare(nombreA);
    }
  });
  googleAppScriptDataContainer.innerHTML = '';
  arrayCards.forEach(card => {
    googleAppScriptDataContainer.appendChild(card);
  });
  ordenNombre = ordenNombre === 'asc' ? 'desc' : 'asc';
}
// Función para ordenar los datos por fecha
function ordenarPorFecha() {
  const cards = googleAppScriptDataContainer.children;
  const arrayCards = Array.from(cards);
  arrayCards.sort((a, b) => {
    const fechaA = a.querySelector('.card-text').textContent.match(/Fecha: (.*)/)[1];
    const fechaB = b.querySelector('.card-text').textContent.match(/Fecha: (.*)/)[1];
    const fechaAFormat = new Date(fechaA);
    const fechaBFormat = new Date(fechaB);
    if (ordenFecha === 'asc') {
      return fechaAFormat.getTime() - fechaBFormat.getTime();
    } else {
      return fechaBFormat.getTime() - fechaAFormat.getTime();
    }
  });
  googleAppScriptDataContainer.innerHTML = '';
  arrayCards.forEach(card => {
    googleAppScriptDataContainer.appendChild(card);
  });
  ordenFecha = ordenFecha === 'asc' ? 'desc' : 'asc';
}
// Function to sort data by remaining time for delivery
function ordenarPorEntrega() {
  const cards = googleAppScriptDataContainer.children;
  const arrayCards = Array.from(cards);
  arrayCards.sort((a, b) => {
    const cuentaRegresivaA = a.querySelector('.cuenta-regresiva');
    const cuentaRegresivaB = b.querySelector('.cuenta-regresiva');
    let tiempoA, tiempoB;

    if (cuentaRegresivaA && cuentaRegresivaA.textContent && cuentaRegresivaA.textContent.includes(',')) {
      tiempoA = cuentaRegresivaA.textContent.trim().split(', ');
      if (tiempoA.length < 3) {
        tiempoA = ['0', '0', '0'];
      }
    } else {
      tiempoA = ['0', '0', '0'];
    }

    if (cuentaRegresivaB && cuentaRegresivaB.textContent && cuentaRegresivaB.textContent.includes(',')) {
      tiempoB = cuentaRegresivaB.textContent.trim().split(', ');
      if (tiempoB.length < 3) {
        tiempoB = ['0', '0', '0'];
      }
    } else {
      tiempoB = ['0', '0', '0'];
    }

    const horasA = parseInt(tiempoA[0].split(' ')[0]);
    const minutosA = parseInt(tiempoA[1].split(' ')[0]);
    const segundosA = parseInt(tiempoA[2].split(' ')[0]);
    const horasB = parseInt(tiempoB[0].split(' ')[0]);
    const minutosB = parseInt(tiempoB[1].split(' ')[0]);
    const segundosB = parseInt(tiempoB[2].split(' ')[0]);
    const totalA = horasA * 3600 + minutosA * 60 + segundosA;
    const totalB = horasB * 3600 + minutosB * 60 + segundosB;

    if (a.querySelector('.cuenta-regresiva').textContent === 'Tiempo Agotado') {
      return 1;
    } else if (b.querySelector('.cuenta-regresiva').textContent === 'Tiempo Agotado') {
      return -1;
    } else {
      return totalA - totalB;
    }
  });
  googleAppScriptDataContainer.innerHTML = '';
  arrayCards.forEach(card => {
    googleAppScriptDataContainer.appendChild(card);
  });
}

// Agregar eventos a los botones de filtrado
document.getElementById('btn-filtro-az').addEventListener('click', ordenarPorNombre);
document.getElementById('btn-filtro-fecha').addEventListener('click', ordenarPorFecha);
document.getElementById('btn-filtro-entrega').addEventListener('click', ordenarPorEntrega);

function actualizarCuentaRegresiva(cuentaRegresiva, horaEntrega, fecha) {
  // Convertir la hora de entrega a un formato que pueda ser procesado por JavaScript
  let horaEntregaFormat;
  if (horaEntrega.includes('AM') || horaEntrega.includes('PM')) {
    // Formato "HH:mm AM/PM"
    const partes = horaEntrega.split(' ');
    const hora = partes[0].split(':');
    const ampm = partes[1];
    let hora24 = parseInt(hora[0]);
    if (ampm === 'PM' && hora24 !== 12) {
      hora24 += 12;
    } else if (ampm === 'AM' && hora24 === 12) {
      hora24 = 0;
    }
    horaEntregaFormat = new Date(fecha);
    horaEntregaFormat.setHours(hora24);
    horaEntregaFormat.setMinutes(parseInt(hora[1]));
    horaEntregaFormat.setSeconds(0);
  } else {
    // Formato "HH:mm"
    const partes = horaEntrega.split(':');
    horaEntregaFormat = new Date(fecha);
    horaEntregaFormat.setHours(parseInt(partes[0]));
    horaEntregaFormat.setMinutes(parseInt(partes[1]));
    horaEntregaFormat.setSeconds(0);
  }

  const ahora = new Date();
  const diferencia = horaEntregaFormat.getTime() - ahora.getTime();
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
  if (diferencia <= 30 * 60 * 1000) {
    cuentaRegresiva.style.background = 'red';
    cuentaRegresiva.style.color = 'white';
  }
  if (diferencia <= 0) {
    cuentaRegresiva.textContent = 'Tiempo Agotado';
  } else {
    cuentaRegresiva.textContent = `${horas} horas, ${minutos} minutos, ${segundos} segundos`;
  }
  setTimeout(() => {
    actualizarCuentaRegresiva(cuentaRegresiva, horaEntrega, fecha);
  }, 1000);
}



// Call the cargarDatos function when the page loads
cargarDatos();

// **Actualizar**
	document.getElementById('btn-actualizar').addEventListener('click', function() {
  const cargandoElement = document.createElement('p');
  cargandoElement.style.textAlign = 'center';
  cargandoElement.textContent = 'Cargando...';  
  document.getElementById('google-app-script-data').innerHTML = '';
  document.getElementById('google-app-script-data').appendChild(cargandoElement);

  // Call the function to load the data from Google App Script
  cargarDatos();
});

// Add countdown timer to refresh data
let tiempoRecarga = 3 * 60; // 10 minutos en segundos
let cuentaRegresivaRecarga = document.getElementById('cuenta-regresiva-recarga');

setInterval(() => {
  tiempoRecarga--;
  const minutos = Math.floor(tiempoRecarga / 60);
  const segundos = tiempoRecarga % 60;
  const minutosString = minutos < 10 ? `0${minutos}` : `${minutos}`;
  const segundosString = segundos < 10 ? `0${segundos}` : `${segundos}`;
  cuentaRegresivaRecarga.textContent = `${minutosString}:${segundosString}`;
  if (tiempoRecarga <= 0) {
    document.getElementById('google-app-script-data').innerHTML = 'Cargando...';
    cargarDatos();
    tiempoRecarga = 3 * 60; // Resetear el tiempo de recarga a 10 minutos
  }
}, 1000);