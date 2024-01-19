// app.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const session = require('express-session');
const morgan = require('morgan');
const { blue, red, rainbow, grey, green, yellow } = require('colors')
const app = express();
const port = 3400;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.get('/album/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'public', 'album', filename);

 // // Check if the file exists
  if (fs.existsSync(imagePath) && validateImageToken(req.query.token, filename)) {
  res.sendFile(imagePath);
  } else {
    res.status(403).send('Access Forbidden');
  }
});

// Generate a unique token for each image request
const generateImageToken = (filename) => {
  const secret = 'krappy-paddie'; // replace with a strong secret key
  const hash = crypto.createHmac('sha256', secret).update(filename).digest('hex');
  return hash;
};

// Validate the token
const validateImageToken = (token, filename) => {
  return token === generateImageToken(filename);
};

//app.use(express.static(path.join(__dirname, 'public')));

// Load images from album.json
const images = require('./data/album.json');
// Middleware to block access to specific endpoints
app.use((req, res, next) => {
  const viewCountPath = path.join(__dirname, 'data', 'viewcount.json');

  // Read the view count data
  fs.readFile(viewCountPath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading view count:', err);
          return res.status(500).send('Internal Server Error');
      }

      const viewCount = JSON.parse(data);
      req.viewCount = viewCount;
      next();
  });
});

// Middleware to calculate server uptime
app.use((req, res, next) => {
  req.startTime = new Date();
  next();
});


app.get('/', (req, res) => {
  res.render('loading');
});
app.get('/home', (req, res) => {
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

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render('404');
});


// Schedule the Git commit and push every 2 minutes
setInterval(async () => {
  await commitAndPush();
}, 2 * 60 * 1000);
app.listen(3401, '0.0.0.0', ()=>{
     console.log(grey(`Server is running on http://localhost:${port}`));
 console.log(red("Website turned on"))
console.log(blue("Website Status: online"))

  console.log(rainbow(`  
 [===========================================]
              Photo Album  
                Working...
         Developed by Dayln,G
[===========================================]`))
console.log(green("System Working"))

})

// Function to read viewcount.json data
async function readViewCountData() {
  const filePath = path.join(__dirname, 'data', 'viewcount.json');
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading viewcount.json:', error.message);
    return { count: 0 }; // Return a default value if the file doesn't exist or has an issue
  }
}
