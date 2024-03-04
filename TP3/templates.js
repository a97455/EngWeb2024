exports.createListaFilmesHTML = function(filmes){
    pagHTML = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Lista de Filmes</title>
        <link rel="stylesheet" href="/w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-blue">
              <h1>Lista de Filmes</h1>
            </header>
            
            <div class="w3-container">
                <table class="w3-table w3-striped">
                    <tr>
                        <th>Título</th>
                        <th>Ano</th>
                        <th>Elenco</th>
                        <th>Género</th>
                    </tr>`
    filmes.forEach(function(filme) {
        pagHTML += `<tr>
                        <td><a href='/filmes/${filme.id}'>${filme.title}</a></td>
                        <td>${filme.year}</td>
                        <td>${filme.cast.map(actor => actor.name).join(', ')}</td>
                        <td>${filme.genres.map(genre => genre.name).join(', ')}</td>
                    </tr>`
    })
    pagHTML += `</table>
            </div>
            
            <footer class="w3-container w3-blue">
              <h5>TPC3 in EngWeb2024</h5>
            </footer>
        </div>
    </body>
</html>`
    
    return pagHTML
}


exports.createFilmeHTML = function(filme){
    pagHTML=`
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>${filme.title}</title>
        <link rel="stylesheet" href="/w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-blue">
                <h1>${filme.title}</h1>
            </header>
            
            
            <div class="w3-container">
                <ul class="w3-ul w3-border">
                    <li><strong>Título:</strong> ${filme.title}</li>
                    <li><strong>Ano:</strong> ${filme.year}</li>
                    <li><strong>Elenco:</strong>
                    ${filme.cast.map(actor => `<a href="/atores/${actor.id}">${actor.name}</a>`).join(', ')}
                    </li>
                    <li><strong>Géneros:</strong>
                    ${filme.genres.map(genre => `<a href="/generos/${genre.id}">${genre.name}</a>`).join(', ')}
                    </li>
                </ul>
            </div>
            
            <footer class="w3-container w3-blue">
                <h5>TPC3 in EngWeb2024</h5>
            </footer>
        </div>
    </body>
</html>`

    return pagHTML
}


exports.createListaGenerosHTML = function(generos){
    pagHTML = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Lista de Géneros</title>
        <link rel="stylesheet" href="/w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-blue">
              <h1>Lista de Géneros</h1>
            </header>
            
            <div class="w3-container">
                <table class="w3-table w3-striped">
                    <tr>
                        <th>Nome</th>
                    </tr>`
    generos.forEach(function(genero){
        pagHTML += `<tr>
                        <td><a href='/generos/${genero.id}'>${genero.name}</a></td>
                    </tr>`
    })
    pagHTML += `</table>
            </div>
            
            <footer class="w3-container w3-blue">
              <h5>TPC3 in EngWeb2024</h5>
            </footer>
        </div>
    </body>
</html>`
    
    return pagHTML
}


exports.createGeneroHTML = function(genero){
    pagHTML=`
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>${genero.name}</title>
        <link rel="stylesheet" href="/w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-blue">
                <h1>${genero.name}</h1>
            </header>
            
            <div class="w3-container">
                <ul class="w3-ul w3-border">
                    <li><strong>Nome:</strong> ${genero.name}</li>
                </ul>
            </div>
            
            <footer class="w3-container w3-blue">
                <h5>TPC3 in EngWeb2024</h5>
            </footer>
        </div>
    </body>
</html>`

    return pagHTML
}


exports.createListaAtoresHTML = function(generos){
    pagHTML = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Lista de Atores</title>
        <link rel="stylesheet" href="/w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-blue">
              <h1>Lista de Atores</h1>
            </header>
            
            <div class="w3-container">
                <table class="w3-table w3-striped">
                    <tr>
                        <th>Nome</th>
                    </tr>`
    generos.forEach(function(ator){
        pagHTML += `<tr>
                        <td><a href='/atores/${ator.id}'>${ator.name}</a></td>
                    </tr>`
    })
    pagHTML += `</table>
            </div>
            
            <footer class="w3-container w3-blue">
              <h5>TPC3 in EngWeb2024</h5>
            </footer>
        </div>
    </body>
</html>`
    
    return pagHTML
}


exports.createAtorHTML = function(ator){
    pagHTML=`
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>${ator.name}</title>
        <link rel="stylesheet" href="/w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-blue">
                <h1>${ator.name}</h1>
            </header>
            
            <div class="w3-container">
                <ul class="w3-ul w3-border">
                    <li><strong>Nome:</strong> ${ator.name}</li>
                </ul>
            </div>
            
            <footer class="w3-container w3-blue">
                <h5>TPC3 in EngWeb2024</h5>
            </footer>
        </div>
    </body>
</html>`

    return pagHTML
}