function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const inputIcon = document.getElementById(`${inputId}-icon`);


    if(input.type === "password") {
        input.type = "text";
        inputIcon.className = "ph ph-eye-slash";
    } else {
        input.type = "password";
        inputIcon.className = "ph ph-eye";
    }
}