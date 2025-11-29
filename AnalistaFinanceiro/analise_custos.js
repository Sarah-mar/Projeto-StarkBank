
//Gráfico interativo da Demonstração de Resultados
const ctx = document.getElementById("income-statement-chart");

function getLast12Months() {
	const monthNames = [
		"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
		"Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
	];

	const today = new Date();
	const months = [];

	for (let i = 11; i >= 0; i--) {
		const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
		months.push(`${monthNames[date.getMonth()]}/${date.getFullYear()}`);
	}

	return months;
}

const labels = getLast12Months()

//criar gráfico com despesas e receitas

async function generateChart() {
	const responseGanhos = await fetch("http://127.0.0.1:5000/api/ganhos");
	const responseGastos = await fetch("http://127.0.0.1:5000/api/gastos");

	const jsonGanhos = await responseGanhos.json()
	const jsonGastos = await responseGastos.json()

	const receitas = jsonGanhos.map(j => j.receita)
	const despesas = jsonGastos.map(j => j.despesa)

	if (receitas.length && despesas.length) {
		new Chart(ctx, {
			type: "bar",
			data: {
				labels: labels,
				datasets: [
					{
						label: "Receitas",
						data: receitas,
						backgroundColor: "#637282b9"
					},
					{
						label: "Despesas",
						data: despesas,
						backgroundColor: "rgba(247, 109, 153, 0.95)"
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						labels: {
							usePointStyle: true,
							pointStyle: 'circle',
							padding: 20,
							font: {
								size: 14
							}
						},
						position: "top"
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								const valor = context.raw;
								return context.dataset.label + ": " + valor.toLocaleString("pt-BR", {
									style: "currency",
									currency: "BRL"
								});
							}
						}
					}
				},
				scales: {
					x: {
						stacked: false
					},
					y: {
						stacked: false,
						ticks: {
							callback: function (valor) {
								return valor.toLocaleString("pt-BR", {
									style: "currency",
									currency: "BRL"
								});
							}
						}
					}
				}
			}
		});
		document.querySelector(".loading").style.display = "none";
	}
}

generateChart()

document.getElementById("income-statement-overlay-button").onclick = function () {
	document.getElementById("income-statement-overlay").classList.remove("hidden-income-statement-overlay");
};

document.getElementById("income-statement-overlay-close").onclick = function () {
	document.getElementById("income-statement-overlay").classList.add("hidden-income-statement-overlay");
};

document.body.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		document.getElementById("income-statement-overlay").classList.add("hidden-income-statement-overlay");
	}
})

const headRow = document.getElementById("income-statement-table-header");

labels.forEach(column => {
	const th = document.createElement("th");
	th.textContent = column;
	headRow.appendChild(th);
});


const firstRow = document.getElementById("lucro-bruto-valores")

valores = [12, 32, 42, 12, 31, 41, 41, 12]

valores.forEach(column => {
	const th = document.createElement("th");
	th.textContent = column;
	firstRow.appendChild(th);
});