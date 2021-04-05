const axios = require('axios');

class TwitchAuthClient {
  constructor() {
    this.client = axios.create({ baseURL: 'https://id.twitch.tv/oauth2/' });
  }

  validateToken(token, done) {
    this.client.get('validate', {
      headers: {
        Authorization: `OAuth ${token}`,
      },
    })
    .then((res) => {
        console.log('SUCCESS')
        done(null, res.data);
       //done(null, res.data);
    })
    .catch((err) => {
        console.log('ERROR')
        done(err)
    });
  }
}

module.exports = TwitchAuthClient;