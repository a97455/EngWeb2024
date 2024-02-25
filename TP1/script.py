import os
import re
import xml.etree.ElementTree as ET

def createIndexHTML(diretoria_xml):
    with open('index.html', 'w', encoding='utf-8') as f:
        # Write HTML header
        f.write('<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Ruas de Braga</title>\n')
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
        f.write('<div class="container">\n<h1>Ruas de Braga</h1>\n<ul class="ruas-list">\n')
        for filename in os.listdir(diretoria_xml):
            caminho_arquivo_xml = os.path.join(diretoria_xml, filename)

            # Parse the XML file
            tree = ET.parse(caminho_arquivo_xml)
            root = tree.getroot()

            # Extract number and name from the meta tag
            numero_rua = root.find('./meta/número').text
            nome_rua = root.find('./meta/nome').text
            f.write(f'<li><a href="html/rua{numero_rua}.html">{nome_rua}</a></li>\n')
        f.write('</ul>\n</div>\n')
        # Write end of HTML
        f.write('</body>\n</html>')


def htmlFromXml(diretoria_xml, output_folder):
    for filename in os.listdir(diretoria_xml):
        caminho_arquivo_xml = os.path.join(diretoria_xml, filename)

        # Parse the XML file
        tree = ET.parse(caminho_arquivo_xml)
        root = tree.getroot()

        # Write the HTML title with the street number and name
        numero_rua = root.find('./meta/número').text
        nome_rua = root.find('./meta/nome').text

        # Open the HTML file for writing
        html_file = os.path.join(output_folder, f'rua{numero_rua}.html')
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(f'<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>{nome_rua}</title>\n</head>\n<body>\n')

            # Write the street name as heading
            f.write(f'<h1>{nome_rua}</h1>\n')

            # Write paragraphs about the street
            paragrafos = root.findall('./corpo/para')
            for para in paragrafos:
                paragrafo = ''

                # Process the paragraph text
                texto = para.text.strip() if para.text else ''
                paragrafo += texto

                # Process the child elements of the paragraph
                for elemento in para:
                    if elemento.tag == 'lugar':
                        lugar_text = elemento.text if elemento.text else ''
                        paragrafo += f' <strong>{lugar_text}</strong> '
                    elif elemento.tag == 'data':
                        data_text = elemento.text if elemento.text else ''
                        paragrafo += f' <strong>{data_text}<strong> '
                    elif elemento.tag == 'entidade' and elemento.get('tipo') == 'instituição':
                        entidade_text = elemento.text if elemento.text else ''
                        paragrafo += f' <strong>{entidade_text}</strong> '
                    else:
                        resto = elemento.text if elemento.text else ''
                        paragrafo += f' {resto} '
                
                    # Process the remaining text after child elements
                    if elemento.tail:
                        paragrafo += elemento.tail.strip()
                    
                # Write the paragraph to the HTML file
                f.write(f'<p>{paragrafo}</p>\n')


            # Write the images of the street
            rua_imagens = []
            for img in root.findall('.//imagem'):
                path_element = img.get('path')
                filename, file_extension = os.path.splitext(os.path.basename(path_element))
                image_path = f"../MapaRuas-materialBase/imagem/{filename}{file_extension}"
                rua_imagens.append(image_path)
                
            # Write the images to the HTML file with captions
            f.write('<div class="image-container">\n')
            for img_path in rua_imagens:
                legenda = ''
                # Find the caption corresponding to the current image
                for figura in root.findall('.//figura'):
                        imagem_element = figura.find('imagem')
                        if imagem_element is not None:
                            path_element = imagem_element.get('path')
                            if img_path.endswith(os.path.basename(path_element)):
                                legenda_element = figura.find('legenda')
                                if legenda_element is not None:
                                    legenda = legenda_element.text.strip()  # Get the caption text
                                    break  # Stop iteration once corresponding caption is found
                
                # Write the image tag with caption
                f.write(f'<div class="image-with-caption">\n')
                f.write(f'<img src="{img_path}" alt="Imagem da Rua" style="max-width: 70%; height: auto;">\n')
                f.write(f'<p>{legenda}</p>\n')
                f.write('</div>\n')
            f.write('</div>\n')


            # Images of the current view
            rua_imagens_atuais = []
            path_vistas_atuais = "./MapaRuas-materialBase/atual/"
            for img in os.listdir(path_vistas_atuais):
                # Extract the street number from the filename using regular expressions
                match = re.match(r"(\d+)-", img)
                if match:
                    numero_arquivo = match.group(1)
                    if numero_arquivo == numero_rua:
                        vista_atual_path = f"{path_vistas_atuais}{img}"
                        rua_imagens_atuais.append("." + vista_atual_path)

            # Write the images to the HTML file with captions
            f.write('<div class="image-container">\n')
            for img_path_atuais in rua_imagens_atuais:
                legenda_atuais =  f' {nome_rua} '

                # Write the image tag with the caption
                f.write('<div class="image-with-caption">\n')
                f.write(f'<img src="{img_path_atuais}" alt="Imagem da Rua" style="max-width: 70%; height: auto;">\n')
                f.write(f'<p>{legenda_atuais}</p>')
                f.write('</div>\n')
            f.write('</div>\n')

            # Write the table of houses on the street
            lista_casas = root.findall('./corpo/lista-casas/casa')
            f.write('<h2>Casas:</h2>\n')
            f.write('<table border="1">\n')
            f.write('<tr><th>Número da Casa</th><th>Enfiteuta</th><th>Foro</th><th>Descrição</th></tr>\n')
            for casa in lista_casas:
                f.write('<tr>\n')
                numero_casa = casa.find('número').text if casa.find('número') is not None else "S/ Número"
                enfiteuta = casa.find('enfiteuta').text if casa.find('enfiteuta') is not None else "S/ Enfiteuta"
                foro = casa.find('foro').text if casa.find('foro') is not None else "S/ Foro"
                desc = casa.find('desc/para').text if casa.find('desc/para') is not None else "S/ Descrição"
                f.write(f'<td>{numero_casa}</td><td>{enfiteuta}</td><td>{foro}</td><td>{desc}</td>\n')
                f.write('</tr>\n')
            f.write('</table>\n')

            f.write('<div class="container">\n')
            f.write('<ul class="ruas-list">\n')
            f.write('<a href="../index.html">Voltar À Página Inicial</a>\n')
            f.write('</ul>\n')
            f.write('</div>\n')

            # Write the end of HTML
            f.write('</body>\n</html>')


if __name__ == "__main__":
    output_folder = 'html'
    diretoria_xml = 'MapaRuas-materialBase/texto'
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    createIndexHTML(diretoria_xml)
    htmlFromXml(diretoria_xml,output_folder)