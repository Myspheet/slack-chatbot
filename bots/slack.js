const { createTimeSelectBlock} = require('../helper/functions');

const User = require('../models/User');

class SlackBot {

  constructor(slackEvents, slackWebClient, slackInteractions){
    this.slackEvents = slackEvents;
    this.slackWebClient = slackWebClient;

    this.slackInteractions = slackInteractions;
  }

  listen () {
    this.slackEvents.on('app_mention', (event) => this.handleMention(event, this.slackWebClient));
    this.slackInteractions.action({type: "static_select"}, async (payload, respond) => {
      const {action_id, selected_option: {value}} = payload.actions[0];
      const {id,username,name} = payload.user

      try {
        let user = await User.findOne({ slackId: id }).exec();
  
  
        if(user === null){
          user = new User({slackId: id, slackUsernam: username, slackName: name});
        }
  
  
        switch (action_id) {
          case 'firstTimeSlot':
            user.firstTimeSlot = value;
            break;
          case 'secondTimeSlot':
            user.secondTimeSlot = value;
          default:
            break;
        }
  
        user.save();
        
      } catch (error) {
        console.log(error);
      }
      
    });

    this.slackEvents.on('error', (error) => {
      console.log(error); // TypeError
    });
  }

  async handleMention (event, slackWebClient) {
    const mention = /<@[A-Z0-9]+>/;
    const eventText = event.text.replace(mention, '').trim();
    if(eventText.includes('hello') || eventText === ''){
      return slackWebClient.chat.postMessage({
        text: 'Hi back!',
        channel: event.channel,
        username: 'Techy',
      });
    }else if(eventText == 'time'){
      return slackWebClient.chat.postMessage({
        channel: event.channel,
        username: 'Techy',
        blocks: createTimeSelectBlock() 
      });
    }else if(eventText  == 'savedtime' ){
      try {
        const user = await User.findOne({ slackId: event.user }).exec();

            if(user === null){
              return slackWebClient.chat.postMessage({
                channel: event.channel,
                username: 'Techy',
                text: "You don't have any saved times, try saving a time using the command /bot time"
              });
            }
            return slackWebClient.chat.postMessage({
              channel: event.channel,
              username: 'Techy',
              text: `Your saved times are, first time slot - ${user.firstTimeSlot}, second time slot - ${user.secondTimeSlot}`
            });
        
      } catch (error) {
        console.log(error);
      }
    }else {
      return slackWebClient.chat.postMessage({
        channel: event.channel,
        username: 'Techy',
        text: `I didn't get that, use the hello, time, savedtime command to interact with me`
      });
    }
  }

  async handleSlashCommand(req, res, next) {
    if (req.body.command === '/bot') {
      const type = req.body.text;
      
      if (type === 'hello') {
        res.send('Hi Back');
      } else if (type === 'time') {
        res.json({
          username: 'Techy',
          blocks: createTimeSelectBlock()
        });
      } else if (type === 'saved times') {
        const user = await User.findOne({ slackId: req.body.user_id }).exec();

        if(user === null){
          res.send(`You do not have any saved time slots`);
        }
        res.send(`Your saved times are, first time slot - ${user.firstTimeSlot}, second time slot - ${user.secondTimeSlot}`);
      } else {

        res.send('Use this command followed by `hello`, `time`, or `saved times`.');
      }
    } else {
      next();
    }
  }

}


module.exports = SlackBot;