exports.compositoresListPage = function(slist, d){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <link rel="icon" href="favicon.jpg"/>
            <link rel="stylesheet" href="w3.css"/>
            <title>Compositores</title>
        </head>

        <body>
            <div class="w3-card-4">

                <header class="w3-container w3-teal">
                    <h1>Compositores
                    <a class="w3-btn w3-round w3-grey" href="/alunos/registo">+</a>
                    </h1>
                </header>
        
                <div class="w3-container">
                    <table class="w3-table-all">
                        <tr>
                            <th>Name</th>
                            <th>Bio</th>
                            <th>Data de Nascimento</th>
                            <th>Data de Obito</th>
                            <th>Actions</th>
                        </tr>`
    for(let i=0; i < slist.length ; i++){
        pagHTML +=      `<tr>
                            <td>
                                <a href="/compositores/${slist[i].id}">${slist[i].nome}</a>
                            </td>
                            <td>${slist[i].bio}</td>
                            <td>${slist[i].dataNasc}</td>
                            <td>${slist[i].dataObito}</td>
                            <td>
                                [<a href="/compositores/edit/${slist[i].id}">Edit</a>]
                                [<a href="/compositores/delete/${slist[i].id}">Delete</a>]
                            </td>
                        </tr>`
    }

    pagHTML +=      `</table>
                </div>

                <footer class="w3-container w3-blue">
                    <h5>Generated in EngWeb2024 in ${d}</h5>
                </footer>
            </div>
        </body>
    </html>`
    return pagHTML
}


exports.studentFormPage = function(d){
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
            <title>Student Form</title>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h2>Student Form</h2>
                </header>
            
                <form class="w3-container" method="POST">
                    <fieldset>
                        <legend>Metadata</legend>
                        <label>Id</label>
                        <input class="w3-input w3-round" type="text" name="id"/>
                        <label>Name</label>
                        <input class="w3-input w3-round" type="text" name="nome"/>
                        <label>Git</label>
                        <input class="w3-input w3-round" type="text" name="gitlink"/>
                    </fieldset>

                    <fieldset>
                        <legend>TPC</legend>
                        <input class="w3-check" type="checkbox" name="tpc1" value="1"/>
                        <label>TPC1</label>
                        <input class="w3-check" type="checkbox" name="tpc2" value="1"/>
                        <label>TPC2</label>
                        <input class="w3-check" type="checkbox" name="tpc3" value="1"/>
                        <label>TPC3</label>
                        <input class="w3-check" type="checkbox" name="tpc4" value="1"/>
                        <label>TPC4</label>
                        <input class="w3-check" type="checkbox" name="tpc5" value="1"/>
                        <label>TPC5</label>
                        <input class="w3-check" type="checkbox" name="tpc6" value="1"/>
                        <label>TPC6</label>
                        <input class="w3-check" type="checkbox" name="tpc7" value="1"/>
                        <label>TPC7</label>
                        <input class="w3-check" type="checkbox" name="tpc8" value="1"/>
                        <label>TPC8</label>
                    </fieldset>  
                    <br/>
                    <button class="w3-btn w3-purple w3-mb-2" type="submit">Register</button>
                </form>

                <footer class="w3-container w3-purple">
                    <h5>Generated by EngWeb2024 in ${d} - [<a href="/alunos">Return</a>]</h5>
                </footer>
            
            </div>
    `
}

exports.studentFormEditPage = function(a, d){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="w3.css"/>
            <title>Student Form</title>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-purple">
                    <h2>Student Form</h2>
                </header>
            
                <form class="w3-container" method="POST">
                    <fieldset>
                        <legend>Metadata</legend>
                        <label>Id</label>
                        <input class="w3-input w3-round" type="text" name="id" readonly value="${a.id}"/>
                        <label>Name</label>
                        <input class="w3-input w3-round" type="text" name="nome" value="${a.nome}"/>
                        <label>Git</label>
                        <input class="w3-input w3-round" type="text" name="gitlink" value="${a.gitlink}"/>
                    </fieldset>

                    <fieldset>
                        <legend>TPC</legend>
                    `

    for(i=1; i < 9; i++){
        var tpc = "tpc" + i
        if(tpc in a){
            pagHTML += `<input class="w3-check" type="checkbox" name="tpc${i}" value="1" checked/>
                        <label>TPC${i}</label>
                        `
        }
        else{
            pagHTML += `<input class="w3-check" type="checkbox" name="tpc${i}" value="1"/>
                        <label>TPC${i}</label>
                        `
        }
    }                

    pagHTML += `
                    </fieldset>  
                    <br/>
                    <button class="w3-btn w3-purple w3-mb-2" type="submit">Register</button>
                </form>

                <footer class="w3-container w3-purple">
                    <h5>Generated by EngWeb2024 in ${d} - [<a href="/alunos">Return</a>]</h5>
                </footer>
            
            </div>
    `
    return pagHTML
}

// ---------------Student's Page--------------------------------
// Change and adapt to current dataset...
exports.compositorPage = function(compositor, d ){
    var pagHTML = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>${compositor.nome}</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.jpg"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-card-4">
                <header class="w3-container w3-teal">
                    <h1>${compositor.nome}</h1>
                </header>

                <div class="w3-container">
                    <ul class="w3-ul w3-card-4" style="width:50%">
                        <li><b>Nome: </b> ${compositor.nome}</li>
                        <li><b>Bio: </b> ${compositor.bio}</li>
                        <li><b>Data de Nascimento: </b> ${compositor.dataNasc}</li>
                        <li><b>Data de Obito: </b> ${compositor.dataNasc}</li>
                    </ul>
                </div>
        
                <footer class="w3-container w3-teal">
                    <address>Gerado por aluno::EngWeb2024 em ${d} - [<a href="/compositores">Voltar</a>]</address>
                </footer>
            </div>
        </body>
    </html>`
    return pagHTML
}

// -------------- Error Treatment ------------------------------
exports.errorPage = function(errorMessage, d){
    return `<p>${d}: Error: ${errorMessage}</p>`
}