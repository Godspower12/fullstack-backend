const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const feedRoutes = require('./routes/feed');

const app = express();


// Ensure 'images' directory exists
const imageDir = path.join(__dirname, 'images');
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
}


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const safeName = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
        cb(null, safeName);
    }
})

const fileFilter= (req, file, cb) => {
 if(
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
 ) {
    cb(null, true)
} else { 
    cb(null, false)
 }  
}

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
   
app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message: message})

});

mongoose.connect('mongodb+srv://ogbudhugodspower:2rnvVRV3727fQeFc@cluster0.cmnzv9g.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0')
.then( result => {
    app.listen(8080);

}).catch(err => console.log(err))
