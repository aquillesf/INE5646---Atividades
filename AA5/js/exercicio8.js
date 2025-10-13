function obterRegiaoFiscalAtravesDoCPFInformado(cpfInformado) {
    
    let regiaoFiscal = undefined
    console.log(cpfInformado)

    const regioes = {
        1: ["DF", "GO", "MT", "MS", "TO"],
        2: ["AC", "AP", "AM", "PA", "RO", "RR"],
        3: ["CE", "MA", "PI"],
        4: ["AL", "PB", "PE", "RN"],
        5: ["BA", "SE"],
        6: ["MG"],
        7: ["ES", "RJ"],
        8: ["SP"],
        9: ["PR", "SC"],
        0: ["RS"]
    };

    const digito = parseInt(cpfInformado[8]); 
    regiaoFiscal = regioes[digito];
    return regiaoFiscal;
}




function tratadorDeCliqueExercicio8() {
    let textCPF = document.getElementById("textCPF")
	let textRegiao = document.getElementById("regiaoFiscal")

    const regiaoFiscal = obterRegiaoFiscalAtravesDoCPFInformado(textCPF.value);
    textRegiao.textContent = "Região fiscal: "+regiaoFiscal
}
