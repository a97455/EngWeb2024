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

        # Parse do arquivo XML
        tree = ET.parse(caminho_arquivo_xml)
        root = tree.getroot()

        # Escreve o título do HTML com o número e nome da rua
        numero_rua_element = root.find('./meta/número')
        numero_rua = numero_rua_element.text if numero_rua_element is not None else "Número da rua não encontrado"

        nome_rua_element = root.find('./meta/nome')
        nome_rua = nome_rua_element.text if nome_rua_element is not None else "Nome da rua não encontrado"

        # Abre o arquivo HTML para escrita
        html_file = os.path.join(output_folder, f'rua{numero_rua}.html')
        with open(html_file, 'w', encoding='utf-8') as f:
            # Escreve o cabeçalho do HTML
            f.write('<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<title>Informação da Rua</title>\n</head>\n<body>\n')
            # Adiciona o estilo CSS
            f.write('<style>\n')
            f.write('body {\n')
            f.write('    font-family: Arial, sans-serif;\n')
            f.write('    margin: 0;\n')
            f.write('    padding: 0;\n')
            f.write('}\n')
            f.write('.image-container {\n')
            f.write('    display: flex; /* Usa flexbox para alinhar as imagens */\n')
            f.write('    flex-wrap: wrap; /* Permite que as imagens quebrem para uma nova linha */\n')
            f.write('}\n')
            f.write('.image-container .image-with-caption {\n')
            f.write('    width: 50%; /* Define a largura desejada para cada imagem com legenda */\n')
            f.write('    box-sizing: border-box;\n')
            f.write('    padding: 10px;\n')
            f.write('    text-align: center; /* Centraliza o conteúdo dentro do contêiner */\n')
            f.write('}\n')
            f.write('.image-container img {\n')
            f.write('    max-width: 100%; /* Garante que a imagem não ultrapasse a largura do contêiner */\n')
            f.write('    height: auto; /* Mantém a proporção da imagem */\n')
            f.write('}\n')
            f.write('.caption {\n')
            f.write('    margin-top: 5px;\n')  # Adiciona espaço entre a imagem e a legenda
            f.write('    font-size: 14px;\n')  # Define o tamanho da fonte da legenda
            f.write('}\n')
            f.write('</style>\n')
            f.write('</head>\n<body>\n')
            f.write(f'<h1>{nome_rua}</h1>\n')
            
            # Escreve os parágrafos sobre a rua
            paragrafos = root.findall('./corpo/para')
            for para in paragrafos:
                paragrafo = ''

                # Processa o texto do parágrafo
                texto = para.text.strip() if para.text else ''
                paragrafo += texto

                # Processa os elementos filhos do parágrafo
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
                
                    # Processa o texto restante após os elementos filho
                    if elemento.tail:
                        paragrafo += elemento.tail.strip()
                    
                # Escreve o parágrafo no arquivo HTML
                f.write(f'<p>{paragrafo}</p>\n')
            
            # Escreve as imagens da rua
            rua_imagens = []
            for img in root.findall('.//imagem'):
                path_element = img.get('path')
                filename, file_extension = os.path.splitext(os.path.basename(path_element))
                image_path = f"../MapaRuas-materialBase/imagem/{filename}{file_extension}"
                rua_imagens.append(image_path)
                
             # Escreve as imagens no arquivo HTML com as legendas
            f.write('<div class="image-container">\n')
            for img_path in rua_imagens:
                legenda = ''
                # Encontra a legenda correspondente à imagem atual
                for figura in root.findall('.//figura'):
                        imagem_element = figura.find('imagem')
                        if imagem_element is not None:
                            path_element = imagem_element.get('path')
                            if img_path.endswith(os.path.basename(path_element)):
                                legenda_element = figura.find('legenda')
                                if legenda_element is not None:
                                    legenda = legenda_element.text.strip()  # Obtém o texto da legenda
                                    break  # Para a iteração assim que a legenda correspondente for encontrada
                
                # Escreve a tag da imagem com a legenda
                f.write(f'<div class="image-with-caption">\n')
                f.write(f'    <img src="{img_path}" alt="Imagem da Rua">\n')
                f.write(f'    <p>{legenda}</p>\n')
                f.write('</div>\n')
            f.write('</div>\n')

            # Escreve a lista de casas da rua
            lista_casas = root.findall('./corpo/lista-casas/casa')
            # Escreve a lista de casas da rua como uma tabela
            f.write('<h2>Casas:</h2>\n')
            f.write('<table border="1">\n')
            f.write('<tr><th>Número da Casa</th><th>Enfiteuta</th><th>foto</th><th>Descrição</th></tr>\n')
            for casa in lista_casas:
                f.write('<tr>\n')
                numero_casa_element = casa.find('número')
                numero_casa = numero_casa_element.text if numero_casa_element is not None else "Número não encontrado"

                enfiteuta_element = casa.find('enfiteuta')
                enfiteuta = enfiteuta_element.text if enfiteuta_element is not None else "Enfiteuta não encontrado"

                foto_element = casa.find('foto')
                foto = foto_element.text if foto_element is not None else "foto não encontrado"

                desc_element = casa.find('desc/para')
                if desc_element is not None:
                    desc = '<desc><para>'
                    # Processa o texto do parágrafo
                    texto = desc_element.text.strip() if desc_element.text else ''
                    desc += texto

                    # Processa os elementos filhos do parágrafo
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

                        # Processa o texto restante após os elementos filho
                        if elemento.tail:
                            desc += elemento.tail.strip()
                    desc += '</para></desc>'
                else:
                    desc = "Descrição não encontrada"

                f.write(f'<td>{numero_casa}</td><td>{enfiteuta}</td><td>{foto}</td><td>{desc}</td>\n')
                f.write('</tr>\n')
            f.write('</table>\n')
            
            # imagens da vista atual
            rua_imagens_atuais = []
            path_vistas_atuais = "./MapaRuas-materialBase/atual/"
            for img in os.listdir(path_vistas_atuais):
                # Extrai o número da rua do nome do arquivo usando expressões regulares
                match = re.match(r"(\d+)-", img)
                if match:
                    numero_arquivo = match.group(1)
                    if numero_arquivo == numero_rua:
                        vista_atual_path = f"{path_vistas_atuais}{img}"
                        rua_imagens_atuais.append("." + vista_atual_path)
            # Escreve as imagens no arquivo HTML com as legendas
            f.write('<div class="image-container">\n')
            for img_path_atuais in rua_imagens_atuais:
                legenda_atuais =  f' {nome_rua} '

                # Escreve a tag da imagem com a legenda
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

            # Escreve o fim do HTML
            f.write('</body>\n</html>')