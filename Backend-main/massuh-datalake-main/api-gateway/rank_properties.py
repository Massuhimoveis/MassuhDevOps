import functions_framework
from google.cloud import bigquery
from google.auth import default
import pandas_gbq
import pandas as pd
from flask import jsonify
from unidecode import unidecode
import json

PROJECT_ID = "massuh-420617"


@functions_framework.http
def get_properties(request):
  """
  Rankear Imóveis de acordo com preferências
  Lista de Parâmetros Válidos:
    metragem : NUMERIC
    banheiro : NUMERIC
    quartos : NUMERIC
    suites : NUMERIC
    vagas : NUMERIC
    valor : NUMERIC
    condominio : NUMERIC
    iptu : NUMERIC
    price_per_m2 : NUMERIC
    _source : ARRAY
    bairros : ARRAY
    tipologia : ARRAY
    enquadramento : ARRAY
    piso : ARRAY
    posicao_solar : ARRAY
    posicao_predio : ARRAY
    tipo_cozinha : ARRAY
    purposes_type : ARRAY
    stage_description : ARRAY
    aceita_permuta : BOOL
    aceita_fgts : BOOL
    aceita_financiamento : BOOL
    mobiliado : BOOL
    elevador : BOOL
    dce : BOOL
    reformado : BOOL
    vista_livre : BOOL
    nascente : BOOL
    lazer_completo : BOOL
    lazer_parcial : BOOL
    varanda : BOOL
    gas_encanado : BOOL
    vazado : BOOL
    reforma_hidraulica : BOOL
    reforma_eletrica : BOOL
    fachada_reformada : BOOL
  """
  
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
    
    if request_args:
      params = request_args.to_dict()
      print(f"Executando consulta com os parametros: {params}")
      try:
        results_df = rank_properties(params) 
        total_rows = results_df.shape[0]
        data = results_df.to_json(orient='records', force_ascii=False)

        response = {
          'total': total_rows,
          'data': data
        }
        
        return response, 200, headers
      except Exception as e:
        return {'error': str(e)}, 500, headers
    else:
      return {"message": "Parâmetros inválidos"}, 500, headers
  return {"message": "request invalido"}, 500, headers

  


def from_bigquery(query):
  credentials, project_id = default()
  client = bigquery.Client(credentials=credentials, project=PROJECT_ID)

  query_job = client.query(query)

  results = query_job.result().to_dataframe()
  return results


