const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const bcrypt = require('bcrypt');

mongoose.set('strictQuery', true);

// For File Uploads, require express-fileupload 
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/MP");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileUpload()); // File uploading
app.use(
    session({
      secret: "thisIsASecret",
      resave: false,
      saveUninitialized: false,
      expires: 600000
    })
  );
app.use(passport.initialize());
app.use(passport.session());

const User = require("./model/User");
const Resource = require("./model/Resource");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ROUTES
app.get('/', (req, res) => {
    res.render('index', {
        username: '',
        password: '',
        error : ''
    });
    /* User.find({}, function(err, rows) {
        if (err){
            console.log(err);
        } else {
            res.render('index', {
                users : rows
            });
        }
      }); */
});

app.get('/signUp', (req, res) => {
    res.render('signUp', {
    });
});

app.get('/about', (req, res) => {
    Resource.find({}, function(err, rows) {
        console.log(rows);
        if (err){
            console.log(err);
        } else {
            res.render('about', {
                resources : rows
            });
        }
    });
});

app.get('/add', (req, res) => {
    
    Resource.find({}, function(err, rows) {
        console.log(rows);
        if (err){
            console.log(err);
        } else {
            res.render('add', {
                resources : rows
            });
        }
    });
});

// need to get username
app.post('/addDoc', (req, res) => {
    const username = req.session.username;

    var date = new Date();
     
    // Check if the file is included in the request
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }

    // Following the name attribute of the file input in index.html:
    const file = req.files.myFile;
    const path = __dirname + "/public/uploads/" + file.name; 

    console.log("File Name: " + file.name);
    console.log("File Path: " + path);

    // Reflect Added Documnet
    const resource = new Resource({
        username: username,
        course: req.body.course,
        type: req.body.docType,
        title: req.body.title,
        description: date,
        likes: 0,
        document: '/uploads/' + file.name
    });

    // Save file in the system by using file.mv
    file.mv(path, (err) => {
        resource.save(function(err) {
            if (err) {
            console.log(err);
            return;
            } else {
                res.redirect("uploads");
            }
        });
    });
});

// WORKING EDIT
app.get('/edit/:title', (req, res) => {
    const title = req.params.title;
    
    Resource.find({}, function(err, list) {
        Resource.find({ username: req.session.username, title: title }, function(err, rows) {
            console.log(rows);
            if (err){
                console.log(err);
            } else {
                res.render('edit', {
                    views: list,
                    resources : rows
                });
            }
        });
    });
});

// WORKING UPDATE DOC
app.post('/updateDoc', (req, res) => {
    const resId = req.body.id;
    const query = { _id: resId };
    const course = req.body.course;
    const type = req.body.docType;
    const title = req.body.title;
    var date = new Date();
    const description = date;

    console.log(resId);
    console.log(type);
    console.log(title);
    
    Resource.updateOne(query, {course: course, type: type, title: title, description: description}, function(err, result) {
            if (err){
                console.log(err);
            } else {
                res.redirect("/uploads");
            }
    });
});

app.get('/deleteRes/:resId', (req, res) => {
    const resId = req.params.resId;
    
    Resource.find({}, function(err, list) {
        Resource.find({}, function(err, rows) {
            console.log(rows);
            Resource.findByIdAndRemove(resId, function(err) {
                if (err){
                    console.log(err);
                } else {
                    res.render('uploads', {
                        views: list,
                        resources : rows
                    });
                }
            });
        });
    });
});

app.get('/profile', (req, res) => {
    console.log(req.session.username);
    username = req.session.username;

    User.find({ username: req.session.username }, function(err, rows) {
        if (err){
            console.log(err);
        } else {
            res.render('profile', {
                users : rows
            });
        }
    });
});

app.get('/uploads', (req, res) => {
    const username = req.session.username;

    Resource.find({}, function(err, list) {
        Resource.find({ username: username }, function(err, rows) {
            if (err){
                console.log(err);
            } else {
                res.render('uploads', {
                    views : list,
                    resources : rows
                });
            }
        });
    });

});

app.get('/view/:resId', (req, res) => {
    const resId = req.params.resId;

    Resource.find({}, function(err, list) {
        Resource.find({ _id: resId }, function(err, rows) {
            console.log(rows);
            if (err){
                console.log(err);
            } else {
                res.render('view', {
                    views : list,
                    resources : rows
                });
            }
        });
    });
});

// WORKING SIGN UP
app.post('/signUp', (req, res) => {
    console.log(req.body.password);

    const user = new User({
        name: req.body.name,
        occupation: req.body.occupation,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    },
    function(err,user){
        if (err) {
            console.log(err);
            res.redirect("/signUp");
          } else {
            passport.authenticate("local")(req, res, function () {
              res.redirect("/uploads");
            });
          }
    });
    user.save(function(err) {
        if (err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//WORKING LOGIN??
app.post("/login", function (req, res) {
    var username = req.body.username;
    let password = req.body.password;
    /* const hash = bcrypt.hashSync(password, 10);

    console.log(req.body.username);
    console.log(req.body.password);
    console.log(hash); */

    User.findOne({username: username}, function (err, user) {
        if (user){
            let passCheck = bcrypt.compareSync(password, user.password);
            /* console.log(user.password);
            console.log(password);
            console.log(passCheck); */

            if(passCheck) {
                req.session.username = user.username;
                req.session.loggedIn = true;
                console.log(req.session.username);
                res.redirect("/uploads");
            }
        } else {
            console.log(err);
            res.redirect("/");
        }
    });

    /* const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    console.log(req.body.username);
    console.log(req.body.password);

    req.login(user, function (err) {
      if (err) {
        console.log(err);
        res.render('index', {
          username: req.body.username,
          password: req.body.password,
          error : 'Incorrect username/password'
      });
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/uploads");
        });
      }
    }); */
});

// WORKING EDIT PROFILE
app.get('/editProfile/:username', (req, res) => {
    const username = req.params.username;

    User.find({username: username}, function (err, result) {
        if (err){
            console.log(err);
        } else {
            res.render('editProfile', {
                user : result[0]
            });
        }
    });
});

// WORKING UPDATE
app.post('/updateUser/:username', (req, res) => {
    const oldUser = req.params.username;
    const query1 = { username: oldUser };
    const userId = req.body.id;
    const query2 = { _id: userId };
    const name = req.body.name;
    const occupation = req.body.occupation;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hash = bcrypt.hashSync(password, 10);
    
    
    User.updateOne(query2, {name: name, occupation: occupation, username: username, email: email, password: hash}, function(err, result) {
        Resource.updateMany(query1, {username: username}, function(err, result) {
            if (err){
                console.log(err);
            } else {
                res.redirect("/profile");
            }
        });
    });
});

// WORKING DELETE
app.get('/deleteUser/:username', (req, res) => {
    const username = req.params.username;
    const query = { username: username };

    User.deleteOne(query, { username: username }, function(err, result) {
        Resource.deleteMany(query, { username: username }, function(err, result) {
            if (err){
                console.log(err);
            } else {
                res.redirect("/");
            }
        });
    });
});

app.get("/logout", function (req, res) {
    req.logout(function(err){
      if (err){ }
      res.redirect("/");
    });
});

app.listen(3000, function(){
    console.log("Server start at port 3000");
});
