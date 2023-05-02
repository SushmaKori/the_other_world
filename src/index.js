var express = require('express');  
var app = express()  
app.set('view engine','ejs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./key_project.json");
const IS_EMULATOR = ((typeof process.env.FUNCTIONS_EMULATOR === 'boolean' && process.env.FUNCTIONS_EMULATOR) || process.env.FUNCTIONS_EMULATOR === 'true');

if (IS_EMULATOR) {
    firestore.settings({
      host: 'localhost',
      port: '3000',
      ssl: false
    })
}

const
     { FieldValue } = require('firebase-admin/firestore');
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const appLocals = require('./app-local.js');
app.locals = appLocals

app.get('/', function(req, res){
    res.render("main",{});
})
app.get('/signup', function (req, res) { 
    res.render("signup",{});
})
app.get("/signSubmit", function (req, res) { 
    console.log("abcde")
    db.collection('data_users').add({
        name: req.query.user,
        email: req.query.email,
        password: req.query.pass,
        score:0,
    }).then(()=>{
        var obj = ["register done successfully"];
        res.render("msg", {data:obj});
    })
});         
app.get('/login', function (req, res) { 
    res.render("log", {});
})
var email;
var pass;

app.get("/loginSubmit", function(req, res){
    email = req.query.email;
    pass = req.query.pass;
    if(req.query.email == "sushma@gmail.com" && req.query.pass == "1234"){
        db.collection('data_users').get().then((docs)=>{
            scoreboard = []
            docs.forEach((doc)=>{
                if(doc.data().email != "sushma@gmail.com"){
                 scoreboard.push({user: doc.data().email, score:Number(doc.data().score)});
                }
            });
            scoreboard.sort((a, b) => b.score - a.score);
            console.log(scoreboard);
            res.render("adash",{data:scoreboard});
        })
       
    }
    else{
      db.collection("data_users").where('email', '==', req.query.email).where('password','==',req.query.pass).get().then((docs)=>{
        var flag = false;
        docs.forEach((doc)=>{
            flag = true;
            let array1 = {user : doc.data().user};
            res.render("dash", {data: array1});
        })
        if(flag == false){
            var obj = ["Invalid Credentials"];
            res.render("msg", {data:obj});
        }
    })
  }
});

app.get('/regame', function(req, res) {
    res.render("dash.ejs",{})
});

// app.get("/startgame", function(req,res){
//       res.render("game_h", {});
// })
app.get('/startgame', function(req, res) {
    res.render("game_h.ejs",{})
});

app.get('/thegame', function(req, res) {
    res.render("game.ejs",{})
//     data = {foo:"https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple"};
//    res.setHeader('Content-Type', 'application/json');
//     res.send(JSON.stringify(data));
});
app.get('/result', function(req, res){
    db.collection('data_users').where('email' ,"==", email).where('password' ,"==", pass).get().then((docs)=>{
        docs.forEach((doc)=>{
            db.collection("data_users").doc(doc.id).update({score : req.query.score});
        })
    })
    res.render("score.ejs",{})
});

app.listen(3000, function () {  
    console.log('Example app listening on port 3000!')  
})
