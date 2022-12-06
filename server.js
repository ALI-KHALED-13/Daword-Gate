const express = require('express');
const cors = require('cors');
const formData = require("express-form-data");
const nodemailer = require('nodemailer');
const app = express();

app.use(express.static('./public'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(formData.parse({uploadDir: './public/uploads', autoClean: true}))





const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'daword-gate@outlook.com',
        pass: 'alialtwaff13',
    }
});

const mailDetails = {
    from: 'daword-gate@outlook.com',
    to: 'aliknake@gmail.com',
}




const port_number = process.env.PORT || 3000;
app.listen(port_number, ()=>{
    console.log('listening server')
});

app.get('/', (req, res)=>{
    res.sendFile('./public/index.html', {root: __dirname});
})


app.post('/message', (req, res)=>{
    mailDetails.subject = req.body.type;
    mailDetails.text = `
        رسالة من ${req.body.name} عمره ${req.body.age}.

        متن الرسالة : 

        ${req.body.message}.
        the  sender email is ${req.body.VisitorEmail}
    `;
    transporter.sendMail(mailDetails, (err, info)=> {
        if (err){ 
            console.log(err);
            res.sendFile('./public/error_message.html', {root: __dirname})
        } else { 
            console.log('sent: ' + info.response);
            res.sendFile('./public/thank_you.html', {root: __dirname});
        }
    });
});


app.post('/add', (req, res)=>{
    mailDetails.subject = 'suggestion to add ' + req.body.type + " in " + req.body.page_name;
    mailDetails.text = `
        أقتراح من ${req.body.visitorName} عمره ${req.body.age}.

        وصف المقترح : 

        ${req.body.describtion}.
        the  sender email is ${req.body.VisitorEmail}
    `;
    mailDetails.attachments = [req.files.media].flat(1).map(fileObj=>{
        return {
            filename: fileObj.originalname,
            path: fileObj.path,
        }
    }); 

    transporter.sendMail(mailDetails, (err, info)=> {
        if (err){ 
            console.log(err);
            res.sendFile('./public/error_message.html', {root: __dirname})
        } else { 
            console.log('sent: ' + info.response);
            res.sendFile('./public/thank_you.html', {root: __dirname});
        }
    });
    
})
