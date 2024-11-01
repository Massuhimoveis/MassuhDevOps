# scraper.py
import requests
from bs4 import BeautifulSoup
import re
from lxml import etree

from datetime import datetime
import time

BASE_URL = "https://www.dfimoveis.com.br"

def scrape_data_from_element(item, page, url, params):
  """ Extrai dados do imóvel a partir do elemento HTML. """
  # Adapte estas linhas conforme necessário para capturar os dados desejados
  link = BASE_URL+item.get('href') if item.get('href') else None
  new_text = item.find('div', class_="new-texts").text.strip() if item.find('div', class_="new-texts") else None
  picture_link = item.find('div', class_='new-pic').find('picture').find('source').get('srcset') if item.find('div', class_='new-pic') else None
  title = ' '.join(item.find('h2', class_="new-title phrase").stripped_strings)
  subtitle = item.find('h3', class_="new-subtitle phrase").text.strip() if item.find('h3', class_="new-subtitle phrase") else "-"
  description = item.find('h3', class_="new-desc phrase").text.strip()
  simple_phrase = item.find('h3', class_="new-simple phrase").text.strip()
  price_detail = item.find('div', class_="new-price").find('h4').text.strip()
  additional_details = [detail.text.strip() for detail in item.find('ul', class_="new-details-ul").find_all('span')]
  advertiser_logo = item.find('div', class_="new-anunciante").find('picture').find('source').get('srcset')
  advertiser = item.find('div', class_="new-anunciante").find('picture').find('img').get('alt')
  advertiser_creci = item.find('div', class_="creci").find('p').text.strip()
  # Configuração do objeto com as informações capturadas
  return {
    "url": url,
    "aceita_permuta": params['aceitapermuta'] if params['aceitapermuta'] else None,
    "page": page,
    "scrape_time": datetime.now(),
    "link": link,
    "new_text": new_text,
    "picture_link":picture_link,
    "title": title,
    "subtitle": subtitle,
    "description": description,
    "simple_phrase": simple_phrase,
    "price_detail": price_detail,
    "additional_details": additional_details,
    "advertiser_logo": advertiser_logo,
    "advertiser": advertiser,
    "advertiser_creci": advertiser_creci,
  }

def scrape_results_page(url, params):
  imoveis = []
  response = requests.get(url, params=params)
  print(f"Acessando a página: {response.url} | status_code: {response.status_code}")

  if response.status_code == 200:
    soup = BeautifulSoup(response.content, 'html.parser')

    # Encontre todos os imóveis na página
    resultado_busca = soup.find('div', id='resultadoDaBuscaDeImoveis')
    # Imprima o título da página
    if params['pagina'] == 1:
      titulo_pagina = soup.find('h1', class_='titulo-pagina center-text').text.strip()
      print(titulo_pagina)
    # Busque a lista de resultados
    itens_imoveis = resultado_busca.find_all('a')
    for item in itens_imoveis:
      # Extraia os dados do imovel
      dados_imovel = scrape_data_from_element(item, params['pagina'], response.url, params)
      imoveis.append(dados_imovel)
  
  else:
    print(f"Falha ao acessar a página {response.url}. Resposta do servidor: [{response.status_code}]{response.text}")
  
  return imoveis

def scrape_results_list(aceita_permuta):
  # URL da busca
  url = "https://www.dfimoveis.com.br/venda/df/brasilia/imoveis"

  # Parâmetros de busca
  page = 1
  params = {
    'aceitapermuta': aceita_permuta,
    'pagina': page
  }
  # Paginação e requests
  results = []
  while True:
    try:
      res = scrape_results_page(url, params)
      results.extend(res)
      page += 1
      params['pagina'] = page
      time.sleep(0.5)
    except Exception as e:
      print(f"Error at page: {page}")
      # print(e)
      break
  print(f"Total de páginas vasculhadas: {page-1} | Total de Imóveis carregados: {len(results)}")
  return results







# def extract_info(soup):
#   data = {}

#   # Extracting title
#   title = soup.find('h1', class_='mb-0 font-weight-600')
#   data['title'] = title.get_text(strip=True) if title else None

#   # Extracting value
#   value = soup.find('small', class_='display-5 text-warning precoAntigoSalao')
#   data['value'] = value.get_text(strip=True) if value else None

