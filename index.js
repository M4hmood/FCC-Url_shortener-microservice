require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//without database

const urls = [];
let id = 1;

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const regex = /^(http|https):\/\//;
  if (regex.test(url)) {
    res.json({ original_url: url, short_url: id });
    urls.push({ original_url: url, short_url: id });
    id++;
    return;
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urls[shortUrl -1]["original_url"];
  res.redirect(originalUrl);
});

//with url documents deployed in mongoDB database
/*
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  orignalUrl: String,
  shortUrl: Number
});

const Urls = mongoose.model('Urls', urlSchema);

let id = 1;

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const regex = /^(http|https):\/\//;
  if (regex.test(url)) {
    res.json({ original_url: url, short_url: id });
    Urls.create({ original_url: url, short_url: id }, (err, data) => {
      if (err) return console.log(err);
      done(null, data);
    });
    //Urls.create({ original_url: url, short_url: id });
    id++;
    return;
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  let originalUrl = '';
  Urls.find({ shortUrl: shortUrl}, (err, foundUrl) => {
    if (err) return console.log(err);
    originalUrl = foundUrl;
  });
  //originalUrl = Urls.find({ shortUrl: shortUrl});
  res.redirect(originalUrl);
});
*/

//or i could use this, for the URL verification in handling POST requests:
/*
const dns = require('dns');

const hostname = 'www.example.com';

dns.lookup(hostname, (err, address) => {
  if (err) {
    console.error(`Error: ${err.message}`);
  } else {
    console.log(`IP Address for ${hostname} is ${address}`);
  }
});
*/

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