def rank_properties(params : dict):
  # Normalize string
  def normalize_string(s):
    return unidecode(s).lower()

  # Extrair base de imóveis ativos
  df = from_bigquery("select * from model.properties")
  total_rows = len(df)
  print(f"Total de imoveis a vasculhar: {total_rows}")

  # Inicializar controle de scores
  SCORE_COLUMNS = []

  # Calcular Scores de parâmetros numéricos
  if params.get('metragem'):
    # Calcular score para imoveis com metragem acima
    df['score_metragem'] = df['metragem'].apply(lambda x: 1 if pd.notnull(x) and x >= float(params.get('metragem')) else 0)
    SCORE_COLUMNS.append('score_metragem')
  if params.get('banheiro'):
    # Calcular score para imoveis com banheiros acima
    df['score_banheiro'] = df['banheiro'].apply(lambda x: 1 if pd.notnull(x) and x >= int(params.get('banheiro')) else 0)
    SCORE_COLUMNS.append('score_banheiro')
  if params.get('quartos'):
    # Calcular score para imoveis com quartos acima
    df['score_quartos'] = df['quartos'].apply(lambda x: 1 if pd.notnull(x) and x >= int(params.get('quartos')) else 0)
    SCORE_COLUMNS.append('score_quartos')
  if params.get('suites'):
    # Calcular score para imoveis com suites acima
    df['score_suites'] = df['suites'].apply(lambda x: 1 if pd.notnull(x) and x >= int(params.get('suites')) else 0)
    SCORE_COLUMNS.append('score_suites')
  if params.get('vagas'):
    # Calcular score para imoveis com vagas acima
    df['score_vagas'] = df['vagas'].apply(lambda x: 1 if pd.notnull(x) and x >= int(params.get('vagas')) else 0)
    SCORE_COLUMNS.append('score_vagas')
  if params.get('valor'):
    # Calcular score para imoveis com valor abaixo
    df['score_valor'] = df['valor'].apply(lambda x: 1 if pd.notnull(x) and x <= float(params.get('valor')) else 0)
    SCORE_COLUMNS.append('score_valor')
  if params.get('condominio'):
    # Calcular score para imoveis com condominio abaixo
    df['score_condominio'] = df['condominio'].apply(lambda x: 1 if pd.notnull(x) and x <= float(params.get('condominio')) else 0)
    SCORE_COLUMNS.append('score_condominio')
  if params.get('iptu'):
    # Calcular score para imoveis com iptu abaixo
    df['score_iptu'] = df['iptu'].apply(lambda x: 1 if pd.notnull(x) and x <= float(params.get('iptu')) else 0)
    SCORE_COLUMNS.append('score_iptu')
  if params.get('price_per_m2'):
    # Calcular score para imoveis com price_per_m2 abaixo
    df['score_price_per_m2'] = df['price_per_m2'].apply(lambda x: 1 if pd.notnull(x) and x <= float(params.get('price_per_m2')) else 0)
    SCORE_COLUMNS.append('score_price_per_m2')

  # Calcular Scores de parâmetros categoricos
  if params.get('_source'):
    # Calcular score para imoveis localizados nos bairros selecionados
    df['score_source'] = df['_source'].apply(lambda x: 1 if pd.notnull(x) and x in json.loads(params.get('_source')) else 0)
    SCORE_COLUMNS.append('score_source')
  if params.get('bairros'):
    bairros = [normalize_string(bairro) for bairro in json.loads(params.get('bairros'))]
    df['score_bairro'] =  df['bairro'].apply(
            lambda x: 1 if pd.notnull(x) and any(bairro in normalize_string(x) for bairro in bairros) else 0
        )
    SCORE_COLUMNS.append('score_bairro')
  if params.get('tipologia'):
    # Calcular score para imoveis com tipologia dentro das selecionadas
    df['score_tipologia'] = df['tipo_imovel'].apply(lambda x: 1 if pd.notnull(x) and x in json.loads(params.get('tipologia')) else 0)
    SCORE_COLUMNS.append('score_tipologia')
  if params.get('enquadramento'):
    # Calcular score para imoveis com enquadramento dentro das selecionadas
    df['score_enquadramento'] = df['enquadramento'].apply(lambda x: 1 if pd.notnull(x) and x in json.loads(params.get('enquadramento')) else 0)
    SCORE_COLUMNS.append('score_enquadramento')
  if params.get('piso'):
    # Calcular score para imoveis com enquadramento dentro das selecionadas
    df['score_piso'] = df['piso'].apply(lambda x: 1 if pd.notnull(x) and x in params.get('piso') else 0)
    SCORE_COLUMNS.append('score_piso')
  if params.get('posicao_solar'):
    # Calcular score para imoveis com posição solar dentro das selecionadas
    df['score_posicao_solar'] = df['posicao_solar'].apply(lambda x: 1 if pd.notnull(x) and x in params.get('posicao_solar') else 0)
    SCORE_COLUMNS.append('score_posicao_solar')
  if params.get('posicao_predio'):
    # Calcular score para imoveis com posição predial dentro das selecionadas
    df['score_posicao_predio'] = df['posicao_predio'].apply(lambda x: 1 if pd.notnull(x) and x in params.get('posicao_predio') else 0)
    SCORE_COLUMNS.append('score_posicao_predio')
  if params.get('tipo_cozinha'):
    # Calcular score para imoveis com tipo de cozinha dentro das selecionadas
    df['score_tipo_cozinha'] = df['tipo_cozinha'].apply(lambda x: 1 if pd.notnull(x) and x in params.get('tipo_cozinha') else 0)
    SCORE_COLUMNS.append('score_tipo_cozinha')
  if params.get('purposes_type'):
    # Calcular score para imoveis com tipo de propósito de negociação dentro das selecionadas
    df['score_purposes_type'] = df['purposes_type'].apply(lambda x: 1 if pd.notnull(x) and x in params.get('purposes_type') else 0)
    SCORE_COLUMNS.append('score_purposes_type')
  if params.get('stage_description'):
    # Calcular score para imoveis com estado do imóvel dentro das selecionadas
    df['score_stage_description'] = df['stage_description'].apply(lambda x: 1 if pd.notnull(x) and x in params.get('stage_description') else 0)
    SCORE_COLUMNS.append('score_stage_description')
  
  # Calcular Scores de parâmetros booleanos
  BOOL_COLS = ['aceita_permuta','aceita_fgts','aceita_financiamento','mobiliado','elevador','dce','reformado','vista_livre','nascente','lazer_completo','lazer_parcial','varanda','gas_encanado','vazado','reforma_hidraulica','reforma_eletrica','fachada_reformada']
  for key in BOOL_COLS:
    if params.get(key):
      SCORE_KEY = "score_"+key
      df[SCORE_KEY] = df[key].apply(lambda x: 1 if pd.notnull(x) and x else 0) 
      SCORE_COLUMNS.append(SCORE_KEY)
  
  # Sumarizar scores
  df['score'] = 0
  df['max_score'] = 0
  for col in SCORE_COLUMNS:
    df['score'] += df[col]
    df['max_score'] += 1
  df['score'] = df['score']/df['max_score']
  df = df.sort_values('score', ascending=False).reset_index(drop=True)
  df = df[df['score'] >= 0.6]
  print(f"{len(df)} imoveis encontrados de {total_rows}")

  return df