from google.cloud import bigquery
from google.auth import default
import pandas_gbq
from datetime import datetime

PROJECT_ID = "massuh-420617"


def to_biquery(table_name, dataframe):
    """
        Enviar dados para o Bigquery
    """
    credentials, project_id = default()

    dataframe['request_time'] = datetime.now()

    dataframe =dataframe.astype(str)
    
    pandas_gbq.to_gbq(
        dataframe,
        destination_table=table_name,
        project_id=PROJECT_ID,
        credentials=credentials,
        if_exists='append' #append
    )

def from_bigquery(query):
    credentials, project_id = default()
    client = bigquery.Client(credentials=credentials, project=PROJECT_ID)

    query_job = client.query(query)

    results = query_job.result().to_dataframe()
    return results

