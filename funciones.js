// Agregar un producto al carrito
function agregarAlCarrito(nombreProducto, precio) {
    var listaCarrito = JSON.parse(sessionStorage.getItem("productosCarrito")) || [];

    listaCarrito.push({ nombre: nombreProducto, precio: precio });

    sessionStorage.setItem("productosCarrito", JSON.stringify(listaCarrito));

    actualizarContadorMenu();

    alert("Se agregó " + nombreProducto + " al carrito.");
}

function actualizarContadorMenu() {
    var listaCarrito = JSON.parse(sessionStorage.getItem("productosCarrito")) || [];
    var elementoCarrito = document.getElementById("cant-carrito");
    if (elementoCarrito) {
        elementoCarrito.innerText = listaCarrito.length;
    }
}

function cargarTablaCarrito() {
    var tabla = document.getElementById("tabla-carrito");
    var elementoTotal = document.getElementById("total-pagar");

    if (!tabla) return;

    var listaCarrito = JSON.parse(sessionStorage.getItem("productosCarrito")) || [];
    tabla.innerHTML = "";
    var totalPagar = 0;

    if (listaCarrito.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" class="text-center">El carrito está vacío</td></tr>';
        if (elementoTotal) elementoTotal.innerText = "$0";
        return;
    }

    for (var i = 0; i < listaCarrito.length; i++) {
        var prod = listaCarrito[i];
        totalPagar += prod.precio;

        var fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${prod.nombre}</td>
            <td>$${prod.precio.toLocaleString("es-CL")}</td>
            <td>1</td>
            <td>$${prod.precio.toLocaleString("es-CL")}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${i})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    }

    if (elementoTotal) {
        elementoTotal.innerText = "$" + totalPagar.toLocaleString("es-CL");
    }
}

function eliminarDelCarrito(posicion) {
    var listaCarrito = JSON.parse(sessionStorage.getItem("productosCarrito")) || [];
    listaCarrito.splice(posicion, 1);
    sessionStorage.setItem("productosCarrito", JSON.stringify(listaCarrito));
    cargarTablaCarrito();
    actualizarContadorMenu(); // Añadido para que se actualice el contador al eliminar
}

// Nueva función para finalizar la compra
function finalizarCompra() {
    var listaCarrito = JSON.parse(sessionStorage.getItem("productosCarrito")) || [];
    
    // Validamos que haya productos
    if (listaCarrito.length === 0) {
        alert("El carrito está vacío. ¡Agrega productos antes de finalizar!");
        return;
    }
    
    // Entregamos el mensaje y esperamos a que el usuario presione Aceptar
    alert("¡Gracias por tu compra en FitLab!");
    
    // Vaciamos el carrito
    sessionStorage.removeItem("productosCarrito"); 
    
    // Redirigimos al inicio
    window.location.href = "index.html";
}

// Registro
function registrarUsuario() {
    var campoNombre = document.getElementById("regNombre");
    var campoCorreo = document.getElementById("regCorreo");
    var campoClave = document.getElementById("regClave");

    var nombre = campoNombre ? campoNombre.value : "";
    var correo = campoCorreo ? campoCorreo.value : "";
    var clave = campoClave ? campoClave.value : "";

    if (nombre.trim() == "" || correo.trim() == "" || clave.trim() == "") {
        alert("Por favor completa todos los campos.");
        if (campoNombre) campoNombre.value = "";
        if (campoCorreo) campoCorreo.value = "";
        if (campoClave) campoClave.value = "";
        return;
    }

    if (clave.length < 4) {
        alert("La contraseña debe tener 4 o más dígitos.");
        if (campoNombre) campoNombre.value = "";
        if (campoCorreo) campoCorreo.value = "";
        if (campoClave) campoClave.value = "";
        return;
    }

    if (!correo.endsWith("@gmail.com") && !correo.endsWith("@duocuc.cl")) {
        alert("El correo debe contener @gmail.com o @duocuc.cl");
        if (campoNombre) campoNombre.value = "";
        if (campoCorreo) campoCorreo.value = "";
        if (campoClave) campoClave.value = "";
        return;
    }

    alert("¡Usuario registrado con éxito!");
    window.location.href = "login.html";
}

