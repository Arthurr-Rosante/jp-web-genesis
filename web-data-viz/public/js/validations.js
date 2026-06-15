function validateUsername(ipt) {
    ipt.classList.add("has-errors");
    
    const username = String(ipt.value).trim();
    const authMessage = document.getElementById(`${ipt.id}-auth-message`);
    
    authMessage.innerText = "";
    
    if(username === "") {
        authMessage.innerText = "Nome de Usuário é um campo obrigatório.";
        return
    }
    
    if(username.length < 3) {
        authMessage.innerText = "Nome de Usuário deve conter ao menos 3 caracteres.";
        return
    }
    
    ipt.classList.remove("has-errors");
}

function validateEmail(ipt) {
    ipt.classList.add("has-errors");
    
    const email = String(ipt.value).trim();
    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    const authMessage = document.getElementById(`${ipt.id}-auth-message`);
    
    authMessage.innerText = "";

    if(email == "") {
        authMessage.innerText = "Endereço de email é um campo obrigatório.";
        return
    }

    if(!emailRegex.test(email)) {
        authMessage.innerText = "Endereço de email inválido.";
        return
    }

    ipt.classList.remove("has-errors");
}

function validatePassword(ipt, checkConfirm = false) {
    ipt.classList.add("has-errors");
    
    const password = String(ipt.value).trim();
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^\w\s]).{6,}$/;
    const authMessage = document.getElementById(`${ipt.id}-auth-message`);
    
    authMessage.innerText = "";

    if(password == "") {
        authMessage.innerText = "Senha é um campo obrigatório.";
        return
    }

    if(!passwordRegex.test(password)) {
        authMessage.innerText = "Senha deve conter no mínimo 6 caracteres; 1 caractere maiúsculo; 1 caractere minúsculo; 1 caractere especial";
        return
    }

    if(checkConfirm) {
        const confirmPassword = document.getElementById("ipt-password");
        if(confirmPassword.value !== password){
           authMessage.innerText = "As senhas não coincidem.";
           return
        }
    }

    ipt.classList.remove("has-errors");
}