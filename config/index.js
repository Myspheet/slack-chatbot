require('dotenv').config();

module.exports = {
  slack : {
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_TOKEN
  },
  database: {
    mongoURI: process.env.MONOGO_URI
  }
}