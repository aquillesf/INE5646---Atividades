
function calculadora(a, b, f){
    if (f === "somar"){
        return somar(a, b);
    }

    else if (f === "subtrair"){
        return subtrair(a, b);
    }
}

function somar(a, b){
    return a + b;
}

function subtrair(a, b){   
    return a - b;
}

console.log(calculadora(31, 12, "somar"));
console.log(calculadora(11, 25, "subtrair"));


function consoleAtrasado(mensagem, atraso) {
    setTimeout(() => console.log(mensagem), atraso)
}

console.log("Olá")
consoleAtrasado("Teste", 10000)
console.log("Bye")

let i = 0;
let max = 10;
async function p() {
    while (i < max) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(i++);
    }
}

p();