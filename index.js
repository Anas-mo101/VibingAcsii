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
const VaNft = require('./models/nft-col');
const Nft = require('./nft_/auth');
// const Moralis = require('./nft_/moralis');

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

app.use('/public', express.static('public'));
app.set('views', "./views");
app.set('view engine', 'ejs');

// ============ get =============

app.get('/dashboard', async (req, res) => { 
    if(req.session.user){
        if(req.body.panel = "monitor"){
            Statistics.findOne({}, (err, result) => { 
                if (err || !result) {
                    console.log(err);
                    res.render("dashboard", {option: req.query.panel, fpv: "", gpv: "", hpv: "", osd: ""});
                } else {
                    res.render("dashboard", {option: req.query.panel,fpv: result.frontpageVisits, gpv: result.galleryVisits, hpv: result.holderVisits, osd: result.osDirects});
                } 
            })
        }else if(req.body.panel = "edit"){
            res.render("dashboard", {option: req.query.panel});
        }
    }else{
        res.render("login", {flag: "Session Ended"});
    }
});

app.post('/panel', async (req, res) => { 
    if(req.session.user){
        res.redirect('dashboard/?panel=' + req.body.panel);
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

app.get('/gallery-collection', async (req, res) => {
    VaNft.find({}, (err, result) => { 
        if (err || !result) {
            console.log(err);
            res.status(500).json({})
        } else {
            res.status(200).json(result)
        } 
    })
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

app.post('/auth-wallet', async (req, res) => { 
    const ownership = await Nft.isOwner(req.body.wid);
    if(ownership.isHolder){
        res.status(200).json({success: true, url: null, message: null});
    }else{
        res.status(200).json({success: false, url: null, message: 'No Vibing Ascii Owned !'});
    }
});

app.post('/admin-login-creds', async (req, res) => {    
    Admin.findOne({
        email: req.body.email
    }, (err, result) => {
        if(result && !err){
            const temp = bcrypt.compareSync(req.body.pass,result.password);
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


// const va = new VaNft({
//     name: 'On Some Other Level',
//     desc: "You just leveled up",
//     image:'onthelevevl.png',
//     url:'https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/75876625577037056561078655283912763371900539884597186659402012268505581223937',
//     price:'--',
//     sold: false
// });
// va.save();
