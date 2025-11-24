const xValues = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const cashFlow = document.querySelector("#cash-flow");

new Chart(cashFlow, {
	type: "line",
	data: {
		labels: xValues,
		datasets: [{
			label: "Saldo total",
			data: [860, 1140, 1060, 1060, 1070, 1110, 1330, 2210, 7830, 2478, 3435, 5135],
			pointBackgroundColor: "#0070E0",
			borderColor: "#0070E0",
			fill: false
		}, {
			label: "Saldo acumulado",
			data: [1600, 1700, 1700, 1900, 2000, 2700, 4000, 5000, 6000, 7000, 8000, 9000],
			pointBackgroundColor: "#707072",
			borderColor: "#707072",
			fill: false
		}]
	},
	options: {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				labels: {
					usePointStyle: true,
					pointStyle: 'circle',
					padding: 20,
					font: {
						size: 14
					}
				}
			},
			tooltip: {
				callbacks: {
					label: function (context) {
						return context.dataset.label + ": " +
							new Intl.NumberFormat('pt-BR', {
								style: 'currency',
								currency: 'BRL'
							}).format(context.parsed.y);
					}
				}
			}
		},
		scales: {
			x: {
				title: {
					display: true,
					text: 'Meses',
					font: { size: 16, weight: 'bold' }
				}
			},
			y: {
				title: {
					display: true,
					text: 'Valor total (R$)',
					font: { size: 16, weight: 'bold' }
				},
				ticks: {
					callback: function (value) {
						return new Intl.NumberFormat('pt-BR', {
							style: 'currency',
							currency: 'BRL'
						}).format(value);
					}
				}
			}
		}
	}
});