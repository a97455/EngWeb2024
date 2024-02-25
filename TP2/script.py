import os
import json

def createIndexHTML(data):
    with open('index.html', 'w', encoding='utf-8') as f:
        # Write HTML header
        f.write('<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Cidades de Portugal</title>\n')
        # Write CSS style
        f.write("""<style>
        body {font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;margin: 0;padding: 0;background-color: #eeeaea;}
        h1 {margin: 0 0 20px; padding: 10px; font-size: 36px; text-align: center; color: #333; background-color: #eeeaea; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);}
        .container {max-width: 900px;margin: 20px auto;padding: 20px;background-color: #fff;border-radius: 10px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);}
        .ruas-list { list-style-type: none; padding: 0; }
        .ruas-list li { margin-bottom: 10px; padding: 15px; background-color: #eeeaea; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: background-color 0.3s; }
        .ruas-list li:hover { background-color: #eaeaea; }
        .ruas-list li a { text-decoration: none; color: #333; font-weight: bold; }
        .ruas-list li a:hover { color: #555; }
        </style>\n""")
        # Write HTML body
        f.write('</head>\n<body>\n')
        f.write('<div class="container">\n<h1>Cidades de Portugal</h1>\n<ul class="ruas-list">\n')
        for city in data['cidades']:
            f.write(f'<li><a href="{city.get("id")}">{city.get("nome")}</a></li>\n')
        f.write('</ul>\n</div>\n')
        # Write end of HTML
        f.write('</body>\n</html>')

    

def htmlFromJson(data,output_folder):
    for city in data['cidades']:
        # Write HTML file
        html_file = os.path.join(output_folder, f'{city.get("id")}.html')
        with open(html_file, 'w', encoding='utf-8') as f:
            # Write HTML header
            f.write('<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Informação da Cidade</title>\n')
            # Write HTML body
            f.write('</head>\n<body>\n')
            f.write(f'<h1>{city.get("nome")}</h1>\n')
            f.write(f'<p><strong>Descrição:</strong> {city.get("descrição")}</p>\n')
            f.write(f'<p><strong>Distrito</strong>: {city.get("distrito")}</p>\n')
            f.write(f'<p><strong>População:</strong> {city.get("população")}</p>\n')
            # Write end of HTML
            f.write('</body>\n</html>')


if __name__ == "__main__":
    output_folder = 'html'
    caminho_arquivo_json = 'mapa-virtual.json'

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Load the JSON file
    with open(caminho_arquivo_json, 'r', encoding='utf-8') as json_file:
        data = json.load(json_file)
        createIndexHTML(data)
        htmlFromJson(data,output_folder)