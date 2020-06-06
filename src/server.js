const express = require("express")
const server = express()

// pegar o db
const db = require("./database/db.js")

// configurar pasta publica
server.use(express.static("public"))

// habilitar o uso do req.body na nossa aplicacao
server.use(express.urlencoded({ extended: true }))

// utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server, 
    noCache: true
})


//configurar caminhos na minha aplicacao
//pagina inicial
// req: requisicao
// res: resposta
server.get("/", (req, res) => {
    return res.render("index.html", { title: "Um título" })
})

server.get("/create-point", (req, res) => {

    // req.query : Query Strings da url somente GET
    //console.log(req.query)


    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    // req.body: O corpo do formulario - habilitar com server.use
    //console.log(req.body)

    // inserir dados no bd
    const query = `
         INSERT INTO places (
             image,
             name,
             address,
             adress2,
             state,
             city,
             items 
         ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.adress2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            return console.log(err)
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData) 


    
})

server.get("/search", (req, res) => {

    const search = req.query.search

    if(search == "") {
        // pesquisa vazia
        return res.render("search-results.html", { total: 0 })
    }

    // pegar os dados do db
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err) {
            return console.log(err)
        }
        const total = rows.length

        // mostrar a pagina html com os dados do db
        return res.render("search-results.html", { places: rows, total: total})       
    })
})

//ligar o servidor
server.listen(3000)