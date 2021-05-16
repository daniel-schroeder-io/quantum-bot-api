require('dotenv').config()
const axios = require('axios');
const tmi = require('tmi.js');
const dbHelper = require('./utils/databaseHelper')
const commandCache = require('./services/cache_service')
const lootService = require('./services/loot_service')

const twitch = require('./services/twitch_service')();

let options = {
    options: { debug: true },
	connection: { reconnect: true },
	identity: {
		username: 'SlugxBot',
		password: process.env.SLUG_TWITCH_OAUTH_TOKEN
	}
} 

const client = new tmi.Client(options);
client.connect();
client.on('connected', onConnectedHandler);

async function onConnectedHandler(addr, port) {
    await commandCache.clearCache(); 
	const channels = ['RealKingChemist']//await dbHelper.getChannelList();
	console.log(`* Connected to ${addr}:${port}`);
	console.log(`Joining ${channels.length} channels...`);

	for (let i = 0; i < channels.length; i++) {
        // create keyvalue store per channel
        commandCache.getCache(channels[i].toLowerCase())
        //let commands = await dbHelper.listCommandsByChannel(channels[i])
		client.join(channels[i])
	}
}
module.exports.onConnectedHandler = onConnectedHandler;

client.on('message', async (channel, userstate, message, self) => {
	// Ignore echoed messages.
	if(self) return; 
    if(message.substring(0, 5) == "!loot")
    {
        let lootresponse = await lootService.openLootBox(channel.substring(1), userstate['room-id'], userstate.username);
        client.say(channel, lootresponse)
        
    }
    if(message.toLowerCase().substring(0, 8) == "!loadout")
    {
        let loadout = await lootService.getLoadOut(channel.substring(1), userstate['room-id'], userstate.username);
        client.say(channel, loadout)
        
    }
    if(message.substring(0, 7) == "!battle"){
        let responseBattleUser = message.split('@')[1].split(' ')[0];
        let battleUser = message.split('@')[1].split(' ')[0].toLowerCase();
        let battle = await lootService.battle(channel.substring(1), userstate['room-id'], userstate.username, battleUser);
        if(battle.battle){ 
            client.say(channel, `${userstate.username} has defeated @${responseBattleUser}`)
        }else { 
            client.say(channel, `${userstate.username} lost the battle to @${responseBattleUser}`)
        }
    }
    if(message.substring(0, 5) == "!ask ")
    {
        let question = message.substring(5, message.length).split(' ').join('+');
        try{
            let answer = await axios.get(`https://api.wolframalpha.com/v1/result?i=${question}&appid=${process.env.WOLFRAM_APP_ID}`);
            client.say(channel, `${answer.data}`)
        }
        catch(e){
            if(e.response.status == 501){
                client.say(channel, `Slug Bot has no idea...`)
            }
        }
        
    }
    else if (userstate['custom-reward-id'] != null){
        if(userstate['custom-reward-id'] == '0422fd1a-bc3e-4f1e-8e2d-0b4fb4248943')
        {
            console.log('LOOT BOX')
        }
    }
    else {
        // Try to find command in cache
        let response = await commandCache.findCommand(message.toLowerCase(), channel.substring(1))
        if(response != null){
            client.say(channel, response)
        }
    }

});
 

module.exports = {
    openLootBox: async (event) => {
        let lootresponse = await lootService.openLootBox(event.broadcaster_user_name, event.broadcaster_user_id, event.user_name);
        client.say('realkingchemist', lootresponse)
    }
}