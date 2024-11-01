import requests
import json
import os


from dotenv import load_dotenv # Somente para execução local com .env
load_dotenv()

API_KEY = os.environ.get('API_KEY')

def get_buildings(params):
  # Faz request à apresenta.me e retorna lista de imóveis da Massuh que estão ativos
  url = "https://api.apresenta.me/buildings"

  headers = {'Authorization': f'Bearer {API_KEY}'}

  data = []

  page = 1
  
  if params:
    print("Iniciando request")
    while page:
        params['page'] = page
        r = requests.request('GET', url=url, params=params, headers=headers)
        if r.status_code == 200:
            json_obj = r.json()
            print(f"Current Page: {json_obj['current_page']} | Next Page URL: {json_obj['next_page_url']}")
            data.extend(json_obj.get('data'))
            page = page+1 if json_obj.get('next_page_url') else None
        else:
           print(f"Erro ({r.status_code}). {r.text}")
           break
  
  else:
    print("Passe o parâmetro da requisição")
  return data