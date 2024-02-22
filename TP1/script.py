import os
import re
import xml.etree.ElementTree as ET

output_folder = 'html'

if not os.path.exists(output_folder):
    os.makedirs(output_folder)

diretoria_xml = 'MapaRuas-materialBase/texto'

for filename in os.listdir(diretoria_xml):
    if filename.endswith('.xml'):
        caminho_arquivo_xml = os.path.join(diretoria_xml, filename)

        # Parse the XML file
        tree = ET.parse(caminho_arquivo_xml)
        root = tree.getroot()

        # Write the HTML title with the street number and name
        numero_rua_element = root.find('./meta/número')
        numero_rua = numero_rua_element.text if numero_rua_element is not None else "Número da rua não encontrado"

        nome_rua_element = root.find('./meta/nome')
        nome_rua = nome_rua_element.text if nome_rua_element is not None else "Nome da rua não encontrado"

        # Open the HTML file for writing
        html_file = os.path.join(output_folder, f'rua{numero_rua}.html')
        with open(html_file, 'w', encoding='utf-8') as f:
            # Write the HTML header
            f.write('<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Informação da Rua</title>\n')
            # Add CSS style
            f.write('<style>\n')
            f.write('body {\n')
            f.write('    font-family: Arial, sans-serif;\n')
            f.write('    margin: 0;\n')
            f.write('    padding: 0;\n')
            f.write('    background-color: #f8f9fa;\n')  # Changed background color
            f.write('}\n')
            f.write('h1 {\n')
            f.write('    text-align: center;\n')  # Centered the heading
            f.write('    padding: 20px;\n')  # Added padding
            f.write('    background-color: #343a40;\n')  # Changed heading background color
            f.write('    color: #ffffff;\n')  # Changed heading text color
            f.write('}\n')
            f.write('.container {\n')
            f.write('    max-width: 175px;\n')
            f.write('    margin: 20px auto;\n')
            f.write('    padding: 20px;\n')
            f.write('    background-color: #ffffff;\n')  # Changed container background color
            f.write('    border-radius: 10px;\n')
            f.write('    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n')
            f.write('}\n')
            f.write('.image-container {\n')
            f.write('    display: flex;\n')
            f.write('    flex-wrap: wrap;\n')
            f.write('    justify-content: center;\n')  # Centered the images
            f.write('}\n')
            f.write('.image-container .image-with-caption {\n')
            f.write('    width: 45%;\n')  # Adjusted image width
            f.write('    margin: 10px;\n')  # Added margin
            f.write('    text-align: center;\n')
            f.write('}\n')
            f.write('.image-container img {\n')
            f.write('    max-width: 100%;\n')
            f.write('    height: auto;\n')
            f.write('}\n')
            f.write('.image-container .image-with-caption p {\n')
            f.write('    margin-top: 5px;\n')
            f.write('    font-size: 14px;\n')
            f.write('}\n')
            f.write('.ruas-list {\n')
            f.write('    list-style-type: none;\n')  # Removed bullet points
            f.write('    padding: 0;\n')
            f.write('}\n')
            f.write('.ruas-list a {\n')
            f.write('    text-decoration: none;\n')
            f.write('    color: #007bff;\n')  # Changed link color
            f.write('}\n')
            f.write('.ruas-list a:hover {\n')
            f.write('    text-decoration: underline;\n')  # Underlined link on hover
            f.write('}\n')
            f.write('</style>\n')
            f.write('</head>\n<body>\n')
            f.write(f'<h1>{nome_rua}</h1>\n')
            
            # Write the paragraphs about the street
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
                f.write(f'    <img src="{img_path}" alt="Imagem da Rua">\n')
                f.write(f'    <p>{legenda}</p>\n')
                f.write('</div>\n')
            f.write('</div>\n')

            # Write the list of houses on the street
            lista_casas = root.findall('./corpo/lista-casas/casa')
            # Write the list of houses as a table
            f.write('<h2>Casas:</h2>\n')
            f.write('<table border="1">\n')
            f.write('<tr><th>Número da Casa</th><th>Enfiteuta</th><th>foro</th><th>Descrição</th></tr>\n')
            for casa in lista_casas:
                f.write('<tr>\n')
                numero_casa_element = casa.find('número')
                numero_casa = numero_casa_element.text if numero_casa_element is not None else "Número não encontrado"

                enfiteuta_element = casa.find('enfiteuta')
                enfiteuta = enfiteuta_element.text if enfiteuta_element is not None else "Enfiteuta não encontrado"

                foro_element = casa.find('foro')
                foro = foro_element.text if foro_element is not None else "Foro não encontrado"

                desc_element = casa.find('desc/para')
                if desc_element is not None:
                    desc = '<desc><para>'
                    # Process the paragraph text
                    texto = desc_element.text.strip() if desc_element.text else ''
                    desc += texto

                    # Process the child elements of the paragraph
                    for elemento in desc_element:
                        if elemento.tag == 'lugar':
                            lugar_text = elemento.text if elemento.text else ''
                            desc += f' <lugar>{lugar_text}</lugar> '
                        elif elemento.tag == 'data':
                            data_text = elemento.text if elemento.text else ''
                            desc += f' <data>{data_text}</data> '
                        elif elemento.tag == 'entidade' and elemento.get('tipo') == 'instituição':
                            entidade_text = elemento.text if elemento.text else ''
                            desc += f' <entidade tipo="{elemento.get("tipo")}">{entidade_text}</entidade> '
                        else:
                            resto = elemento.text if elemento.text else ''
                            desc += f' {resto} '

                        # Process the remaining text after child elements
                        if elemento.tail:
                            desc += elemento.tail.strip()
                    desc += '</para></desc>'
                else:
                    desc = "Descrição não encontrada"

                f.write(f'<td>{numero_casa}</td><td>{enfiteuta}</td><td>{foro}</td><td>{desc}</td>\n')
                f.write('</tr>\n')
            f.write('</table>\n')
            
            # images of the current view
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
                f.write(f'    <img src="{img_path_atuais}" alt="Imagem da Rua">\n')
                f.write(f'    <p>{legenda_atuais}</p>')
                f.write('</div>\n')
            f.write('</div>\n')

            f.write('<div class="container">\n')
            f.write('<ul class="ruas-list">\n')
            f.write('<a href="../index.html">Voltar À Página Inicial</a>\n')
            f.write('</ul>\n')
            f.write('</div>\n')

            # Write the end of HTML
            f.write('</body>\n</html>')