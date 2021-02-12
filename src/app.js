const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const hbs = require('hbs')
const axios = require('axios')
//const bootstrap = require('bootstrap')

const app = express()
const port = process.env.PORT || 3000
const resourcePath = path.join(__dirname,'../resource')

app.use(cors());
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))

// PATH FOR DIFFERENT RESOURCES
const viewsPath = path.join(__dirname,'../template/views')
const partialsPath = path.join(__dirname,'../template/partials')


//setup handlebars engine and views location
app.set( 'view engine', 'hbs')
app.set( 'views', viewsPath)
hbs.registerPartials(partialsPath)
app.use( express.static(resourcePath))

app.get('/',async (req, res) =>{
    const response = await axios.get('https://memestreambackend.herokuapp.com/memes')
    const data = await response.data
    //console.log(data)
    var mid = data.length/2, temp;
    for(var i=0; i<data.length/2; i++)
    {
        temp = data[i];
        data[i]=data[data.length - i -1]
        data[data.length - i - 1] = temp
    }
    res.render('index', {data})
})

app.post('/',(req,res)=>{
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    var date = new Date(Date.now())
    var date = `Posted on ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    var data = {
        name : req.body.name,
        caption : req.body.caption,
        imgURL : req.body.imgURL,
        date : date
    }
    //console.log(data)

    axios({
        method: "post",
        url: 'https://memestreambackend.herokuapp.com/memes',  
        data : data
    })
    .then( response => console.log(response))
    .catch( err => console.log(err.response))

    res.redirect('/')
})
app.post('/memes/delete/:id',async (req,res)=>{
    var data = {
        id : req.params.id
    }
    var returndata
    await axios({
        method: "post",
        url: 'https://memestreambackend.herokuapp.com/memes/delete',  
        data : data
    })
    .then( response => returndata = response)
    .catch( err => console.log(err.response))

    res.redirect('/')
})

app.post('/memes/edit/:id',async (req,res)=>{
    
    const response = await axios.get('https://memestreambackend.herokuapp.com/memes/'+req.params.id)
    const data = await response.data
    //console.log(data)
    res.render('updatepage', data[0])
})

app.post('/updatememe',async (req,res)=>{
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    var date = new Date(Date.now())
    var date = `Updated on ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    var data = {
        id : req.body.id,
        name : req.body.name,
        caption : req.body.caption,
        imgURL : req.body.imgURL,
        date : date
    }
    //console.log(data)

    axios({
        method: "post",
        url: 'https://memestreambackend.herokuapp.com/memes/edit',  
        data : data
    })
    .then( response => console.log(response))
    .catch( err => console.log(err.response))

    res.redirect('/')
})

app.post('/memesbyid',async (req, res)=>{
    if(!req.body.id)
        res.redirect('/')
    const response = await axios.get('https://memestreambackend.herokuapp.com/memes/'+req.body.id)
    const data = await response.data
    //console.log(data)
    res.render('index', {data})
})

app.listen(port, ()=>{
    console.log("Server started at "+ port)
})