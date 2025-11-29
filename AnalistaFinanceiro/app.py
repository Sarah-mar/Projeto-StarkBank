import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def dre_to_mensal(dre, valor_final):
    mensal = dre.groupby(dre['data_vencimento'].dt.to_period('M'))['valor'].sum().reset_index()
    mensal.rename(columns={'data_vencimento': 'mes', 'valor': valor_final}, inplace=True)

    return mensal

try:
    # Ganhos
    df_ganhos = pd.read_csv("data/ganhos_faker.csv") # ALTERE PARA O SEU CAMINHO
        # Datetime
    df_ganhos['data_emissao'] = pd.to_datetime(df_ganhos['data_emissao'])
    df_ganhos['data_vencimento'] = pd.to_datetime(df_ganhos['data_vencimento'])
        # 1y
    dre_ganhos = df_ganhos[df_ganhos['data_vencimento'] >= pd.Timestamp(2024, 12, 1)]
        # Ganhos Mensais
    receita_bruta = dre_to_mensal(dre_ganhos, 'receita_bruta')
    receita_bruta.drop(index=12, inplace=True)

    # Gastos
    df_gastos = pd.read_csv("data/gastos_faker.csv") # ALTERE PARA O SEU CAMINHO
        # Datetime
    df_gastos['data_vencimento'] = pd.to_datetime(df_gastos['data_vencimento'])
        # 1y
    dre_gastos = df_gastos[df_gastos['data_vencimento'] >= pd.Timestamp(2024, 12, 1)]
        # Gastos Mensais
    despesa_bruta = dre_to_mensal(dre_gastos, 'despesa_bruta')

    # Despesas
    desp_operacionais = ['Salários', 'Aluguel/Infra', 'Marketing']
    desp_custos = ['Software/Saas', 'Confraternização', 'Impostos', 'Viagens', 'Equipamentos']

    # Custos
    dre_custos = dre_gastos[dre_gastos['categoria'].isin(desp_custos)]
        # Custos Mensais
    custos = dre_to_mensal(dre_custos, 'custos')

    # Despesas Operacionais
    dre_operacionais = dre_gastos[dre_gastos['categoria'].isin(desp_operacionais)]
        # Despesas Operacionais Mensais
    despesas_operacionais = dre_to_mensal(dre_operacionais, 'despesas_operacionais')

    # Lucro Bruto
    lucro_bruto = receita_bruta.merge(custos, on='mes')
    lucro_bruto['lucro_bruto'] = lucro_bruto['receita_bruta'] - lucro_bruto['custos']
    lucro_bruto = lucro_bruto[['mes', 'lucro_bruto']]

    # Lucro Líquido
    lucro_liquido = lucro_bruto.merge(despesas_operacionais, on='mes')
    lucro_liquido['lucro_liquido'] = lucro_liquido['lucro_bruto'] - lucro_liquido['despesas_operacionais']
    lucro_liquido = lucro_liquido[['mes', 'lucro_liquido']]

    # Datetime para String
    receita_bruta['mes'] = receita_bruta['mes'].astype(str)
    despesa_bruta['mes'] = despesa_bruta['mes'].astype(str)
    custos['mes'] = custos['mes'].astype(str)
    despesas_operacionais['mes'] = despesas_operacionais['mes'].astype(str)
    lucro_bruto['mes'] = lucro_bruto['mes'].astype(str)
    lucro_liquido['mes'] = lucro_liquido['mes'].astype(str)

except Exception as e:
    print(f"Erro ao carregar dados: {e}")
    receita_bruta = pd.DataFrame()
    despesa_bruta = pd.DataFrame()
    custos = pd.DataFrame()
    despesas_operacionais = pd.DataFrame()
    lucro_bruto = pd.DataFrame()
    lucro_liquido = pd.DataFrame()

# Rotas de API

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "online",
        "endpoints": [
            "/api/receita_bruta",
            "/api/despesa_bruta",
            "/api/custos",
            "/api/despesas_operacionais",
            "/api/lucro_bruto",
            "/api/lucro_liquido"
        ]
    })

@app.route('/api/receita_bruta', methods=['GET'])
def get_receita_bruta():
    return jsonify(receita_bruta.to_dict(orient='records'))

@app.route('/api/despesa_bruta', methods=['GET'])
def get_despesa_bruta():
    return jsonify(despesa_bruta.to_dict(orient='records'))

@app.route('/api/custos', methods=['GET'])
def get_custos():
    return jsonify(custos.to_dict(orient='records'))

@app.route('/api/despesas_operacionais', methods=['GET'])
def get_despesas_operacionais():
    return jsonify(despesas_operacionais.to_dict(orient='records'))

@app.route('/api/lucro_bruto', methods=['GET'])
def get_lucro_bruto():
    return jsonify(lucro_bruto.to_dict(orient='records'))

@app.route('/api/lucro_liquido', methods=['GET'])
def get_lucro_liquido():
    return jsonify(lucro_liquido.to_dict(orient='records'))

@app.route('/api/grafico_DRE', methods=['GET'])
def get_grafico_DRE():
    grafico_DRE_data = {
        "receitas": receita_bruta.to_dict(orient='records'),
        "despesas": despesa_bruta.to_dict(orient='records'),
    }
    return jsonify(grafico_DRE_data)

@app.route('/api/tabela_DRE', methods=['GET'])
def get_tabela_DRE():
    tabela_DRE_data = {
        "receitaBruta": receita_bruta.to_dict(orient='records'),
        "custos": custos.to_dict(orient='records'),
        "lucroBruto": lucro_bruto.to_dict(orient='records'),
        "despesasOperacionais": despesas_operacionais.to_dict(orient='records'),
        "lucroLiquido": lucro_liquido.to_dict(orient='records'),
    }
    return jsonify(tabela_DRE_data)

# Execução do Servidor
if __name__ == '__main__':
    app.run(debug=True, port=5000)
