import json
import sys

def processar_json(input_file):
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    atoresDict = {}
    generosDict = {}
    filmesDict = data['filmes']
    
    for filme in filmesDict:
        for ator in filme['cast']:
            if ator not in atoresDict:
                atoresDict[ator] = {'id': len(atoresDict)+1, 'name': ator}
        for genero in filme['genres']:
            if genero not in generosDict:
                generosDict[genero] = {'id': len(generosDict)+1, 'name': genero}
    
    data['atores'] = list(atoresDict.values())
    data['generos'] = list(generosDict.values())

    for filme in filmesDict:
        newCast = []
        newGenders = []
        for ator in filme['cast']:
            newCast.append(atoresDict[ator])
        for genero in filme['genres']:
            newGenders.append(generosDict[genero])
        
        filme['cast'] = newCast
        filme['genres'] = newGenders
    
    return data


def salvar_json(data, output_file):
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":    
    novo_json = processar_json(sys.argv[1])
    salvar_json(novo_json, sys.argv[2])