document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('clave');

        if (!emailInput.value || !passwordInput.value) {
            alert('Por favor, complete todos los campos.');
        } else {
            loginForm.submit();
        }
    });
});
