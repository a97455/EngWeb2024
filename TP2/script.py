import os
import json

output_folder = 'html'

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

caminho_arquivo_json = 'mapa-virtual.json'

# Load the JSON file
with open(caminho_arquivo_json, 'r', encoding='utf-8') as json_file:
    data = json.load(json_file)

    for city in data['cidades']:
        # Extract relevant information from JSON
        id = city.get('id', "ID não encontrado")
        nome = city.get('nome', "Nome não encontrado")
        população = city.get('população', "População não encontrada")
        descrição = city.get('descrição', "Descrição não encontrada")
        distrito = city.get('distrito', "Distrito não encontrado")

        # Write HTML file
        html_file = os.path.join(output_folder, f'{nome}.html')
        with open(html_file, 'w', encoding='utf-8') as f:
            # Write HTML header
            f.write('<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Informação da Cidade</title>\n')
            # Add CSS style
            f.write('<style>\n')
            # Your CSS styles here
            f.write('</style>\n')
            f.write('</head>\n<body>\n')
            f.write(f'<h1>{nome}</h1>\n')
            f.write(f'<p>ID: {id}</p>\n')
            f.write(f'<p>População: {população}</p>\n')
            f.write(f'<p>Descrição: {descrição}</p>\n')
            f.write(f'<p>Distrito: {distrito}</p>\n')

            # Write end of HTML
            f.write('</body>\n</html>')