// app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
// Middleware to block access to specific endpoints
app.use('/album/:image', (req, res, next) => {
  const requestedImage = req.params.image;

  // Specify the image files you want to block access to
  const blockedImages = ['sunrise.png', 'blocked-image2.png'];

  if (blockedImages.includes(requestedImage)) {
    return res.status(403).send('Access Forbidden');
  }

  // Continue to the next middleware if the image is not blocked
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Load images from album.json
const images = require('./data/album.json');
// Middleware to block access to specific endpoints


app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/album', (req, res) => {
  res.render('album', { images });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
