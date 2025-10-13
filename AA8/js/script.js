function validarCPF(cpf) {
    // Remove tudo que não for número
    cpf = cpf.replace(/[^\d]+/g, '');

    // Verifica se tem 11 dígitos ou é uma sequência repetida (tipo 111.111.111-11)
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    if (digito1 !== Number(cpf[9])) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    if (digito2 !== Number(cpf[10])) return false;

    return true;
}

function verificarCampos() {
    const emailInput = document.getElementById('e-mail');
    const senhaInput = document.getElementById('login-password');
    const btnEntrar = document.getElementById('botaoLogin');

    const emailPreenchido = emailInput.value.trim() !== '';
    const senhaPreenchida = senhaInput.value.trim() !== '';

    btnEntrar.disabled = !(emailPreenchido && senhaPreenchida);
}

// Eventos continuam iguais
document.getElementById('e-mail').addEventListener('input', verificarCampos);
document.getElementById('login-password').addEventListener('input', verificarCampos);