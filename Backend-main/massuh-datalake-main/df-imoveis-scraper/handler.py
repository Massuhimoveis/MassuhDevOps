from scraper import scrape_results_list, scrape_item_page
from bigquery_client import to_biquery, from_bigquery
from data_processor import process_data
import time
import aiohttp
import asyncio

sem = asyncio.Semaphore(20)  # Limitar a 20 requests simultâneos para tentar evitar o erro

async def fetch(session, url, retries=3, backoff_factor=1):
    async with sem:
        for attempt in range(retries):
            try:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=60)) as response:
                    if response.status == 200:
                        html = await response.text()
                        return scrape_item_page(html, url)
                    else:
                        print(f"Falha ao acessar a página {url}. Resposta do servidor: [{response.status}]{await response.text()}")
                        return None
            except (aiohttp.ClientOSError, aiohttp.ClientConnectorError, aiohttp.ServerDisconnectedError) as e:
                print(f"Erro ao acessar {url}: {e}")
                if attempt < retries - 1:
                    sleep_time = backoff_factor * (2 ** attempt)
                    print(f"Tentando novamente ({attempt + 1}/{retries}) em {sleep_time} segundos...")
                    await asyncio.sleep(sleep_time)  # Exponencial backoff antes de tentar novamente
                else:
                    return None
            except asyncio.TimeoutError:
                print(f"Timeout ao acessar {url}.")
                return None

def load_real_state_data():
    # Init
    DESTINATION_TABLE = "raw_data.df_imoveis" # Format: {dataset_id}.{table_id}

    # Options
    options = [
        {'aceita_permuta': True},
        {'aceita_permuta': False}
    ]

    # Do:
    for option in options:
        aceita_permuta = option.get('aceita_permuta')
        print(f"Extraindo dados com option = {option}")

        # Scrape all data
        results = scrape_results_list(aceita_permuta) # Reference URL: https://www.dfimoveis.com.br/venda/df/brasilia/imoveis

        # Load data to DataFrame

        df = process_data(results)

        # Load DataFrame to BigQuery
        if len(df)>1:
            to_biquery(DESTINATION_TABLE, df)
            print(f"Dados de Lista de Imóveis carregados com sucesso ({option})")
        else:
            print(f"Sem dados localizados para {option}")


async def load_real_state_details():
    start_time = time.time()  # Capturar o tempo inicial
    DESTINATION_TABLE = "raw_data.df_imoveis_detalhado"
    # Get Real State urls list
    # urls = ['https://www.dfimoveis.com.br/imovel/apartamento-2-quartos-venda-noroeste-brasilia-df-sqnw-303-bloco-a-675341','https://www.dfimoveis.com.br/imovel/apartamento-4-quartos-venda-asa-sul-brasilia-df-sqs-310-bloco-b-887754']
    query = """
        SELECT
            *
        FROM `model.df_imoveis_links`
        LIMIT 10000
    """
    urls = from_bigquery(query)['link'].tolist()
    # Loop

    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
    
    # Filtrar resultados válidos
    results = [result for result in results if result is not None]

    if results:
        df = process_data(results)
        to_biquery(DESTINATION_TABLE, df)
        print(f"Dados de Lista de Imóveis carregados com sucesso. [{len(results)} de {len(urls)}]")
    else:
        print(f"Sem dados localizados para {urls}")
    
    end_time = time.time()  # Capturar o tempo final
    print(f"Tempo de execução: {end_time - start_time:.2f} segundos")  # Calcular e exibir o tempo de execução


if __name__ == '__main__':
    # load_real_state_data()
    asyncio.run(load_real_state_details())