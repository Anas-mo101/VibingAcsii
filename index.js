const express = require('express')
const app = express()
const server = require('http').createServer(app);
const bodyparser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const {v4:uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const Admin = require('./models/admin');
const Statistics = require('./models/statistics');

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
    if(req.session.user){
        res.render("dashboard"); 
    }else{
        res.render("login", {flag: "Session Ended"});
    }
});

app.get('/', async (req, res) => { // collect statistics
    Statistics.updateOne({id: req.session.user},
        {
            $inc: { 
                frontpageVisits: 1
            } 
        },
    function(err, result){
        if(err){
            console.log("Error: " + err);
        }
    });
    res.render("frontpage"); 
});

app.get('/gallery', async (req, res) => {
    Statistics.updateOne({id: req.session.user},
        {
            $inc: { 
                galleryVisits: 1
            } 
        },
    function(err, result){
        if(err){
            console.log("Error: " + err);
        }
    });
    res.render("gallery"); 
});

app.get('/login', async (req, res) => { 
    res.render("login"); 
});

app.get('/holders', async (req, res) => {
    Statistics.updateOne({id: req.session.user},
        {
            $inc: { 
                holderVisits: 1
            } 
        },
    function(err, result){
        if(err){
            console.log("Error: " + err);
        }
    });
    res.render("holders"); 
});

app.get('/admin-logout', async (req, res) => {    
    if(req.session.user){
        req.session.user = undefined;
        res.render("login", {flag: "Logged out"});
    }else{
        res.render("login", {flag: "Session Ended"});
    }
});

// ============== post ===================

app.post('/??', async (req, res) => { 

});

app.post('/admin-login-creds', async (req, res) => {    
    Admin.findOne({
        email: req.body.email
    }, (err, result) => {
        if(result && !err){
            var temp = bcrypt.compareSync(req.body.pass,result.password);
            if(temp){
                req.session.user = result.id;
                res.redirect("dashboard");
            }else{
                res.render("login", {flag: "Invalid Username/Password"});
            }
        }else{
            res.render("login", {flag: "User Does Not Exist"});
        }
    });
});


// // Create admin
// const admin = new Admin({
//     id: uuidv4(),
//     name: "anmo",
//     restname: "mcd",
//     email: "admin@va.com",
//     password: "admin"
// });
// admin.save()

// Create statistics
// const statistics = new Statistics({
//     frontpageVisits: 0,
//     galleryVisits: 0,
//     holderVisits: 0,
//     osDirects: 0,
// });
// statistics.save()
