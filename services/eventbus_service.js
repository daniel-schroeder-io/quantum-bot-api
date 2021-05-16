const axios = require('axios');


module.exports = {
    SubscribeToWebHook: async (twitch) => {
        var data = JSON.stringify({"type":"channel.channel_points_custom_reward.add","version":"1",
            "condition":{"broadcaster_user_id":"402249188"},"transport":{"method":"webhook",
            "callback":"http://localhost:3000/webhooks/lootbox","secret":"saucywashisname"}
        });
    
        var config = {
            method: 'post',
            url: 'https://api.twitch.tv/helix/eventsub/subscriptions',
            headers: { 
                'Client-ID': `${process.env.SLUG_TWITCH_CLIENT_ID}`, 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${twitch.app_token}`
            },
            data : data
        };
        console.log('Trying to subscribe--------------')
        let subscription = await axios(config);
        console.log(subscription)
    }
}