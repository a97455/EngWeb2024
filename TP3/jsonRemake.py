import json
import sys

def processar_json(input_file):
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    atores = {}
    generos = {}
    filmes = data['filmes']
    
    for filme in filmes:
        for ator in filme['cast']:
            if ator not in atores:
                atores[ator] = {'id': len(atores)+1, 'name': ator}
        for genero in filme['genres']:
            if genero not in generos:
                generos[genero] = {'id': len(generos)+1, 'name': genero}
    
    data['atores'] = list(atores.values())
    data['generos'] = list(generos.values())
    
    return data


def salvar_json(data, output_file):
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":    
    novo_json = processar_json(sys.argv[1])
    salvar_json(novo_json, sys.argv[2])