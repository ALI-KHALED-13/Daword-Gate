const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { memoryStorage } = require('multer');
const app = express();

/* media storage set */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
  })
const upload = multer({ storage: storage});


const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'daword-gate@outlook.com',
        pass: 'alialtwaff13',
    }
});

const options = {
    from: 'daword-gate@outlook.com',
    to: 'alialtwaff@gmail.com',
}


app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));

app.use(cors());

const port_number = process.env.PORT || 3000;
app.listen(port_number, ()=>{
    console.log('listening server')
});

app.get('/', (req, res)=>{
    res.sendFile('./public/index.html', {root: __dirname});
})


app.post('/message', (req, res)=>{
        options.subject = req.body.type;
        options.text = `
        رسالة من ${req.body.name} عمره ${req.body.age}.

        متن الرسالة : 

        ${req.body.message}.
        the  sender email is ${req.body.VisitorEmail}
        `;
        transporter.sendMail(options, (err, info)=> {
            if (err){ 
                console.log(err);
                res.sendFile('./public/error_message.html', {root: __dirname})
            } else { 
                console.log('sent: ' + info.response);
                res.sendFile('./public/thank_you.html', {root: __dirname});
            }
        });
});


app.post('/add', upload.array('photos', 5) ,(req, res)=>{

    if (req.files.length){
        options.subject = 'suggestion to add ' + req.body.type + " in " + req.body.page_name;
        options.text = `
        أقتراح من ${req.body.visitorName} عمره ${req.body.age}.

        وصف المقترح : 

        ${req.body.describtion}.
        the  sender email is ${req.body.VisitorEmail}
        `;
        options.attachments = req.files.map(fileObj=>{
            return {
                filename: fileObj.originalname,
                path: fileObj.path,
            }
        });
        transporter.sendMail(options, (err, info)=> {
            if (err){ 
                console.log(err);
                res.sendFile('./public/error_message.html', {root: __dirname})
            } else { 
                console.log('sent: ' + info.response);
                res.sendFile('./public/thank_you.html', {root: __dirname});
            }
        });
        
    } else {
        options.subject = 'suggestion to add ' + req.body.type + " in " + req.body.page_name;
        options.text = `
        أقتراح من ${req.body.visitorName} عمره ${req.body.age}.

        وصف المقترح : 

        ${req.body.describtion}.
        the  sender email is ${req.body.VisitorEmail}
        `;
        transporter.sendMail(options, (err, info)=> {
            if (err){ 
                console.log(err);
                res.sendFile('./public/error_message.html', {root: __dirname})
            } else { 
                console.log('sent: ' + info.response);
                res.sendFile('./public/thank_you.html', {root: __dirname});
            }
        });
        
    }
    
})
