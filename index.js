require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View Engine Setup
app.engine('handlebars', exphbs({ defaultLayout: false }));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', async (req, res) => {
  const output = `
  <p>Email from My Portfolio</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>   
  </ul>
  <h3>Message</h3>
  <p>${req.body.bodyText}</p>
  `;
  const test = output;

  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
      },
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Personal Portfolio Contact" <${process.env.EMAIL}>`, // sender address
      to: process.env.EMAIL, // list of receivers
      subject: 'Message from Portfolio', // Subject line
      text: 'Hello world?', // plain text body
      html: test, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.render('contact', { msg: 'Email has been sent' });
  } catch (err) {
    console.log(err);
  }
});
app.listen(process.env.PORT || 5000, () => {
  console.log('Running Server on port 5000');
});
