import os
import re
import xml.etree.ElementTree as ET

def htmlFromXml(diretoria_xml, output_folder):
    for filename in os.listdir(diretoria_xml):
        if filename.endswith('.xml'):
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
                f.write('<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Informação da Rua</title>\n</head>\n<body>\n')

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
                    f.write(f'    <img src="{img_path}" alt="Imagem da Rua" style="max-width: 70%; height: auto;">\n')
                    f.write(f'    <p>{legenda}</p>\n')
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
                    f.write(f'    <img src="{img_path_atuais}" alt="Imagem da Rua" style="max-width: 70%; height: auto;">\n')
                    f.write(f'    <p>{legenda_atuais}</p>')
                    f.write('</div>\n')
                f.write('</div>\n')

                # Write the table of houses on the street
                lista_casas = root.findall('./corpo/lista-casas/casa')
                f.write('<h2>Casas:</h2>\n')
                f.write('<table border="1">\n')
                f.write('<tr><th>Número da Casa</th><th>Enfiteuta</th><th>foro</th><th>Descrição</th></tr>\n')
                for casa in lista_casas:
                    f.write('<tr>\n')
                    numero_casa = casa.find('número').text if casa.find('número') is not None else "Número não encontrado"
                    enfiteuta = casa.find('enfiteuta').text if casa.find('enfiteuta') is not None else "Enfiteuta não encontrado"
                    foro = casa.find('foro').text if casa.find('foro') is not None else "Foro não encontrado"
                    desc = casa.find('desc/para').text if casa.find('desc/para') is not None else "Descrição não encontrada"
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


def main():
    output_folder = 'html'

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    diretoria_xml = 'MapaRuas-materialBase/texto'
    htmlFromXml(diretoria_xml,output_folder)


if __name__ == "__main__":
    main()