import functions_framework
from google.cloud import bigquery
from google.auth import default
import pandas_gbq
import pandas as pd
from flask import jsonify
from datetime import datetime

import requests

PROJECT_ID = "massuh-420617"

@functions_framework.http
def edit_customers(request):
  """
  Função para processar requests da endpoint customers
  Parâmetros de entrada:
    - customer_id
    - field_label
    - value
    - edited_by
  """

  CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "3600",
  }

  headers = {
      'Access-Control-Allow-Origin': '*'
  }
  
  if request.method=='OPTIONS':
    return "", 204, CORS_HEADERS
  
  request_json = request.get_json(silent=True)

  print(f"Processing: {request_json}")

  customer_id = request_json.get('customer_id')
  version_date = datetime.now()
  field_label = request_json.get('field_label')
  value = request_json.get('value')
  edited_by = request_json.get('edited_by')

  if all([customer_id, field_label, value, edited_by]):
    # Inser row in bigquery
    try:
      data = [{
        'customer_id': customer_id,
        'version_date': version_date,
        'field_label': field_label,
        'value': value,
        'edited_by': edited_by
      }]
      df = pd.DataFrame(data)
      to_biquery('raw_data.customer_editions', df.astype(str), 'append')
      return "Dados atualizados com sucesso", 200, headers
    except Exception as e:
      return str(e)
  else:
    return "Parâmetros customer_id, field_label, value, edited_by invalidos, verifique e tente novamente"

  



def to_biquery(table_name, dataframe, method):
    """
        Enviar dados para o Bigquery
    """
    credentials, project_id = default()

    dataframe =dataframe.astype(str)
    dataframe.to_gbq(
        destination_table=table_name, 
        project_id=PROJECT_ID,
        credentials=credentials,
        if_exists=method #replace
    )



###### API Painel ZAP
API_KEY = '5f6cf40d-56d9-4ef9-9206-1da4366ac1e0'

def get_custom_fields():
  url = "https://conectawebhook.com.br/api/v1/webhook/custom_fields/"

  headers = {
      'accept': 'application/json',
      'API-KEY': API_KEY
  }

  request = requests.request("GET", url=url, headers=headers)

  if request.status_code == 200:
    data = request.json()
    return data

  else:
    print(f"Falha na requisição [{request.status_code}]{request.text}")


def painelzap_edit_custom_field_value(subscriber_id, field_label, custom_field_value):
  custom_field_id = get_field_id_from_label(field_label)
  # Implementar
  url = f"conectawebhook.com.br/api/v1/webhook/subscriber/{subscriber_id}/custom_fields/{custom_field_id}/"