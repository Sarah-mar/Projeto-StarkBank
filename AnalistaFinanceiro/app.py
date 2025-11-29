import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    # Ganhos
    df_ganhos = pd.read_csv("./data/ganhos_faker.csv") # ALTERE PARA O SEU CAMINHO
        # Datetime
    df_ganhos['data_emissao'] = pd.to_datetime(df_ganhos['data_emissao'])
    df_ganhos['data_vencimento'] = pd.to_datetime(df_ganhos['data_vencimento'])
        # 1y
    dre_ganhos = df_ganhos[df_ganhos['data_vencimento'] >= pd.Timestamp(2024, 12, 1)]
        # Ganhos Mensais
    ganhos_mensais = dre_ganhos.groupby(dre_ganhos['data_vencimento'].dt.to_period('M'))['valor'].sum().reset_index()
    ganhos_mensais.rename(columns={'data_vencimento': 'mês', 'valor': 'receita'}, inplace=True)
    ganhos_mensais.drop(index=12, inplace=True)

    # Gastos
    df_gastos = pd.read_csv("./data/gastos_faker.csv")
        # Datetime
    df_gastos['data_vencimento'] = pd.to_datetime(df_gastos['data_vencimento'])
        # 1y
    dre_gastos = df_gastos[df_gastos['data_vencimento'] >= pd.Timestamp(2024, 12, 1)]
        # Gastos Mensais
    gastos_mensais = dre_gastos.groupby(dre_gastos['data_vencimento'].dt.to_period('M'))['valor'].sum().reset_index()
    gastos_mensais.rename(columns={'data_vencimento': 'mês', 'valor': 'despesa'}, inplace=True)

    # Datetime para String
    ganhos_mensais['mês'] = ganhos_mensais['mês'].astype(str)
    gastos_mensais['mês'] = gastos_mensais['mês'].astype(str)

except Exception as e:
    print(f"Erro ao carregar dados: {e}")
    ganhos_mensais = pd.DataFrame()
    gastos_mensais = pd.DataFrame()

# Rotas de API

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "online",
        "endpoints": [
            "/api/ganhos",
            "/api/gastos"
        ]
    })

@app.route('/api/ganhos', methods=['GET'])
def get_ganhos():
    return jsonify(ganhos_mensais.to_dict(orient='records'))

@app.route('/api/gastos', methods=['GET'])
def get_gastos():
    return jsonify(gastos_mensais.to_dict(orient='records'))

# Execução do Servidor
if __name__ == '__main__':
    app.run(debug=True, port=5000)

print(get_ganhos())
print(get_gastos())