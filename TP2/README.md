# TPC2: Mapa das Cidades de Portugal
## 2024-02-22

## Autor

- A97455
- Henrique Nuno Marinho Malheiro

## Resumo

O TPC consiste na criação dum servidor das páginas web de cada uma das cidades do dataset do mapa. Sugere-se a sua divisão nas tarefas seguintes:

- Processamento do dataset com uma script em Python, para desmembrar o dataset criando uma página web para cada cidade: c1.html, c2.html, ..., cn.html, e uma página principal, de nome "index.html", com um índice de cidades (poderá ser um índice a dois níveis: lista de distritos ordenada alfabeticamente e para cada distrito uma sublista de cidades ordenadas alfabeticamente);

- A página de cada cidade deverá conter a informação da cidade e um bloco com as ligações a outras cidades, cada ligação materializada num link que corresponde a nova chamada ao servidor como se descreve abaixo.

- Criar um servidor node que sirva os registos:
    
    localhost:porta/ (envia a página index.html a quem fez o pedido)
    
    localhost:porta/c1 (envia a página c1.html a quem fez o pedido)
    
    localhost:porta/c2 (envia a página c2.html a quem fez o pedido)
    
    localhost:porta/...

- Todos os links inseridos nas páginas HTML devem ser chamadas ao servidor, na forma "localhost:porta/...".