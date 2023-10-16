document.addEventListener("DOMContentLoaded", function () {
    const cambiarContrasenaButton = document.getElementById("cambiarContrasenaButton");

    cambiarContrasenaButton.addEventListener("click", async function () {
        const contrasenaActual = document.getElementById("contrasenaActual").value;
        const nuevaContrasena = document.getElementById("nuevaContrasena").value;
        const repetirContrasena = document.getElementById("repetirContrasena").value;

        if (nuevaContrasena !== repetirContrasena) {
            mostrarMensaje("Las nueva contraseña y la confirmacion no coinciden. Por favor, reintente.", "error");
            return;
        }


        const data = {
            contrasenaActual,
            nuevaContrasena,
            repetirContrasena
        };

        try {
            const response = await fetch("/user/changePassword?_method=PATCH", {
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
            mostrarMensaje("Error al realizar la solicitud", "error");
        }
    });



    function mostrarMensaje(mensaje, tipo) {
        const mensajeContainer = document.getElementById("mensaje-container");
        mensajeContainer.style.display = "block";
        mensajeContainer.textContent = mensaje;

        if (tipo === "success") {
            mensajeContainer.style.color = "green";
        } else if (tipo === "error") {
            mensajeContainer.style.color = "red";
        }
    }
});
