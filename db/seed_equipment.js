const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    connectionString: process.env.DEV_DATABASE_URL,
    // ssl: {
    //     rejectUnauthorized: false
    // }
});
const setEquipment = async () => {
    const client = await pool.connect()
    try {
        let res = await client.query(`
        INSERT INTO quantum.rpg(user_id, username, equipment_name, equipment_slot, tier, value, created_on)
        VALUES($1, $2, $3, $4, $5, $6, NOW());`, ['402249188', 'dschro', 'Sword', equipmentObj.slot, equipmentObj.tier, equipmentObj.value]
        )
         
    } finally {
        client.release()
    }      
}

setEquipment()
.catch((err)=> {
    console.log(err)
}); 