const express = require('express')
const app = express()
const dotenv = require("dotenv")
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require("mongoose")

// const keys = require("./config/keys")
dotenv.config()
app.use(cors())
const port = process.env.PORT || 8000;
// app.options('*', cors());

// set the public
app.use(express.static("public"))

// set the vidw engine
app.set("view engine", "ejs")

mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.set('useFindAndModify', false)

mongoose.connect(process.env.MONGOURI, {  
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify : false
 })
 .then(()=>{console.log('db connected')})
 .catch((error)=>{console.log(error.message)})


// express json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.json({ type: 'application/*+json' }))

//  register the models 
require('./models/userModel')
require('./models/categoryModel')

// // api routes
const apiRoutes = require('./routes/api')
// const webRoutes = require('./routes/web')
app.use(process.env.APP_VERSION, apiRoutes)
// app.use(webRoutes)

app.listen(port, ()=> console.log(`server running on ${port}`))