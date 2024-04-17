const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3001;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { GoogleGenerativeAI } = require("@google/generative-ai");



app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/TextExtractor").then(() => {
    console.log("Connected to MongoDB")
})

const Users = mongoose.model('user', {
    username: String,
    email: String,
    password: String,
    otp: String, // Adding OTP field
    otpExpires: Date, // Adding OTP expiration field
    createdAt: { type: Date, default: Date.now }
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ishaanbharadwaj111@gmail.com', // Your email
        pass: 'czuxurukbmkufqkz' // Your email password
    }
});

// Function to send OTP via email
function sendOTP(email, otp) {
    const mailOptions = {
        from: 'ishaanbharadwaj111@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for verification is: ${otp}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

app.post('/signup', async (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    let user = await Users.findOne({ username: username, email: req.body.email });
    if (!user) {
        try {
            const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
            const otpExpires = new Date(Date.now() + 600000); // OTP expires in 10 minutes
            user = new Users({ ...req.body, otp: otp, otpExpires: otpExpires });
            user.password = await bcrypt.hash(user.password, saltRounds);
            await user.save();
            // Send OTP via email
            sendOTP(user.email, otp);
            return res.send("OTP sent for verification");
        } catch (err) {
            res.status(400).send(err)
        }
    } else {
        res.send("Email or Username already in use.");
        console.log("Email or Username already in use")
    }
});

// Verify OTP route
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    console.log(req.body)
    try {
        const user = await Users.findOne({ email: email, otp: otp, otpExpires: { $gt: Date.now() } });
        if (user) {
            // OTP is valid
            user.otp = null; // Clear OTP
            user.otpExpires = null; // Clear OTP expiration
            await user.save();
            return res.send("OTP verified successfully");
        } else {
            return res.status(400).send("Invalid OTP or OTP expired");
        }
    } catch (err) {
        console.error("Error verifying OTP:", err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Find user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });
        
        console.log("Login Successfully");
        res.status(200).json({ message: 'Found successfully.', token, username: user.username });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




const enrichedDataSchema = new mongoose.Schema({
    pageNumber: Number,
    originalText: String,
    enrichedText: String
});

const EnrichedData = mongoose.model('EnrichedData', enrichedDataSchema);

const genAI = new GoogleGenerativeAI("AIzaSyBjqipWC2jUx8rTtCKnT8EEGGZKOADZPrg"); // Replace YOUR_API_KEY with your actual API key
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function run(prompt) {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        return text;
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
}

async function main() {
    try {
        const chatGptResponses = [];
        const loader = new PDFLoader("pdf/cloud.pdf", {
            splitPages: true,
        });

        const docs = await loader.load();
        const totalPages = docs.length;

        for (let i = 0; i < totalPages; i++) {
            const text = docs[i].pageContent;
            // console.log(`Page ${i} data => ${text} \n ---------------------------------------------\n`);

            const truncatedText = text.substring(0, 500);

            const gptText = await run(`I have data from PDF, enrich it: ${truncatedText}`);
            // console.log("Enriched data => ");
            // console.log(gptText);

            const enrichedData = new EnrichedData({
                pageNumber: i + 1,
                originalText: text,
                enrichedText: gptText
            });
            await enrichedData.save();

            // console.log("\n --------------------------------------------------------- \n");
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
    } finally {
        mongoose.disconnect();
    }
}

// Define a GET endpoint to fetch enriched data from MongoDB
app.get('/enrichedData', async (req, res) => {
    console.log("Request recieved");
    try {
        const data = await EnrichedData.find({});
        console.log(data);
        res.send({message:'success', data:data });
          
    } catch (error) {
        console.error("Error fetching enriched data:", error);
        res.status(500).json({ error: "An unexpected error occurred" });
    }
});


// Backend route to save content associated with the user
app.post('/saveContent', async (req, res) => {
    const { content, username } = req.body;
  
    try {
      // Find user by username
      const user = await Users.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Save content to the user
      user.content = content;
      await user.save();
  
      console.log('Content saved for user:', username);
      res.status(200).json({ message: 'Content saved successfully' });
    } catch (error) {
      console.error('Error saving content:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
// Run the main function to process PDF and save data to MongoDB
main();





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