#   # Extracting area
#   area = soup.find('small', class_='display-5 text-warning', text=re.compile(r'\d{1,3},\d{2} m²'))
#   data['area'] = area.get_text(strip=True) if area else None

#   # Extracting neighborhood
#   neighborhood = soup.find('small', class_='text-muted', text=re.compile(r'[A-Z]+'))
#   data['neighborhood'] = neighborhood.get_text(strip=True) if neighborhood else None

#   # Extracting bedrooms
#   bedrooms = soup.find('small', class_='text-muted', text=re.compile(r'\d+ quarto'))
#   data['bedrooms'] = bedrooms.get_text(strip=True) if bedrooms else None

#   # Extracting condo fee
#   condo_fee = soup.find('small', class_='text-muted', text=re.compile(r'\d{1,3},\d{2}'))
#   data['condo_fee'] = condo_fee.get_text(strip=True) if condo_fee else None

#   # Extracting price per square meter
#   price_per_sqm = soup.find('small', class_='display-5 text-warning m2-valor')
#   data['price_per_sqm'] = price_per_sqm.get_text(strip=True) if price_per_sqm else None

#   # Extracting city
#   city = soup.find('small', class_='text-muted', text=re.compile(r'[A-Z]+'))
#   data['city'] = city.get_text(strip=True) if city else None

#   # Extracting suites
#   suites = soup.find('small', class_='text-muted', text=re.compile(r'\d+ suíte'))
#   data['suites'] = suites.get_text(strip=True) if suites else None

#   # Extracting garages
#   garages = soup.find('small', class_='text-muted', text=re.compile(r'\d+ vaga'))
#   data['garages'] = garages.get_text(strip=True) if garages else None

#   # Extracting general details
#   details = {}
#   details_labels = {
#     'Código': 'code',
#     'IPTU': 'iptu',
#     'Posição do Sol': 'sun_position',
#     'Andar do Apartamento': 'floor',
#     'Última Atualização': 'last_update',
#     'Área Total': 'total_area',
#     'Posição do Imóvel': 'property_position'
#   }

#   for label, key in details_labels.items():
#     detail = soup.find('h6', class_='mb-0 text-normal', text=re.compile(label))
#     if detail:
#       value = detail.find_next('small', class_='text-muted')
#       details[key] = value.get_text(strip=True) if value else None

#   data['details'] = details

#   # Extracting description
#   description = soup.find('p', class_='w-100 pb-3 mb-0 texto-descricao')
#   data['description'] = description.get_text(strip=True) if description else None

#   # Extracting features
#   features = soup.find('div', id='detalhe-imovel')
#   if features:
#     features_list = [li.get_text(strip=True) for li in features.find_all('li')]
#     data['features'] = features_list

#   return data

