// app.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Load images from album.json
const images = require('./data/album.json');

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
