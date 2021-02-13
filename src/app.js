const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const hbs = require('hbs')
const axios = require('axios')
const flash = require('express-flash')
const session = require('express-session')
const apiURL = require('../constants')

const app = express()
const port = process.env.PORT || 3000
const resourcePath = path.join(__dirname,'../resource')

app.use(cors());
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())
app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));

// PATH FOR DIFFERENT RESOURCES
const viewsPath = path.join(__dirname,'../template/views')
const partialsPath = path.join(__dirname,'../template/partials')


//setup handlebars engine and views location
app.set( 'view engine', 'hbs')
app.set( 'views', viewsPath)
hbs.registerPartials(partialsPath)
app.use( express.static(resourcePath))

// To get home page
app.get('/',async (req, res) =>{
    const response = await axios.get(apiURL+'/memes')
    var data = await response.data
    
    var message = req.flash('message')
    req.flash('message','')
    res.status(200).render('index', {
        data,
        message : message
    })
})

// POST portal for creating meme
app.post('/',async (req,res)=>{
    var data = {
        name : req.body.name,
        caption : req.body.caption,
        url : req.body.url
    }
    await axios({
        method: "post",
        url: apiURL+'/memes',  
        data : data
    })
    .then( response => {
        console.log(response.data)
        req.flash('message','Memes added successfully.')
    })
    .catch( err => req.flash('message',"Meme already exists. Cannot upload duplicate meme."))
    
    res.redirect('/')
})

// POST portal for updating meme
app.post('/updatememe',async (req,res)=>{
    
    var data = {
        caption : req.body.caption,
        url : req.body.url
    }
    //console.log(data)

    await axios({
        method: "patch",
        url: apiURL+'/memes/'+req.body.id,  
        data : data
    })
    .then( response => console.log(response))
    .catch( err => console.log(err.response))

    req.flash('message','Memes updated successfully.')
    res.redirect('/')
})

// POST portal to render update page for requested meme
app.post('/memes/edit/:id',async (req,res)=>{
    const response = await axios.get(apiURL+'/memes/'+req.params.id)
    const data = await response.data
    res.render('updatepage',{data})
})

// POST request for deleting meme
app.post('/memes/delete/:id',async (req,res)=>{
    var data = {
        id : req.params.id
    }
    var returndata
    await axios({
        method: "DELETE",
        url: apiURL+'/memes/'+req.params.id,  
        data : data
    })
    .then( response => returndata = response)
    .catch( err => console.log(err.response))
    req.flash('message','Memes deleted successfully')
    res.redirect('/')
})

// POST request for searching memes by ID
app.post('/memesbyid',async (req, res)=>{
    
    const response = 'dfa'
    await axios.get(apiURL+'/memes/'+req.body.id).then(response => {
        const data1 = response.data
        console.log(response.data)
        if(data1){
            var data = []
            data.push(data1)
            console.log(data)
            res.render('index', {data})
        }
        else
        {
            res.status(404).render('errorMssg',{
                error : " Error 404",
                head : "Meme not found",
                message : "Please try again with proper meme ID.",
            })
        }
    }).catch(err => {
        res.status(404).render('errorMssg',{
            error : " Error 404",
            head : "Meme not found",
            message : "Please try again with proper meme ID.",
        })
    })
        
})

// POST request for rendering error message for invalid URL
app.get('*', (req,res) => {
    res.status(404).render('errorMssg',{
        error : " Error 404",
        head : "Invalid URL",
        message : "Please try again with proper address.",
    })
})

// PORT allocation for frontend
app.listen(port, ()=>{
    console.log("Server started at "+ port)
})