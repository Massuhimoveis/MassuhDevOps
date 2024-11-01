import functions_framework
from google.cloud import bigquery
from google.auth import default
import pandas_gbq
import pandas as pd
from flask import jsonify

PROJECT_ID = "massuh-420617"

@functions_framework.http
def get_customers(request):
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
    
    query = "SELECT * FROM `model.customers`"
    
    if request_args.get('customer_id'):
      query += f" WHERE customer_id = '{request_args.get('customer_id')}'"
    
    query += " ORDER BY ATENDIMENTO, TEMPO_SEM_CONTATO"
    data = from_bigquery(query).to_json(orient='records')
    
    return jsonify(data), 200, headers
  


def from_bigquery(query):
    credentials, project_id = default()
    client = bigquery.Client(credentials=credentials, project=PROJECT_ID)

    query_job = client.query(query)

    results = query_job.result().to_dataframe()
    return results

