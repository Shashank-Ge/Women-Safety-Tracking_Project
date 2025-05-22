const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');
const cors = require('cors');  // Add this line

// Initialize Express app
const app = express(); 

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());  // Add this line

// Your Twilio account SID and Auth Token
const accountSid = 'ACf4ccaaa445d85a2f71f14d492bae2374'; // Replace with your Account SID
const authToken = '3441186bd1a6b59e34956e51e0f91193';   // Replace with your Auth Token

// Create a Twilio client
const client = new twilio(accountSid, authToken);

// Route to send SMS
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/send-sms', (req, res) => {
  const { to, from, body } = req.body;

  client.messages.create({
    body: body,
    from: from,
    to: to
  })
  .then((message) => res.status(200).json({ success: true, sid: message.sid }))
  .catch((error) => res.status(500).json({ success: false, error: error.message }));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
