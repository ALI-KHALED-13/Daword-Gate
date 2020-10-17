const messages = [];

const express = require('express');

const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

/* media storage set */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let name = file.originalname;
      cb(null, file.fieldname + '-' + Date.now() + name.slice(name.lastIndexOf('.')))
    }
  })
const upload = multer({ storage: storage })



app.use(express.static('./Public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));

app.use(cors());

app.listen(3000, ()=>{
    console.log('listening server')
});

app.get('/', (req, res)=>{
    res.sendFile('./public/index.html', {root: __dirname});
})


app.post('/message', (req, res)=>{
        req.body.date = new Date().toDateString();
        messages.push(req.body);
        fs.writeFile('visitors_messages.txt', 
        messages.map(mes=> JSON.stringify(mes, null, '\n')).join('\n'), 
        (er)=> {
            if (er) {
                console.log(er);
                res.sendFile('./public/error_message.html', {root: __dirname});
            }
        });

        res.sendFile('./public/thank_you.html', {root: __dirname});
})


app.post('/add', upload.array('photos', 5) ,(req, res)=>{
    req.body.date = new Date().toDateString();

    if (req.files.length){
        const files = req.files;
        fs.writeFile( 
            `./uploads/${Date.now()}.txt`,
            JSON.stringify(req.body, null, '\n'), 
            (er)=> {
                if (er) {
                    console.log(er);
                    res.sendFile('./public/error_message.html', {root: __dirname});
                }
            });
        res.sendFile('./public/thank_you.html', {root: __dirname});
    } else {
        messages.push(req.body);
        fs.writeFile('visitors_messages.txt', 
        messages.map(mes=> JSON.stringify(mes, null, '\n')).join('\n'), 
        (er)=> {
            if (er) {
                console.log(er);
                res.sendFile('./public/error_message.html', {root: __dirname});
            }
        });

        res.sendFile('./public/thank_you.html', {root: __dirname});
    }
})
