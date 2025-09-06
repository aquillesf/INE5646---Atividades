function tratadorDeCliqueExercicio2() {
    const agora = new Date();
    let horas =(agora.getHours());
    let minutos = (agora.getMinutes());
    let segundos = (agora.getSeconds());
    alert(`${horas}PM : ${minutos}m : ${segundos}s`);
}