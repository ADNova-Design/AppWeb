
document.addEventListener("DOMContentLoaded", function() {
  getOrderData();
});
function getOrderData() {
  // Crear un nuevo objeto XMLHttpRequest
  var xhr = new XMLHttpRequest();
  
  // Abrir una solicitud GET a la URL especificada
  xhr.open("GET", "https://script.google.com/macros/s/AKfycbxoY6t07GMxfF7dCAArrINCXgXUc4tSwou48km1rmAPVmAsXVKODSceR5v9EYodUoVm/exec", true);
  
  // Establecer un manejador de eventos para cuando la solicitud esté completa
  xhr.onload = function() {
    // Verificar si la solicitud fue exitosa (200 OK)
    if (xhr.status === 200) {
      // Obtener el texto de respuesta y recortarlo
      var responseText = xhr.responseText.trim();
      
      // Analizar el texto de respuesta como JSON
      var jsonData = JSON.parse(responseText);
      
      // Obtener la cuenta de filas con datos
      var count = jsonData.length;
      
      // Registrar la cuenta en la consola
      console.log("Número de filas con datos:", count);
      
      // Actualizar el elemento HTML con la cuenta
      document.getElementById("orders-data").innerHTML = count;      
    } 
  };
  
  // Enviar la solicitud
  xhr.send();
}


document.addEventListener("DOMContentLoaded", function() {
  updateIncomeData();
});

function updateIncomeData() {
  getIncomeData(function(incomeData) {
    var incomeDataElement = document.getElementById("income-data");
  
    if (incomeDataElement) {
      incomeDataElement.textContent = incomeData;
    } else {
      console.error("Elemento con id 'income-data' no encontrado.");
    }
  });
}

function getIncomeData(callback) {
  var xhr = new XMLHttpRequest();
  
  xhr.open("GET", "https://script.google.com/macros/s/AKfycbxoY6t07GMxfF7dCAArrINCXgXUc4tSwou48km1rmAPVmAsXVKODSceR5v9EYodUoVm/exec", true);
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      callback(data.incomeData);
    } else {
      console.error("Error al obtener los datos de ingresos.");
      callback("Error");
    }
  };
  
  xhr.send();
}