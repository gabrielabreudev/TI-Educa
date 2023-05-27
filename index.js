const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session")
const connection = require("./database/database")

//chamando controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UserController");

//chamando models
const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

// configurando view engine
app.set('view engine', 'ejs'); 

//configurando sessões
app.use(session({
    secret: "adshjvcfdd234wadsjd", cookie: {maxAge: 3000000}
}))

//carregar arquivos estaticos
app.use(express.static('public'));

// configurando body-parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//conectando ao database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão com sucesso");
    }).catch((error) => {
        console.log(error);
    })

//importando controllers
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);


//rota principal
app.get("/", (req,res) => {
   Article.findAll({
    order: [['id', 'DESC']], limit: 2
   }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        })
   })
})

app.get("/:slug", (req,res) => {
    var slug = req.params.slug
    Article.findOne({
       where: {slug: slug} 
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            })
        } else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })  
 })

 app.get("/category/:slug", (req,res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {slug: slug}, include: [{model: Article}]    
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories})
            })
        } else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
 })

//iniciar o servidor
app.listen(8080);