import pandas as pd
from datetime import datetime

def to_dataframe(data):
    return pd.json_normalize(data)

def adjust_column_names(column_name):
  column_name = column_name.replace('.', '_').replace(' ', '_')
  if column_name == 'floor':
    column_name = '_floor'
  elif column_name == 'access':
    column_name = '_access'
  return column_name[:300]

def handle_duplicate_columns(column_names):
  seen = {}
  new_column_names = []
  for col in column_names:
    if col in seen:
      seen[col] += 1
      new_col = f"{col}_{seen[col]}"
    else:
      seen[col] = 0
      new_col = col
    new_column_names.append(new_col)
  return new_column_names

def process_purposes(data):
  for item in data:
    if item.get('purposes'):
      try:
        item['purposes'] = item['purposes'][0]
      except:
        print(f"Não foi possivel converter item purposes. ({type(item['purposes'])})")
  return data

  
