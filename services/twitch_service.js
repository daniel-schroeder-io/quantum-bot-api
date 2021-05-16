const axios = require('axios');

module.exports = async () => {
    let twitch = {};

    twitch.app_token = '';
    
    const createAppToken = async () => {
        console.log('Generating App Token')
        var config = {
            method: 'post',
            url: `https://id.twitch.tv/oauth2/token?`+
            `client_id=${process.env.SLUG_TWITCH_CLIENT_ID}`+
            `&client_secret=${process.env.SLUG_TWITCH_CLIENT_SECRET}`+
            `&grant_type=client_credentials&scope=channel:manage:redemptions`,
            headers: { }
          };
          
        let response = await axios(config); 
        twitch.app_token = response.data.access_token
        
    }
    await createAppToken();
    return twitch;
}
