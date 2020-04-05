const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressSantizer = require('express-sanitizer');
const uri = "mongodb+srv://blogapp:appblog123@yelpcamp-fwbl5.mongodb.net/blog_app?retryWrites=true&w=majority";
const port = 3000;
const app = express();

//APP CONFIG
mongoose.connect(uri);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSantizer());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");


//MONGOOSE MODEL SCHEMA
let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);


//ROUTES

app.get("/", (req, res) => {
    res.redirect("/blogs");
});

//INDEX
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW
app.get("/blogs/new", (req,res) => {
    res.render("new");
});

//CREATE
app.post("/blogs", (req, res) => {
    //create blog
    req.body.blog.body = req.sanatize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err) {
            res.render("new");
        } else {
            //redirect to index
            res.redirect("/blogs")
        }
    });
});

//SHOW
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err) {
            res.redirect("/blogs");
        } else { 
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanatize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
       if(err) {
           res.redirect("/blogs");
       } else {
            res.redirect("/blogs/" + req.params.id);
       }
    });
});

//DELETE
app.delete("/blogs/:id", (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})


app.listen(port, () => console.log(`BlogApp listening on port ${port}!`));