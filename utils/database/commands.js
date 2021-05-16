const dbHelper = require('../databaseHelper');

const listCommandsByUser = async (user_id) => {
    const client = await dbHelper.pool.connect();
    try {
        let res = await client.query(`
        SELECT * FROM quantum.commands WHERE user_id = $1`, [user_id])
        return res.rows;
    } finally {
        client.release()
    }
};

const listCommandsByChannel = async (channel) => {
    const client = await dbHelper.pool.connect();
    try {
        let res = await client.query(`
        SELECT * FROM quantum.commands 
        INNER JOIN quantum.accounts ON quantum.accounts.user_id = quantum.commands.user_id 
        WHERE quantum.accounts.channel = $1`, [channel])
        return res.rows;
    } finally {
        client.release()
    }
};

const addCommandsByUser = async (commandObj) => {
    const client = await dbHelper.pool.connect();
    try {
        let res = await client.query(`
            INSERT INTO quantum.commands(user_id, command, response, access_type, created_on)
            VALUES($1, $2, $3, $4, NOW());`, [commandObj.user_id, commandObj.command, commandObj.response, commandObj.access_type]
        )
        return res;
    } finally {
        client.release()
    }
};

module.exports = {listCommandsByUser, addCommandsByUser, listCommandsByChannel};

