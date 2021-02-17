const express = require('express')
const axios = require('axios');
const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api');
const { createMessageAdapter } = require('@slack/interactive-messages');
const mongoose = require("mongoose");

const config = require('./config');


//Connect to mongodb
// const mongoDB = config.database.mongoURI;
// mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

const connectDB = require('./database');
connectDB(config);

// Initialize slack api
const slackEvents = createEventAdapter(config.slack.signingSecret);
const slackWebClient = new WebClient(config.slack.token);
const slackInteractions = createMessageAdapter(config.slack.signingSecret);

const SlackBot = require('./bots/slack');


const app = express();
const port = process.env.PORT || 3000;


// Initialize the slack bot
const slackBot = new SlackBot(slackEvents, slackWebClient, slackInteractions);


app.use('/slack/events', slackEvents.requestListener())
app.post('/slack/commands', express.urlencoded({ extended: false }), slackBot.handleSlashCommand);
app.use('/slack/actions', slackInteractions.expressMiddleware());


slackBot.listen();  


app.get('/', (req, res) => {
  res.send('Hello World!');
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})