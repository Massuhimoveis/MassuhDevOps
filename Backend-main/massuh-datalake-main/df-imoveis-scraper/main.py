import base64
import json
import functions_framework
import asyncio
from handler import load_real_state_data, load_real_state_details


# Triggered from a message on a Cloud Pub/Sub topic.
@functions_framework.cloud_event
def main(cloud_event):
  try:
    pubsub_message = base64.b64decode(cloud_event.data["message"]["data"]).decode('utf-8')
    print(f"pubsub_message: {pubsub_message}")
    function = json.loads(pubsub_message).get("function", "")
    print(f"function: {function}")
    print(f'fila: {pubsub_message}')

    if function == 'load_real_state_data':
      load_real_state_data()
      # print(function)
    elif function == 'load_real_state_details':
      asyncio.run(load_real_state_details())
      # print(function)
    else:
      print(f'Nenhum parâmetro function valido encontrado [{function}]')
    
  except Exception as e:
    print("Error -> ", e)