def scrape_item_page(html, url):
  soup = BeautifulSoup(html, 'html.parser')
  dom = etree.HTML(str(soup))
  details = {}
  details['url'] = url
  # print(f"Acessando a página: {response.url} | status_code: {response.status_code}")
  try:
    details['is_inactive'] = True if soup.find('div', class_="titulo-imovel-inativo") else False
    details['carousel_img_links'] = [item.find('img').get('data-flickity-lazyload') for item in soup.find_all('div', class_="carousel-cell")]

    whats = soup.find('span', class_="divModalWhatsapp")
    if whats:
      details['whats'] = re.search(r"phone=([0-9]+)", whats.find('a', class_='abrirModalWhatsapp').get('data-link')).group(1)
    
    details['title'] = soup.find('h1', class_="mb-0 font-weight-600 mobile-fs-1-5").text if soup.find('h1', class_="mb-0 font-weight-600 mobile-fs-1-5") else None
    details['price'] = soup.find('small', class_='display-5 text-warning precoAntigoSalao').text.strip() if soup.find('small', class_='display-5 text-warning precoAntigoSalao') else None
    
    details['area'] = None  # Default to None
    area_element = soup.find('small', class_='display-5 text-warning', string=lambda x: x and 'm²' in x)
    if area_element:
      details['area'] = area_element.text.strip()
    
    details['price_per_m2'] = soup.find('small', class_='display-5 text-warning m2-valor').text.strip() if soup.find('small', class_='display-5 text-warning m2-valor') else None
    details['condominium_fee'] = soup.find('div', class_="col-12 col-sm-5").find('h6', class_="mb-0 text-normal").find('small', class_='text-muted').text.strip() if soup.find('div', class_="col-12 col-sm-5") else None
    

    neighborhood = soup.find('input', {'id': 'bairro', 'name': 'bairro'})
    if neighborhood:
        details['neighborhood'] = neighborhood.get('value').strip()
    
    city = soup.find(lambda tag: tag.name == "h6" and 'Cidade:' in tag.text)
    if city:
      details['city'] = city.find_next('small').get_text(strip=True)
    
    bedrooms = soup.find(lambda tag: tag.name == "small" and 'quarto' in tag.text)
    if bedrooms:
      details['bedrooms'] = bedrooms.text.strip()
    
    suites = soup.find('small', class_='text-muted', string=re.compile(r'\d+ suíte'))
    if suites:
      details['suites'] = suites.get_text(strip=True) if suites else None

    parking_spaces = soup.find(lambda tag: tag.name=='small' and 'vaga' in tag.text)
    if parking_spaces:
      details['parking_spaces'] = parking_spaces.text.strip()
    
    details['general_description'] = dom.xpath('/html/body/main/section/div/div[1]/div/div/div[5]/div[2]/div[1]/h6/text()')[0].strip()

    code = soup.find(lambda tag: tag.name == "h6" and 'Código:' in tag.text)
    if code:
      details['code'] = code.find_next('small').get_text(strip=True)
    
    iptu = soup.find(lambda tag: tag.name == "h6" and 'IPTU R$:' in tag.text)
    if iptu:
      details['iptu'] = iptu.find_next('small').get_text(strip=True)
    
    solar_position = soup.find(lambda tag: tag.name == "h6" and 'Posição do Sol:' in tag.text)
    if solar_position:
      details['solar_position'] = solar_position.find_next('small').get_text(strip=True)
    
    apartment_floor = soup.find(lambda tag: tag.name == "h6" and 'Andar do Apartamento:' in tag.text)
    if apartment_floor:
      details['apartment_floor'] = apartment_floor.find_next('small').get_text(strip=True)
    
    total_area = soup.find(lambda tag: tag.name == "h6" and 'Área Total:' in tag.text)
    if total_area:
      details['total_area'] = total_area.find_next('small').get_text(strip=True)
    
    property_position = soup.find(lambda tag: tag.name == "h6" and 'Posição do Imóvel:' in tag.text)
    if property_position:
      details['property_position'] = property_position.find_next('small').get_text(strip=True)
    
    last_update = soup.find(lambda tag: tag.name == "h6" and 'Última Atualização:' in tag.text)
    if last_update:
      details['last_update'] = last_update.find_next('small').get_text(strip=True)
    
    property_total_floors = soup.find(lambda tag: tag.name == "h6" and 'Total de Andar do Empreendimento:' in tag.text)
    if property_total_floors:
      details['property_total_floors'] = property_total_floors.find_next('small').get_text(strip=True)
    
    unities_on_floor = soup.find(lambda tag: tag.name == "h6" and 'Unidades no Andar:' in tag.text)
    if unities_on_floor:
      details['unities_on_floor'] = unities_on_floor.find_next('small').get_text(strip=True)
    
    # Features
    features = soup.find('div', id='detalhe-imovel')
    if features:
      features_list = [li.get_text(strip=True) for li in features.find_all('li')]
      details['features'] = features_list

    # Descrição
    details['description'] = soup.find('p', class_="w-100 pb-3 mb-0 texto-descricao").text.strip() if soup.find('p', class_="w-100 pb-3 mb-0 texto-descricao") else None
    
    time.sleep(0.1)
    print(f"URL: {details['url']}")
    print(f"Bairro: {details['neighborhood']}")
    print(f"Cidade: {details['city']}")
    # print(f"Preço: {details['price']}")
    print("-------------------------------\n")
    
    return details
  except Exception as e:
    print(f"[{url}]: {e}")
    return None


if __name__ == '__main__':
  urls = [
    "https://www.dfimoveis.com.br/imovel/lancamento-parque-cidade-860676",
    "https://www.dfimoveis.com.br/imovel/lancamento-link-noroeste-334299",
    "https://www.dfimoveis.com.br/imovel/apartamento-2-quartos-venda-samambaia-norte-samambaia-df-quadra-201-conjunto-1-840434"
    ]
  for url in urls:
    request = requests.request('GET',url)
    scrape_item_page(request.text, url)