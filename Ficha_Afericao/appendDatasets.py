import requests
import json
import sys

url = 'http://localhost:7777/pessoas/registo'

# Abre o arquivo JSON
with open(sys.argv[1], 'r') as arquivo_json:
    # Carrega o conteúdo do arquivo JSON em um objeto Python
    dados = json.load(arquivo_json)

# Para cada entrada no JSON array, enviar uma solicitação POST
for pessoa in dados:
    requests.post(url, json=pessoa)