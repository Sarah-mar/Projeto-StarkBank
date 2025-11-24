function redirectToHome() {
    window.location.href = "home.html";
}

function redirectToPlanejamentoFinanceiro() {
    window.location.href = "plan_financeiro.html";
}

function redirectToAnaliseDeCustos() {
    window.location.href = "analise_custos.html";
}

document.querySelector("#analista-financeiro-btn").onclick = redirectToHome;
document.querySelector("#planejamento-financeiro-btn").onclick = redirectToPlanejamentoFinanceiro;
document.querySelector("#analise-de-custos-btn").onclick = redirectToAnaliseDeCustos;
document.querySelector("#home-button-link-planejamento-financeiro").onclick = redirectToPlanejamentoFinanceiro;
document.querySelector("#home-button-link-analise-custos").onclick = redirectToAnaliseDeCustos;

