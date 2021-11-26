const visibilityTogglePassword = document.querySelector('.visibilityPassword');
const inputPassword = document.querySelector('.form-password .inputPassword');

var password = true;

visibilityTogglePassword.addEventListener('click', function() {
    if (password) {
        inputPassword.setAttribute('type', 'text');
        visibilityTogglePassword.innerHTML = "visibility";
    } else {
        inputPassword.setAttribute('type', 'password');
        visibilityTogglePassword.innerHTML = "visibility_off";
    }
    password = !password;
});

const visibilityToggleConfirmPassword = document.querySelector('.visibilityConfirmPassword');
const inputConfirmPassword = document.querySelector('.form-password .inputConfirmPassword');

var confirmPassword = true

visibilityToggleConfirmPassword.addEventListener('click', function() {
    if (confirmPassword) {
        inputConfirmPassword.setAttribute('type', 'text');
        visibilityToggleConfirmPassword.innerHTML = "visibility";
    } else {
        inputConfirmPassword.setAttribute('type', 'password');
        visibilityToggleConfirmPassword.innerHTML = "visibility_off";
    }
    confirmPassword = !confirmPassword;
});