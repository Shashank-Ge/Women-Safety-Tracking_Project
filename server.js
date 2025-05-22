require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

app.use(bodyParser.json());

app.post('/send-sms', (req, res) => {
    const { contacts, message } = req.body;

    contacts.forEach(contact => {
        client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: contact.number
        })
        .then(message => console.log(message.sid))
        .catch(error => console.error(error));
    });

    res.send('Messages sent');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});