require('dotenv').config();
const Keyv = require('keyv');
const commands_cache = new Keyv(process.env.DEV_DATABASE_URL, { namespace: 'commands' });
const rpg_cache = new Keyv(process.env.DEV_DATABASE_URL, { namespace: 'rpg' });
const dbHelper = require('../utils/databaseHelper');

commands_cache.on('error', err => console.log('KeyVal Connection Error', err));


exports.getCache = async (channel) => {
    try{ 
        let _cache = await commands_cache.get(channel);
        if(_cache == null){
            console.log('No Cache Found for channel '+ channel)
            let broadcaster_id = await dbHelper.getBroadcasterIDByChannel(channel);
            let commands = await dbHelper.listCommandsByChannel(broadcaster_id);
            let rpg = await dbHelper.listRPG(broadcaster_id);
            await commands_cache.set(channel,  {commands: commands, rpg: rpg});
            _cache = await commands_cache.get(channel);
            console.log('Cache Set for channel '+ channel)
            return _cache;
        }
        else {
            return _cache;
        }
    }
    catch(err)
    {
        console.log('Error: '+err)
    }
}

exports.clearCache = async () => {
    console.log('Clearing Cache...')
    try{
        await commands_cache.clear()
        await rpg_cache.clear()
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
    
}

exports.findCommand = async (command, channel) => {
    if(channel[0] == '#'){
        channel = channel.substring(1);
    }
    let _cache = await commands_cache.get(channel);
    var result = _cache.commands.find(o => o.command === command);
    if(result != null){
        return result.response;
    }
    return null;
}

exports.updateRPGCache = async (channel, broadcaster_id) => {
    _cache  = await commands_cache.get(channel.toLowerCase());
    let rpg = await dbHelper.listRPG(broadcaster_id);
    await commands_cache.set(channel,  {commands: _cache.commands, rpg: rpg});
}