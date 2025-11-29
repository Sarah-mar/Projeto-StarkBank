
//Gráfico interativo da Demonstração de Resultados
const ctx = document.getElementById("income-statement-chart");

//pega os últimos 12 meses para gerar o gráfico
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


//Cria o gráfico com despesas e receitas
async function generateChart() {
	const response = await fetch("http://127.0.0.1:5000/api/grafico_DRE");

	const json = await response.json()

	const receitas = json.receitas.map(r => r.receita_bruta)
	const despesas = json.despesas.map(d => d.despesa_bruta)

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


// Abre e fecha a overlay (DRE detalhada)
document.getElementById("income-statement-overlay-button").onclick = function () {
	document.getElementById("income-statement-overlay").classList.remove("hidden-income-statement-overlay");
	document.body.style.overflow = "hidden"
};

document.getElementById("income-statement-overlay-close").onclick = function () {
	document.getElementById("income-statement-overlay").classList.add("hidden-income-statement-overlay");
	document.body.style.overflow = "auto"
};

document.body.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		document.getElementById("income-statement-overlay").classList.add("hidden-income-statement-overlay");
		document.body.style.overflow = "auto"
	}
})

// Cria a tabela de DRE detalhada
async function fetchTable() {
	const response = await fetch("http://127.0.0.1:5000/api/tabela_DRE")

	const json = await response.json()

	const receitaBruta = json.receitaBruta.map(rb => rb.receita_bruta);
	const custos = json.custos.map(c => c.custos);
	const lucroBruto = json.lucroBruto.map(lb => lb.lucro_bruto);
	const despesasOperacionais = json.despesasOperacionais.map(d => d.despesas_operacionais);
	const lucroLiquido = json.lucroLiquido.map(ll => ll.lucro_liquido);

	const receitaBrutaRow = document.getElementById("gross-income-values");
	const custosRow = document.getElementById("cost-values");
	const lucroBrutoRow = document.getElementById("gross-profit-values");
	const despesasOperacionaisRow = document.getElementById("operational-expenses-values");
	const lucroLiquidoRow = document.getElementById("net-profit-values");

	fillTable(receitaBruta, receitaBrutaRow);
	fillTable(custos, custosRow);
	fillTable(lucroBruto, lucroBrutoRow);
	fillTable(despesasOperacionais, despesasOperacionaisRow);
	fillTable(lucroLiquido, lucroLiquidoRow);
}

function fillTable(valores, row) {
	valores.forEach(column => {
		const th = document.createElement("td");
		th.textContent = toCurrency(column);
		row.appendChild(th);
	});
}

function fillTableHeader() {
	const headRow = document.getElementById("income-statement-table-header");
	labels.forEach(column => {
		const th = document.createElement("th");
		th.textContent = column;
		headRow.appendChild(th);
	});
}

function toCurrency(value) {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	}).format(value);
}

fillTableHeader()
fetchTable()