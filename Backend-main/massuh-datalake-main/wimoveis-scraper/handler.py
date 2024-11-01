from scraper import load_daily_updates
from bigquery_client import to_biquery
from data_processor import process_data


def get_daily_updates():
    data = load_daily_updates()
    if len(data) > 0:
        df = process_data(data)
        table_name = "raw_data.wimoveis_scraper"
        to_biquery(table_name=table_name, dataframe=df)
        print(f"{len(data)} linhas inseridas em {table_name} com sucesso")





if __name__ == "__main__":
    get_daily_updates()