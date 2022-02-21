const express = require('express')
const app = express()
const server = require('http').createServer(app);
const bodyparser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const {v4:uuidv4} = require('uuid');
const bcrypt = require('bcrypt');

const port = process.env.PORT || 3000;

mongoose.connect(`mongodb+srv://anmoiotadmin:anmoiotadmin@clusteriot.h9pwp.mongodb.net/VA?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Database connection successful');
    server.listen(port, () => console.info(`listening on port ${port}`));
})
.catch(err => {
    console.error('Database connection error: ' + err);
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extened: true}));

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('public'));
app.use("/css" , express.static(__dirname + "public/css"));
app.use("/js" , express.static(__dirname + "public/js"));
app.use("/media" , express.static(__dirname + "public/media"));
app.set('views', "./views");
app.set('view engine', 'ejs');

// ============ get =============

app.get('/dashboard', async (req, res) => { 
    res.render("dashboard"); 
});

app.get('/', async (req, res) => { 
    res.render("frontpage"); 
});

app.get('/gallery', async (req, res) => { 
    res.render("gallery"); 
});

app.get('/login', async (req, res) => { 
    res.render("login"); 
});

app.get('/holders', async (req, res) => { 
    res.render("holders"); 
});

app.get('/single', async (req, res) => { 
    res.render("single"); 
});

// ============== post ===================

app.post('/??', async (req, res) => { 

});