const express = require ("express");
const path = require("path");
const multer =require("multer");
const app=express();
const hbs = require("hbs");
 
require('./db/conn');
const Register = require("./models/registers");
// const { Router } = require("express");

const port = process.env.PORT || 5000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
// router.use(express.static(__dirname + "./public/"))
app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req,res)=>{
    res.render("index");
});

app.get("/register", (req,res)=>{
    res.render("register");
});

app.get("/login", (req,res)=>{
    res.render("login");
});

//img
const storage =multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req,file,cb){
        cb(null,file.fieldname + '_' + Date.now() +
        path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage 
}).single('myImage');

app.post("/register", upload ,async(req,res)=>{
    try {
        const registerEmployee= new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
            myImage: req.file.filename
        })
        const registered = registerEmployee.save();
        res.status(201).render("welcome");
        
    } catch (error) {
        res.status(400).send(error);
    }
});
 

// login checker
app.post("/login", async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        // console.log(`${email} and ${password} `);

        const useremail = await Register.findOne({email:email});
        // res.send(useremail);
        // console.log(useremail);
        if(useremail.password === password)
        {
            res.status(201).render("login");
        }
        else{
            res.send("invalid user!");
        }

    } catch (error) {
        res.status(400).send("invalid inputs");
    }
})



app.listen(port, ()=>{
    console.log(`SERVER IS RUNNING ON ${port}`);
});