const { Pool } = require('pg');
require('dotenv').config();

const commandsHelper = require('./database/commands')
const accountsHelper = require('./database/accounts')
const rpgHelper = require('./database/rpg')

const pool = process.env.NODE_ENV == "development" ? new Pool({
    connectionString: process.env.DEV_DATABASE_URL,
}) : 
new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
exports.pool = pool;
module.exports = {
    getChannelList: accountsHelper.getChannelList,
    getBroadcasterIDByChannel: accountsHelper.getBroadcasterIDByChannel,
    listCommandsByUser: commandsHelper.listCommandsByUser, 
    addCommandsByUser: commandsHelper.addCommandsByUser,
    listCommandsByChannel: commandsHelper.listCommandsByChannel,
    listEquipmentByUser: rpgHelper.listEquipmentByUser,
    addEquipmentByUser: rpgHelper.addEquipmentByUser,
    getUserEquipmentBySlot: rpgHelper.getUserEquipmentBySlot,
    updateUserEquipmentBySlot: rpgHelper.updateUserEquipmentBySlot,
    listRPG: rpgHelper.listRPG,
    getUser: async (id) => {
        const client = await pool.connect();
        try {
            let res = await client.query(`
            SELECT user_id, broadcaster FROM quantum.accounts
            WHERE twitch_id = $1
            `, [id])
            return res.rows[0];
        } finally {
            client.release()
        }
    },
    addUser: async (user) => {
        const client = await pool.connect();
        try {
            let res = await client.query(`
            INSERT INTO quantum.accounts(
                twitch_id, broadcaster, channel, created_on)
                VALUES($1, $2, $3, NOW());
            `, [user.id, user.display_name, user.login])
        } finally {
            client.release()
        }
    },
    addUserIfNotExists: async (user) => {
        const client = await pool.connect();
        try {
            let data = await client.query(`
                SELECT user_id FROM quantum.accounts WHERE twitch_id = $1;`, [user.id]);
            if(data.rows && data.rows.length == 0){
                let res = await client.query(`
                    INSERT INTO quantum.accounts(
                        twitch_id, broadcaster, channel, created_on
                    ) VALUES($1, $2, $3, NOW());`, 
                [user.id, user.display_name, user.login])
            }

        } finally {
            client.release()
        }
    },
    findUser: async (id) => {
        console.log(id);
        const client = await pool.connect();
        try {
            let res = await client.query(`
            SELECT user_id FROM quantum.accounts WHERE twitch_id = $1`, [id])
            return res.rows[0];
        } finally {
            client.release()
        }
    },
}