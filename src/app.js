const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const hbs = require('hbs')
const axios = require('axios')
//const bootstrap = require('bootstrap')

const app = express()
const port = process.env.PORT || 3000

app.use(cors());
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/bootstrap',express.static((__dirname+ '/node_modules/bootstrap/dist')))

// PATH FOR DIFFERENT RESOURCES
const viewsPath = path.join(__dirname,'../template/views')
const partialsPath = path.join(__dirname,'../template/partials')


//setup handlebars engine and views location
app.set( 'view engine', 'hbs')
app.set( 'views', viewsPath)
hbs.registerPartials(partialsPath)

// https://global-uploads.webflow.com/5ef5480befd392489dacf544/5f9f5e5943de7e69a1339242_5f44a7398c0cdf460857e744_img-image-p-1080.jpeg
// https://images.shiksha.com/mediadata/images/1488957338php64h36h.jpeg
// https://bloximages.newyork1.vhttps://www.google.com/url?sa=i&url=https%3A%2F%2Fdavidbaptistechirot.blogspot.com%2F2017%2F03%2Fmeme-background.html&psig=AOvVaw2DXYXFbwJ2FViNh9g-hbfV&ust=1613184136858000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOD7r9Wp4-4CFQAAAAAdAAAAABAKip.townnews.com/oanow.com/content/tncms/assets/v3/editorial/9/e5/9e516270-456f-11e6-a64d-b39d9c0ac062/57804b262725b.image.jpg?resize=1200%2C800


app.get('/',async (req, res) =>{
    const response = await axios.get('https://memestreambackend.herokuapp.com/memes')
    const data = await response.data
    //console.log(data)
    res.render('index', {data})
})

app.post('/',(req,res)=>{
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    var date = new Date(Date.now())
    var date = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
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