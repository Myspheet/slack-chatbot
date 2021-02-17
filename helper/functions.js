const moment = require('moment');


 const  createHours = () =>
  {
    const hours = [];

    for(let hour =12; hour <= 18; hour++) {
      hours.push(moment({ hour }).format('HH:mm'));
      if(hour < 18){
        hours.push(
            moment({
                hour,
                minute: 30
            }).format('HH:mm')
        );
      }
    }

    return hours; 
  }

const createTimeSelectBlock = () => {
  const hours = createHours();
  const options = [];

  hours.forEach(hour => {
    options.push({
        "text": {
          "type": "plain_text",
          "text": `${hour}`,
          "emoji": false
        },
        "value": `${hour}`
      },
    )
  });

  const blocks = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Select first time slot"
      },
      "accessory" :       {
        "type": "static_select",
        "placeholder":{
            "type": "plain_text",
            "text": "Select first time slot"
        },
        "action_id": "firstTimeSlot",
        "options": options
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Select second time slot"
      },
      "accessory" :       {
        "type": "static_select",
        "placeholder":{
            "type": "plain_text",
            "text": "Select second time slot"
        },
        "action_id": "secondTimeSlot",
        "options": options
      }
    },
  ];
  return blocks;
}

module.exports = { createTimeSelectBlock }