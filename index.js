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
const Vaholders = require('./models/vaholders');
const Posts = require('./models/posts');

var helper = require('./nft_/helper');

const {getCollection, isOwner, VaOwned} = require('./nft_/os-api.js'); // need plan B since os api is not reliable e.g. username & password

let maintainance_lock = false;

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

// ================= Middleware ================

const maintainanceCheck = function (req, res, next) {
    Admin.findOne({}, (err, result) => {
        if(result.maintainance){
            maintainance_lock = true;
        }else{
            maintainance_lock = false;
        }
    });
    next();
}

app.use(maintainanceCheck);

// ============ get =============

app.get('/dashboard', async (req, res) => { 
    if(req.session.user){
        if(req.query.panel == "monitor"){
            Statistics.findOne({}, (err, result) => { 
                if (err || !result) {
                    console.log(err);
                    res.render("dashboard", {option: req.query.panel, fpv: "", gpv: "", hpv: "", osd: ""});
                } else {
                    res.render("dashboard", {option: req.query.panel, fpv: result.frontpageVisits, gpv: result.galleryVisits, hpv: result.holderVisits, osd: result.osDirects});
                } 
            });

        }else if(req.query.panel == "edit"){

            await getCollection()
            .then(collection => {
                if(!Array.isArray(collection) || !collection[0]){
                    res.render("dashboard", {option: req.query.panel, data: []}); 
                }else{
                    res.render("dashboard", {option: req.query.panel, data: collection});
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).json({});
            });

        }else if(req.query.panel == "settings"){

            Admin.findOne({}, (err, result) => {
                if (err || !result) {
                    res.render("dashboard", {option: null});
                } else {
                    let value = result.maintainance ? "Off" : "On";
                    res.render("dashboard", {option: req.query.panel, mms: value});
                } 
            });

        }else{
            res.render("dashboard", {option: null});
        }
    }else{
        res.render("login", {flag: "Session Ended"});
    }
});

app.get('/va-holders', async (req, res) => {
    if(maintainance_lock){
        res.render("maintainance");
    }else{
        if(req.session.user){
            let holder = await Vaholders.findOne({wid: req.session.user}).exec();
            if(holder){
                switch(req.query.club) {
                    case "vafilter":
                        res.render("va-holders", {first: false, name: holder.name, option: "vafilter"});
                        break;
                    case "feed":
                        let posts = await Posts.find({}).exec();
                        res.render("va-holders", {first: false, name: holder.name, option: "feed", posts, helper});
                        break;
                    case "vacollection":
                        let collection = await VaOwned(req.session.user);
                        res.render("va-holders", {first: false, name: holder.name, option: "vacollection",collection});
                        break;
                    default:
                        res.render("va-holders", {first: false, name: holder.name, option: null});
                }
            }else{
                res.render("va-holders", {first: true});
            }
        }else{
            res.render("holders", {flag: "Session Ended"});
        }
    }
});

app.get('/', async (req, res) => { // collect statistics

    if(maintainance_lock){
        res.render("maintainance");
    }else{
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
    
        const collection = await getCollection();
        if(!Array.isArray(collection) || !collection[0]){
            res.render("frontpage", {data: []} ); 
        }else{
            nfts = [];
            Array(5).fill().map(() => {
                nfts.push(collection[ Math.floor(Math.random() * (44 - 0 + 1)) + 0])
            })
            res.render("frontpage", {data: nfts}); 
        }
    }
});

