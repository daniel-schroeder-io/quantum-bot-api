var express        = require('express');
const crypto = require('crypto');
var session        = require('express-session');
var passport       = require('passport');
const bot = require('./bot')
var twitchStrategy = require('passport-twitch-new').Strategy;
const axios = require('axios');
const cors = require('cors');
const dbHelper = require('./utils/databaseHelper');
const validateToken = require("./utils/middleware").validateToken;
const host = `https://${process.env.HOST_URL}` || 'http://localhost'
const port = process.env.PORT || '3000'
require('dotenv').config(); 

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = process.env.SLUG_TWITCH_CLIENT_ID;
const TWITCH_SECRET    = process.env.SLUG_TWITCH_CLIENT_SECRET;
const SESSION_SECRET   = '69696969';
const CALLBACK_URL     = process.env.NODE_ENV == "development" ? "http://localhost:3000/auth/twitch/callback" : process.env.TWITCH_CALLBACK_URL;  // You can run locally with - http://localhost:3000/auth/twitch/callback

// Initialize Express and middlewares
var app = express(); 
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: [
      process.env.NODE_ENV == "development" ? "http://localhost:8080" : process.env.CLIENT_HOST_URL,
      'https://localhost:8080'
    ],
    credentials: true,
    exposedHeaders: ['set-cookie']
})); 

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('twitch', new twitchStrategy({
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_SECRET,
    callbackURL: CALLBACK_URL,
    scope: "user_read",
  },
  async (accessToken, refreshToken, profile, done) => {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    await dbHelper.addUserIfNotExists(profile)
    done(null, profile);
  } 
)); 

app.use(express.json({
  verify: function(req, res, buf, encoding) {
    // is there a hub to verify against
    console.log('HERE IN VALIDATE')
    req.twitch_hub = false;
    if (req.headers && req.headers.hasOwnProperty('twitch-eventsub-message-signature')) {
        req.twitch_hub = true;

        var id = req.headers['twitch-eventsub-message-id'];
        var timestamp = req.headers['twitch-eventsub-message-timestamp'];

        var xHub = req.headers['twitch-eventsub-message-signature'].split('=');

        // you could do
        // req.twitch_hex = crypto.createHmac(xHub[0], config.hook_secret)
        // but we know Twitch always uses sha256
        req.twitch_hex = crypto.createHmac('sha256', 'saucywashisname')
          .update(id + timestamp + buf)
          .digest('hex');
        req.twitch_signature = xHub[1];

        if (req.twitch_signature != req.twitch_hex) {
            console.log('badbad')
            console.error('Signature Mismatch');
        } else {
            console.log('Signature OK');
        }
    }
}
}));

// Set route to start OAuth link, this is where you define scopes to request
app.get("/auth/twitch", passport.authenticate('twitch', { scope: ["user_read", "channel:read:redemptions"] }));

// Set route for OAuth redirect
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/"}), async function(req, res) {
  // Successful authentication, redirect home.
  let _user_id = await dbHelper.findUser(req.session.passport.user.id) 
  req.session.user_id = _user_id;
  console.log(req.session)
  res.redirect("http://localhost:8080/Home");
});



// If user has an authenticated session, display it, otherwise display link to authenticate
app.get('/', validateToken, function (req, res) {
    res.send(`Hello, ${req.session.passport.user.display_name}!`); 
});

app.get('/getUser', validateToken, async function (req, res) {
  let user = await dbHelper.getUser(req.session.passport.user.id)
  res.status(200).send(user); 
});

app.get('/user', validateToken, function (req, res) {
    res.json(req.session.passport.user);
});

app.get('/commands/:userid', validateToken, async (req, res) => {
  console.log(req.params.userid);
  let commands = await dbHelper.listCommandsByUser(req.params.userid);
  res.status(200).json(commands);
});

app.post('/commands', validateToken, async (req, res) => {
  let add = await dbHelper.addCommandsByUser(req.body);
  console.log(add.rowCount)
  res.status(201).send(null);
});


app.post('/add', async (req, res) => {
  testexport.addData(req.body);
  res.status(201).send(testexport.data);
});

app.get('/get', async (req, res) => {
  res.status(200).send(testimport.data);
});

app.post('/channelpoints', (req, res) => {
  
  // Our middleware will run to validate the subscriptions
  // have our secret and are credible
  if (!req.twitch_hub) {
      console.error('EventSub: no Signature');
      res.status(404).send('Route Not Found');
      return;
  }
  if (req.twitch_signature != req.twitch_hex) {
      console.error('EventSub: invalid Signature');
      res.status(403).send('Invalid Signature');
      return;
  }

  // This is the initial subscription verification
  if(req.headers['twitch-eventsub-message-type'] == 'webhook_callback_verification'){
    console.log('validating')
    res.status(200).send(encodeURIComponent(req.body.challenge));
  }
  if(req.headers['twitch-eventsub-message-type'] == 'notification'){
    res.status(200).send('Ok');
    // Handle the loot crate
    if(req.body.event.reward.id == '0422fd1a-bc3e-4f1e-8e2d-0b4fb4248943'){
      bot.openLootBox(req.body.event)
    }
  }
});

app.listen(port, function () {
  console.log(`Twitch auth sample listening on port ${port}!`)
});


