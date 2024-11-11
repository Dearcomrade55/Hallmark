const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Serve static files
app.use(express.static(path.join(__dirname)));

// Parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Route to handle form submission
app.post('/submit', upload.single('image'), (req, res) => {
  const { address, email, phone } = req.body;
  const imageFile = req.file ? req.file.filename : 'No image uploaded';

  // Format data
  const data = `Address: ${address}, Email: ${email}, Phone: ${phone}, Image: ${imageFile}\n`;

  // Save text data to a file
  fs.appendFile('data.txt', data, (err) => {
    if (err) throw err;
    console.log('Data saved!');
  });

  // Send response back to user
  res.send('Thank you for participating.To be happy you are the winner you got ₹ 1000');
});


app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});
