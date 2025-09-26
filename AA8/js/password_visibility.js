function mostrarSenha() {
    document.getElementById('login-password').type = 'text';
}

function ocultarSenha() {
    document.getElementById('login-password').type = 'password';
}

function alternarSenha() {
    const senhaInput = document.getElementById('login-password');
    const olhoIcon = document.getElementById('olho');

    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        // Altere para um ícone de "olho aberto" se quiser
        olhoIcon.src = 'https://cdn-icons-png.flaticon.com/512/159/159604.png'; // ícone de olho aberto
    } else {
        senhaInput.type = 'password';
        // Ícone de olho fechado
        olhoIcon.src = 'https://cdn0.iconfinder.com/data/icons/ui-icons-pack/100/ui-icon-pack-14-512.png'; // ícone original
    }
}