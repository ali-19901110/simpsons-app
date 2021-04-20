'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended:true}));


// Specify a directory for static resources
app.use(express.static('./public'));


// define our method-override reference
app.use(methodOverride('_method'));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// Use app cors


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
app.get('/',renderhomepage)
app.post('/',rendedatabase)
app.get('/favorite-quotes',rendermyfav)
app.get('/favorite-quotes/:quote_id',renderdetails)
app.put('/favorite-quotes/:quote_id',editone);
app.delete('/favorite-quotes/:quote_id',deleteone);


// callback functions
function renderhomepage(req,res){
    let url ='https://thesimpsonsquoteapi.glitch.me/quotes?count=10'

    superagent.get(url)
    .set('User-Agent', '1.0')
    .then(result=>{
        console.log(result.body);
        res.render('index',{data:result.body});
    })
}

function rendedatabase(req,res){
   let chart =req.body.chart;
   let quote =req.body.qoute;
   let img =req.body.img;

   let sql='insert into mytable(chart,quote,img) VALUES ($1,$2,$3)'
   let values=[chart,quote,img]
   client.query(sql,values).then(result=>{
      console.log(result.rows);
       res.redirect('/');
   })

}

function rendermyfav(req,res){
    let sql='select * from mytable'

    client.query(sql).then(result=>{
        res.render('favorite-quotes',{data:result.rows})
    })
}

function renderdetails(req,res){
    console.log('test');
    let id=req.params.quote_id;
    let sql='select * from mytable where id=$1'

    client.query(sql,[id]).then(result=>{
        res.render('details',{data:result.rows[0]})
    })
}

function editone(req,res){
    let id=req.body.id;
    let chart =req.body.chart;
    let quote =req.body.qput;
    let img =req.body.img;
    chart,quote,img
    let sql='UPDATE mytable SET chart = $1, quote = $2,img=$3 WHERE id=$4'
    let val=[chart,quote,img,id];
    client.query(sql,val).then(()=>{
        res.redirect(`/favorite-quotes/${id}`)
    })
}

function deleteone(req,res){
    let id=req.body.id;
    let sql ='delete from mytable where id=$1'
    client.query(sql,[id]).then(()=>{
        res.redirect('/favorite-quotes');
    })

}
// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
