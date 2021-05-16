const axios = require('axios');
require('dotenv').config();
const client = axios.create({ baseURL: 'https://id.twitch.tv/oauth2/' });
module.exports = {

    validateToken: (req, res, next) => {
        if(process.env.NODE_ENV == "development") {
            return next();
        }
        if(req.session && req.session.passport && req.session.passport.user) {
            client.get('validate', {
                headers: {
                  Authorization: `OAuth ${req.session.passport.user.accessToken}`,
                },
            })
            .then((res) => {
                next(null, res.data);
            })
            .catch((err) => {
                // Try to refresh token
                if (err.response.status == 401) {
                    res.redirect('/auth/twitch')
                }
                else {
                    res.status(500).send(err)
                }
            });
        } else {
            res.status(200).send(null)
        }
      }
}