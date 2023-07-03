const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const qrcode = require('qrcode-terminal');
require('dotenv').config();

const dbHost = process.env.MONGO_DB;
const port = process.env.PORT;

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
}) 


const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
app.use(
  cors({
    origin: "", // Replace with your React app's URL
  })
);



// Connect to your MongoDB database
mongoose.connect(
  dbHost,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

client.on('qr', (qr) => {
  qrcode.generate(qr, {small: true});
  // Generate and scan this code with your phone
  console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
  console.log('Client is ready!');

  app.post("/api/saveWhatsappNumber", async (req, res) => {
    const { whatsappNumber } = req.body;
    arr.push(`91${whatsappNumber}@c.us`);
    console.log(arr, "heelooo")
  
    try {
      // Check if the number already exists in the database

      const existingNumber = await WhatsAppNumber.findOne({
        number: whatsappNumber,
      });
      if (existingNumber) {
        // if the customer is already exsited then also he will receive the msg
        // client.on('ready', async() => {
        //   console.log('Client is ready!');
        
        //   await sendDirectMessage(arr);
        //   arr = []
        // });
        console.log(arr)
        sendDirectMessage(arr)
        arr = [];
        // Number already exists, return response indicating existing membership
        return res.json({ isExistingMember: true });
      }
  
      // Number is new, save it to the database
      await WhatsAppNumber.create({ number: whatsappNumber });
      //if the customer not a member then it will store into database then msg will be send
      // client.on('ready', () => {
      //   console.log('Client is ready!');
      
      //   sendDirectMessage(arr);
      //   arr = []
      // });
  
      sendDirectMessage(arr)
      arr = [];
  
      // Return success response
      return res.json({ isExistingMember: false });
    } catch (error) {
      console.log(error);
      // Return error response
      return res.status(500).json({ error: "An error occurred" });
    }
  });

});

// Define the WhatsAppNumber schema
const whatsappNumberSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
});

// Create the WhatsAppNumber model
const WhatsAppNumber = mongoose.model("WhatsAppNumber", whatsappNumberSchema);

let arr = [];
// API route for saving the WhatsApp number


async function sendDirectMessage(number) {
  // const number = ['917666675791@c.us','919680757415@c.us','917887726583@c.us','919680757415@c.us','919680757415@c.us','919680757415@c.us','919680757415@c.us','919680757415@c.us']; // Replace with the recipient's phone number
  const message = 'Hello, this is a direct message!'; // Replace with your message
      try {
          await client.sendMessage(number, message);
          console.log('Message sent successfully!');
        } catch (error) {
          console.error('Error sending message:', error);
        }
  }


client.initialize();

// Start the server
app.listen(port, () => {
  console.log("Server is running on port 5000");
});

