const dbHelper = require('../databaseHelper');

const listEquipmentByUser = async (username) => {
    const client = await dbHelper.pool.connect();
    try {
        let res = await client.query(`
        SELECT * FROM quantum.rpg WHERE username = $1`, [username])
        return res.rows;
    } finally {
        client.release()
    }
};

const addEquipmentByUser = async (broadcasterID, user, equipmentObj) => {
    const client = await dbHelper.pool.connect();
    try {
        let res = await client.query(`
            INSERT INTO quantum.rpg(broadcaster_id, username, equipment_name, equipment_slot, tier, value, created_on)
            VALUES($1, $2, $3, $4, $5, $6, NOW());`, [broadcasterID, user, equipmentObj.name, equipmentObj.slot, equipmentObj.tier, equipmentObj.value]
        )
        return res;
    } finally {
        client.release()
    }
};

const getUserEquipmentBySlot = async (username, slot, broadcaster) => {
    const client = await dbHelper.pool.connect();
    try {
        let res = await client.query(`
            SELECT value, equipment_name FROM quantum.rpg
            WHERE username = $1 AND equipment_slot = $2 AND broadcaster_id = $3;`, [username, slot, broadcaster]
        )
        return res.rows[0];
    } finally {
        client.release()
    }
};

const updateUserEquipmentBySlot = async (username, slot, equipmentObj) => {
    const client = await dbHelper.pool.connect();
    try {
        let res = await client.query(`
            UPDATE quantum.rpg SET (equipment_name, tier, value) = ($3, $4, $5)
            WHERE username = $1 AND equipment_slot = $2;`, [username, slot, equipmentObj.name, equipmentObj.tier, equipmentObj.value]
        )
        return res.rows[0];
    } finally {
        client.release()
    }
};

const listRPG = async (channel) => {
    const client = await dbHelper.pool.connect();
    try {
        let res = await client.query(`
            SELECT username, equipment_name, equipment_slot, tier, value FROM quantum.rpg
            WHERE broadcaster_id = $1`, [channel]
        )
        return res.rows;
    } finally {
        client.release()
    }
}


module.exports = {listEquipmentByUser, addEquipmentByUser, getUserEquipmentBySlot, updateUserEquipmentBySlot, listRPG};

