import json
import sys

def processar_json(input_file):
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    periodosDict = {}
    compositoresDict = data['compositores']
    
    for compositor in compositoresDict:
        if compositor['periodo'] not in periodosDict:
            periodosDict[compositor['periodo']] = {'id': str(len(periodosDict)+1), 'name': compositor['periodo']}
    
    data['periodos'] = list(periodosDict.values())

    for compositor in compositoresDict:
        compositor['periodo'] = str(periodosDict[compositor['periodo']]['id'])

    return data


def salvar_json(data, output_file):
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":    
    novo_json = processar_json(sys.argv[1])
    salvar_json(novo_json, sys.argv[2])