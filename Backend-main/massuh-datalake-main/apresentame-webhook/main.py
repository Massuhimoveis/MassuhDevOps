import functions_framework
from google.cloud import bigquery
from google.auth import default
from uuid import uuid4
from datetime import datetime
import json
import pandas as pd


PROJECT_ID = "massuh-420617"


@functions_framework.http
def process_callback(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    request_json = request.get_json(silent=True)
    request_args = request.args

    if request_json:
      try:
        credentials, project_id = default()
        client = bigquery.Client(credentials=credentials, project=PROJECT_ID)
        now = datetime.now()
        body = request.get_json()
        headers = dict(request.headers)
        query = request.args

        callback_event_row = {
          '_source': "apresentame",
          'guid': str(uuid4()),
          'time': datetime.timestamp(now),
          '_datetime': now.strftime("%Y-%m-%d %H:%M:%S"),
          'body': json.dumps(body),
          'query': json.dumps(query),
          'headers': json.dumps(headers)
        }

        # Insert the callback event data into BigQuery
        dataset_id = 'raw_data'
        table_id = 'callback_events_clustered'
        table_ref = client.dataset(dataset_id).table(table_id)
        table = client.get_table(table_ref)  # Make sure the table exists.
        client.insert_rows_json(table, [callback_event_row])
        print("Request salvo no BigQuery com sucesso!")
        # Insert processed data into BigQuery
        # wimoveis_data = body['task']['capturedLists']['extracao wimoveis']
        # if wimoveis_data:
        #   df = pd.DataFrame(wimoveis_data)
        #   to_bigquery("raw_data.wimoveis", df, 'append')
        #   print(f"Dados pré processados salvos no BigQuery com sucesso! {len(df)} linhas")

        

        return 'Dados salvos no BigQuery com sucesso!', 200
      except Exception as e:
        return 'Falha no envio', 500




def to_bigquery(table_name, dataframe, method):
  """
      Enviar dados para o Bigquery
      method: append / replace
  """
  credentials, project_id = default()
  dataframe['request_time'] = datetime.now()
  dataframe =dataframe.astype(str)
  dataframe.to_gbq(
    destination_table=table_name, 
    project_id=PROJECT_ID,
    credentials=credentials,
    if_exists=method
  )