app.get('/gallery', async (req, res) => {

    if(maintainance_lock){
        res.render("maintainance");
    }else{
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

        await getCollection()
        .then(collection => {
            if(!Array.isArray(collection) || !collection[0]){
                res.render("gallery", {data: []} ); 
            }else{
                res.render("gallery", {data: collection}); 
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({});
        })
    }
});

app.get('/login', async (req, res) => { 
    res.render("login"); 
});

app.get('/holders', async (req, res) => {
    if(maintainance_lock){
        res.render("maintainance");
    }else{
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
    }
});

app.get('/admin-logout', async (req, res) => {    
    if(req.session.user){
        req.session.user = undefined;
        res.render("login", {flag: "Logged out"});
    }else{
        res.render("login", {flag: "Session Ended"});
    }
});

app.get('/holder-logout', async (req, res) => {    
    if(req.session.user){
        req.session.user = undefined;
        res.render("holders", {flag: "Logged out"});
    }else{
        res.render("holders", {flag: "Session Ended"});
    }
});



// ============== post ===================

app.post('/maint-mode-switch/:state', async (req, res) => { 
    let value = req.params.state == "On" ? true : false;
    Admin.updateOne({},
        {
            maintainance: value
        },
     function(err, result){
        if(!err && result){
            res.redirect('/dashboard/?panel=' + 'settings');
        }else{
            console.log("Error: " + err);
            res.redirect(500,'/dashboard');
        }
    });
});

app.post('/auth-wallet', async (req, res) => { 
    await isOwner(req.body.wid)
    .then(isHolder => {
        if(isHolder){
            req.session.user = req.body.wid 
            res.redirect("va-holders");
        }else{
            res.render('holders', {flag: 'No Vibing Ascii Owned !'})
        }
    })
    .catch(error => {
        console.error('error:' + err);
        res.render('holders', {flag: 'Server error !'})
    });
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

app.post('/va-holder-first', async (req, res) => {    
    const vaholders = new Vaholders({
        name: req.body.name,
        wid: req.session.user
    });
    vaholders.save()
    res.redirect('va-holders');
});


app.post('/panel', async (req, res) => { 
    if(req.session.user){
        res.redirect('dashboard/?panel=' + req.body.panel);
    }else{
        res.render("login", {flag: "Session Ended"});
    }
});

app.post('/club', async (req, res) => { 
    if(req.session.user){
        res.redirect('va-holders/?club=' + req.body.club);
    }else{
        res.render("holders", {flag: "Session Ended"});
    }
});

app.post('/va-holder-post', async (req, res) => { 
    if(req.session.user){
        Vaholders.findOne({wid: req.session.user}, (err, result) => {
            if(!err){
                if(result){
                    const post = new Posts({
                        id: uuidv4(),
                        pTitle: req.body.title,
                        pDate: new Date(),
                        pText: req.body.text,
                        pAuthor: result.name,
                        pLikes: [],
                        pDislikes: [],
                        pComments: []
                    });
                    post.save()
                    res.redirect('va-holders/?club=feed');
                }
            }else{
                res.render("holders", {flag: "Session Ended"});
            }
        });
    }else{
        res.render("holders", {flag: "Session Ended"});
    }
});

app.post('/va-holder-like-post/:pid', async (req, res) => { // check if user already liked before liking
    if(req.session.user){
        let updateCondition;
        let liked = false;
        let disliked = false;
        let holder = await Vaholders.findOne({wid: req.session.user}).exec();
        let post = await Posts.findOne({id: req.params.pid}).exec();
        
        liked = post.pLikes.some(element => {
           if (element.wid == req.session.user) return true;
        });

        disliked = post.pDislikes.some(element => {
            if (element.wid == req.session.user) return true;
        });

        if(!liked && !disliked){
            updateCondition = {
                $push: { 
                    pLikes: { 
                        name: holder.name,
                        wid: req.session.user
                    } 
                } 
            }
        }else if(liked && !disliked){
            updateCondition = {
                $pull: { 
                    pLikes: { 
                        name: holder.name,
                        wid: req.session.user 
                    } 
                } 
            }
        }

        if(updateCondition){
            Posts.updateOne({id: req.params.pid}, updateCondition,
                (perr,presult) => {
                    if(!perr){
                        res.json({liked, disliked});
                    }else{
                        console.error(err);
                        res.render("holders", {flag: "Session Ended"});
                    }
                }
            );
        }else{
            res.json({liked, disliked});
        }
        
    }else{
        res.render("holders", {flag: "Session Ended"});
    }
});


app.post('/va-holder-dislike-post/:pid', async (req, res) => { // check if user already liked before liking
    if(req.session.user){
        let updateCondition;
        let liked = false;
        let disliked = false;
        // let exist = false;
        let holder = await Vaholders.findOne({wid: req.session.user}).exec();
        let post = await Posts.findOne({id: req.params.pid}).exec();
        
        disliked = post.pDislikes.some(element => {
           if (element.wid == req.session.user) return true;
        });

        liked = post.pLikes.some(element => {
            if (element.wid == req.session.user) return true;
        });

        if(!liked && !disliked){
            updateCondition = {
                $push: { 
                    pDislikes: { 
                        name: holder.name,
                        wid: req.session.user
                    } 
                } 
            }
        }else if(!liked && disliked){
            updateCondition = {
                $pull: { 
                    pDislikes: { 
                        name: holder.name,
                        wid: req.session.user 
                    } 
                } 
            }
        }

        if(updateCondition){
            Posts.updateOne({id: req.params.pid}, updateCondition,
                (perr,presult) => {
                    if(!perr){
                        res.json({liked, disliked});
                    }else{
                        console.error(err);
                        res.render("holders", {flag: "Session Ended"});
                    }
                }
            );
        }else{
            res.json({liked, disliked});
        }
    }else{
        res.render("holders", {flag: "Session Ended"});
    }
});


app.post('/va-holder-reply-post/:pid', async (req, res) => { 
    if(req.session.user){
        Vaholders.findOne({wid: req.session.user}, (err,result) => {
            if(!err && result){
                Posts.updateOne(
                    {id: req.params.pid}, 
                    {
                        $push: { 
                            pComments: { 
                                cAuthor: result.name,
                                cDate: new Date(),
                                cText: req.body.text
                            } 
                        } 
                    },
                    (perr,presult) => {
                        if(!perr && presult){
                            res.redirect('/va-holders/?club=feed');
                        }else{
                            console.error(perr);
                            res.render("holders", {flag: "Session Ended"});
                        }
                    }
                );
            }
        });
    }else{
        res.render("holders", {flag: "Session Ended"});
    }
});


// Create admin
// const admin = new Admin({
//     id: uuidv4(),
//     name: "anmo",
//     restname: "mcd",
//     email: "admin@va.com",
//     password: "admin",
//     maintainance: false
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
