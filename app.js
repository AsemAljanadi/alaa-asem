const express = require('express');
const app = express();
const User = require('./models/user');
const Question = require('./models/question');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;


app.set('view engine', 'ejs');

//////////////////////////////////////////////
let mycookie;
function checkIfIsCookie(req){
    let cc = req.headers.cookie;
    if(cc !== undefined){
        arr = cc.split(';');
        let c = arr[arr.length - 1];
        let a = c.split('%22');
        mycookie = {username:a[3],level:a[7]} 
    }
    else{
        mycookie = {username:'',level:''}
    }
    
}

//////////////////////////////
const dbURI = 'mongodb+srv://alaa:12Ra12ga2016d@nodetest.rosfk.mongodb.net/thequestions?retryWrites=true&w=majority';
mongoose.connect(dbURI,{useNewUrlParser:true, useUnifiedTopology:true})
    .then((result) => {
        app.listen(port);
        console.log('connection is established');
    })
    .catch((err) => console.error(err))

console.log('Alaa');

// midelware static files

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({extended: true})); // accepting form data

////////////////// normal route

app.get('/add-user',(req, res) => {
    checkIfIsCookie(req);
    if(mycookie.level == '0'){
        res.render('addUser', {title: 'Add a New User', username:mycookie.username, level:mycookie.level});
    }
    else{
        res.status(404).render('404',{title:'404 Page Not Found!'});   
    }
})

app.get('/', (req,res) => {
    checkIfIsCookie(req);
    console.log(mycookie);
    if(mycookie.username !=''){ 
        res.render('index',{title:'Home', islogedin:true, username:mycookie.username, level:mycookie.level});
    }
    else{
        res.render('index',{title:'Home', islogedin:false});
    }
    
});

app.get('/all-questions', (req,res) => {
    checkIfIsCookie(req);
    if(mycookie.level == '0'){
        Question.find()
        .then((result) => {
            res.render('all-questions',{title:'All Questions', questions:result, username:mycookie.username, level:mycookie.level,pageNumber:1});
        })
    }
    else{
        res.status(404).render('404',{title:'404 Page Not Found!'});
    } 
});
app.get('/my-questions', (req,res) => {
    checkIfIsCookie(req);
    Question.find()
        .then((result) => {
            myQuestions = result.filter(item => {
                return item.author == mycookie.username 
            })
            console.log(myQuestions);
            res.render('my-questions',{title: 'My Questions',questions:myQuestions, username:mycookie.username, level:mycookie.level,pageNumber:1})
        })
        .catch((err) => {console.log(err)});

})
app.get('/my-questions/del/:id', (req,res) => {
    checkIfIsCookie(req);
    let id = req.params.id;
    Question.findByIdAndDelete(id)
        .then((result) => {
            res.redirect('/my-questions');
        })
        .catch((err) => {console.log(err)});

})

app.get('/all-questions/del/:id', (req,res) => {
    checkIfIsCookie(req);
    let id = req.params.id;
    Question.findByIdAndDelete(id)
        .then((result) => {
            res.redirect('/all-questions');
        })
        .catch((err) => {console.log(err)});

})
////////////////// End OF normal route


///////////////// post route

app.post('/all-questions', (req,res) => {
    checkIfIsCookie(req);
    console.log(req.body);
    Question.find()
        .then((result) => {
            res.render('all-questions',{title:'All Questions', questions:result, username:mycookie.username, level:mycookie.level,pageNumber:req.body.Page});
        })
        .catch((err) => {console.log(err)});
});

app.post('/my-questions', (req,res) => {
    checkIfIsCookie(req);
    console.log(req.body);
    Question.find()
        .then((result) => {
            myQuestions = result.filter(item => {
                return item.author == mycookie.username 
            })
            res.render('my-questions',{title: 'My Questions',questions:myQuestions, username:mycookie.username, level:mycookie.level,pageNumber:req.body.Page})
        })
        .catch((err) => {console.log(err)});
});

app.post('/', (req,res) => {
    console.log('al',req.body);
    if(req.body.iwantlogout == 'iwantlogout'){
        res.cookie('currentUser',{username:'', level:''});
        res.redirect('/');
    }
    if (req.body.userName && req.body.passWord){
        User.find()
            .then((result) => {
                console.log(result);
                result.map((user) => {
                    if(user.username == req.body.userName && user.password == req.body.passWord){
                        res.cookie('currentUser',{username:user.username, level:user.level});
                        res.redirect('/');
                    }
                })
            })
            .catch((err) => console.log(err));
    }

    if (req.body.newUserName && req.body.newPassWord && req.body.newPassWord2 && req.body.newPassWord == req.body.newPassWord2){
        const newUser = new User({
            username: req.body.newUserName,
            password: req.body.newPassWord,
            level: '2',
        })
        newUser.save()
            .then((result) => {
                console.log('User has been saved');
                res.redirect('/');
            })
            .catch((error) => {
                console.log(error);
                res.redirect('/');
            })
    }
    
    if (req.body.question) {
        const question = new Question(req.body)
        question.save()
            .then((result) => {
                console.log('data has been saved');
                res.redirect('/')
            })
            .catch((err) => {console.log(err)})
    }
})



/////////////////////////// end of post route

// not find - at the end only bcs it is invoked when nothing up is matched.
app.use((req,res) => {
    res.status(404).render('404',{title:'404 Page Not Found!'});
})