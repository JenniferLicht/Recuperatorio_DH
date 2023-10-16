document.addEventListener("DOMContentLoaded", function () {
    const guardarCambiosButton = document.getElementById("guardarCambiosButton");

    guardarCambiosButton.addEventListener("click", async function () {
        const editForm = document.getElementById("editForm");
        const formData = new FormData(editForm);

        try {
            const response = await fetch('/user/editActiveDataUser', {
                method: 'POST',
                body: formData,
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