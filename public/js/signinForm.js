document.addEventListener("DOMContentLoaded", function () {
    const registrarseButton = document.getElementById("registrarseButton");
    const mensajeContainer = document.getElementById("mensaje-container");

    registrarseButton.addEventListener("click", async function () {
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const email = document.getElementById("email").value;
        const clave = document.getElementById("clave").value;
        const confirmarClave = document.getElementById("confirmarClave").value;
        const esAdmin = document.getElementById("esAdmin").checked;

        const data = {
            nombre,
            apellido,
            email,
            clave,
            confirmarClave,
            esAdmin
        };

        try {
            const response = await fetch("/user/signinProcess", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (response.ok) {
                mostrarMensaje(result.mensaje, "success");
            } else {
                mostrarMensaje(result.mensaje, "error");
            }
        } catch (error) {
            mostrarMensaje(error, "error");
        }
    });

    function mostrarMensaje(mensaje, tipo) {
        mensajeContainer.style.display = "block";
        mensajeContainer.textContent = mensaje;

        if (tipo === "success") {
            mensajeContainer.style.color = "green";
        } else if (tipo === "error") {
            mensajeContainer.style.color = "red";
        }
    }
});
