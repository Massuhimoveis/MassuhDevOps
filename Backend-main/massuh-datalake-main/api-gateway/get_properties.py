import functions_framework
from google.cloud import bigquery
from google.auth import default
import pandas_gbq
import pandas as pd
from flask import jsonify

PROJECT_ID = "massuh-420617"

@functions_framework.http
def get_properties(request):
  # Função para processar requests da endpoint customers
  request_json = request.get_json(silent=True)
  request_args = request.args
  data = None

  CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "3600",
  }

  headers = {
      'Access-Control-Allow-Origin': '*'
  }
  
  if request:
    if request.method=='OPTIONS':
      return "", 200, CORS_HEADERS
    query = "SELECT * FROM `model.properties`"
    if request_args.get('url_imovel'):
      query += f" WHERE url_imovel like '%{request_args.get('url_imovel')}%'"
    elif request_args.get('bairro'):
      query += f" WHERE lower(bairro) like lower('%{request_args.get('bairro')}%')"
    query += " ORDER BY dt_atualizacao DESC"
    
    # Adiciona suporte a paginação
    limit = int(request_args.get('limit', 100))  # Limite padrão 100
    offset = int(request_args.get('offset', 0))  # Offset padrão 0
    query += f" LIMIT {limit} OFFSET {offset}"

    print(f"Executando query: {query}")
    results_df = from_bigquery(query)
    total_rows = results_df.shape[0]
    data = results_df.to_json(orient='records', force_ascii=False)

    response = {
      'data': data,
      'limit': limit,
      'offset': offset,
      'total': total_rows
    }
    
    return response, 200, headers

  


def from_bigquery(query):
    credentials, project_id = default()
    client = bigquery.Client(credentials=credentials, project=PROJECT_ID)

    query_job = client.query(query)

    results = query_job.result().to_dataframe()
    return results

