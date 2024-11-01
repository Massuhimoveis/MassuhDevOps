from apresentame_api import get_buildings
from bigquery_client import to_biquery, from_bigquery
from data_processor import to_dataframe, process_purposes, handle_duplicate_columns, adjust_column_names
import time

def get_list_of_active_buildings():
    params = {
      'filter[status]': 'active',
      'include[type]': '*',
      'include[country]': '*',
      'include[city]': '*',
      'include[state]': '*',
      'include[district]': '*',
      'include[stage]': '*',
      'include[purposes]': '*'
      }
    # Request API
    data = get_buildings(params)
    if len(data) > 0:
        # Processes array fields
        data = process_purposes(data)
        # Transform to DataFrame object
        df = to_dataframe(data)
        # Remove special characters from column names
        df.columns = [adjust_column_names(col) for col in df.columns]
        # Handle duplicated column names
        df.columns = handle_duplicate_columns(df.columns)
        # Send to BigQuery
        table_name = "raw_data.massuh_imoveis"
        to_biquery(table_name, df)
        print("Dados inseridos no bigquery com sucesso")
    else:
        print("Sem dados encontrados")

if __name__ == '__main__':
    get_list_of_active_buildings()