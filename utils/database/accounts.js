const dbHelper = require('../databaseHelper');

const getChannelList = async () => {
    const client = await dbHelper.pool.connect();
    try {
        let res = await client.query(`
        SELECT channel FROM quantum.accounts;`)
        return res.rows.map((c) => c.channel);
    } finally {
        client.release()
    }
};
const getBroadcasterIDByChannel = async (channel) => {
    const client = await dbHelper.pool.connect();
    try {
        let res = await client.query(`
        SELECT twitch_id FROM quantum.accounts WHERE broadcaster = $1;`, [channel.toLowerCase()])
        return res.rows[0].twitch_id;
    } finally {
        client.release()
    }
};

module.exports = {getChannelList, getBroadcasterIDByChannel};