// Login
function iniciarSesion() {
    var campoCorreo = document.getElementById("correoLogin");
    var campoClave = document.getElementById("claveLogin");

    var correo = campoCorreo ? campoCorreo.value : "";
    var clave = campoClave ? campoClave.value : "";

    if (correo.trim() == "" || clave.trim() == "") {
        alert("Por favor completa todos los campos.");
        if (campoCorreo) campoCorreo.value = "";
        if (campoClave) campoClave.value = "";
        return;
    }

    if (clave.length < 4) {
        alert("Error de contraseña: debe tener 4 o más dígitos.");
        if (campoCorreo) campoCorreo.value = "";
        if (campoClave) campoClave.value = "";
        return;
    }

    if (!correo.endsWith("@gmail.com") && !correo.endsWith("@duocuc.cl")) {
        alert("Correo inválido: debe contener @ y terminar en gmail.com o duocuc.cl");
        if (campoCorreo) campoCorreo.value = "";
        if (campoClave) campoClave.value = "";
        return;
    }

    alert("¡Bienvenido a FitLab!");
    window.location.href = "index.html";
}

// Hoja de administracion

// Inventario inicial
function obtenerInventario() {
    var inventarioGuardado = sessionStorage.getItem("inventarioFitLab");
    if (inventarioGuardado) {
        return JSON.parse(inventarioGuardado);
    } else {
        var inventarioBase = [
            { nombre: "Proteina Whey 1kg", stock: 10 },
            { nombre: "Creatina Monohidratada 300g", stock: 8 },
            { nombre: "Pre-entreno BCAA 500g", stock: 15 },
            { nombre: "Glutamina 300g", stock: 5 },
            { nombre: "Multivitaminico 90 Caps", stock: 12 },
            { nombre: "Aminoacidos BCAA 300g", stock: 20 }
        ];
        sessionStorage.setItem("inventarioFitLab", JSON.stringify(inventarioBase));
        return inventarioBase;
    }
}

// Cargar stock 
function cargarTablaAdmin() {
    var tablaAdmin = document.getElementById("tablaStock");
    if (!tablaAdmin) return;

    var tbody = tablaAdmin.querySelector("tbody");
    if (!tbody) return;

    var inventario = obtenerInventario();
    tbody.innerHTML = "";

    for (var i = 0; i < inventario.length; i++) {
        var item = inventario[i];
        var fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${item.nombre}</td>
            <td><b class="${item.stock === 0 ? 'text-danger' : 'text-success'}">${item.stock} u.</b></td>
            <td>
                <button class="btn btn-sm btn-success me-1" onclick="modificarStock(${i}, 1)">+1 Stock</button>
                <button class="btn btn-sm btn-warning" onclick="modificarStock(${i}, -1)">-1 Stock</button>
            </td>
        `;
        tbody.appendChild(fila);
    }
}

// actualizar producto
function modificarStock(posicion, cambio) {
    var inventario = obtenerInventario();
    
    if (inventario[posicion].stock + cambio < 0) {
        alert("El producto ya se encuentra sin stock.");
        return;
    }

    inventario[posicion].stock += cambio;
    sessionStorage.setItem("inventarioFitLab", JSON.stringify(inventario));
    cargarTablaAdmin();
}

// Agregar producto
function agregarProductoNuevo(event) {
    if (event) event.preventDefault();

    var campoNombre = document.getElementById("nuevoNombreProd");
    var campoStock = document.getElementById("nuevoStockProd");

    var nombre = campoNombre ? campoNombre.value.trim() : "";
    var stock = campoStock ? parseInt(campoStock.value) : 0;

    // Validación
    if (nombre == "" || isNaN(stock)) {
        alert("Por favor completa todos los campos del producto.");
        if (campoNombre) campoNombre.value = "";
        if (campoStock) campoStock.value = "";
        return;
    }

    if (stock < 0) {
        alert("El stock inicial no puede ser negativo.");
        if (campoStock) campoStock.value = "";
        return;
    }

    // Agregar al inventario
    var inventario = obtenerInventario();
    inventario.push({ nombre: nombre, stock: stock });
    sessionStorage.setItem("inventarioFitLab", JSON.stringify(inventario));

    alert("¡Producto registrado con éxito en el inventario!");

    // refrescar tabla
    if (campoNombre) campoNombre.value = "";
    if (campoStock) campoStock.value = "";
    cargarTablaAdmin();
}

window.onload = function() {
    actualizarContadorMenu();
    cargarTablaCarrito();
    cargarTablaAdmin();
};
