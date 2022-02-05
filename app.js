const {response} = require('express');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./model/blog.ejs');
let port = 3001;



const app = express();
const dbURI='mongodb+srv://App:Rock%409645@cluster0.vzvcq.mongodb.net/Webed?retryWrites=true&w=majority';

mongoose.connect( dbURI,{useNewUrlParser:true ,useUnifiedTopology:true})
.then(result =>{
    console.log('connected');

    app.listen(port);
console.log("Server running at "+ port);
})
.catch(err =>{
    console.log(err);
})



// server setup
app.set('view engine' , 'ejs');
// morgan
app.use(morgan('dev'));
// static
app.use(express.static('public'));

app.use(express.urlencoded({extended:true}));

// home page ------> all blogs
app.get('/', (req,res) =>{

    
    Blog.find().sort({createdAt : -1})
    .then(result=>{
        res.render('index' ,{title: 'Webed | Home',blogs:result});

    })
    .catch(err => console.log(err));


    
}

);

// create blog
app.get('/Create', (req,res) =>{
    res.render('create' ,{title: 'Create Blog'});
});

app.post('/Create', (req,res) =>{
    
    const blog = new Blog(req.body);

    blog.save()
        .then(result => {

            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        })




});
// single blog page
app.get('/Blog/:id', (req,res) =>{

    const id = req.params.id;

    Blog.findById(id)
        .then(result => {

            res.render('blog', { title: result,blog:result });
        })
        .catch(err => { console.log(err) })

    
});

// editor page ...............

app.get('/Editor', (req,res) =>{
    

    Blog.find().sort({createdAt : -1})
    .then(result=>{
        res.render('editor' ,{title: 'Webed | Editor',blogs:result});

    })
    .catch(err => console.log(err));



    
});

app.delete('/Blog/:id', (req, res) => {

    const id = req.params.id;
    const myResponse = {
        status:'sucess'
    }

    Blog.findByIdAndDelete(id)
        .then(result => {

            res.json(myResponse)
        })

        .catch(err => { console.log(err) })


});
app.get('/edit/:id' , (req,res) =>{

    const id = req.params.id;

    Blog.findById(id)
        .then(result => {

            res.render('edit', { title: result,blog:result });
        })
        .catch(err => { console.log(err) })
    })
app.post('/edit/:id', async (req,res)=>{
    const id = req.params.id;
    req.body = await body.findById(req.params.id)
    let body = req.body
    body.heading = req.body.title
    body.body = req.body.description
    body.author = req.body.author

})



// middleware
app.use((req,res)=>{
    res.send('404 not found')
});