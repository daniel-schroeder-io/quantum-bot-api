const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    connectionString: process.env.DEV_DATABASE_URL,
    // ssl: {
    //     rejectUnauthorized: false
    // }
});
const setCommands = async () => {
    const client = await pool.connect()
    try {
        let res = await client.query(`
            INSERT INTO quantum.accounts(twitch_id, broadcaster, channel, created_on)
            VALUES(149673219, 'dschro', 'dschro', NOW())`
        )
        console.log(res)
        res = await client.query(`
            INSERT INTO quantum.accounts(twitch_id, broadcaster, channel, created_on)
            VALUES(402249188, 'realkingchemist', 'realkingchemist', NOW())`
        )
        console.log(res)
        // res = await client.query(`
        //     INSERT INTO quantum.accounts(twitch_id, broadcaster, channel, created_on)
        //     VALUES(46205877, 'unvisibleslaughter', 'unvisibleslaughter', NOW())`
        // )
        // console.log(res)
        res = await client.query(`
            INSERT INTO quantum.commands(user_id, command, response, access_type, created_on)
            VALUES(1, '!music', 'checkit', '1', NOW());`
        )
        console.log(res)
        res = await client.query(`
            INSERT INTO quantum.commands(user_id, command, response, access_type, created_on)
            VALUES(1, '!waterbottle', 'look at my setup', '2', NOW());`
        )
        console.log(res)
    } finally {
        client.release()
    }      
}

const addTestUser = async () => {
    const client = await pool.connect()
    try {
        let res = await client.query(`
            INSERT INTO quantum.accounts(twitch_id, broadcaster, channel, created_on)
            VALUES(69696969, 'testing', 'testing', NOW())`
        )
        console.log(res)
    } 
    catch(err){
        console.log("Error: ")
        console.log(err)
    }   
    try {
        let res = await client.query(`
        SELECT user_id FROM quantum.accounts WHERE twitch_id = $1`, [69696969])
        
        console.log(res.rows[0])
        
    } 
    catch(err){
        console.log("Error: ")
        console.log(err)
    }finally {
        client.release()
    }    
    
}

const setEquipment = async () => {
    const client = await pool.connect()
    try {
        let res = await client.query(`
            INSERT INTO quantum.rpg(twitch_id, broadcaster, channel, created_on)
            VALUES(149673219, 'dschro', 'dschro', NOW())`
        )
        console.log(res)
        res = await client.query(`
            INSERT INTO quantum.accounts(twitch_id, broadcaster, channel, created_on)
            VALUES(402249188, 'realkingchemist', 'realkingchemist', NOW())`
        )
        console.log(res)
        res = await client.query(`
            INSERT INTO quantum.commands(user_id, command, response, access_type, created_on)
            VALUES(1, '!music', 'checkit', '1', NOW());`
        )
        console.log(res)
        res = await client.query(`
            INSERT INTO quantum.commands(user_id, command, response, access_type, created_on)
            VALUES(1, '!waterbottle', 'look at my setup', '2', NOW());`
        )
        console.log(res)
    } finally {
        client.release()
    }      
}

const resetDB = async () => {
    const client = await pool.connect()
    try {
        let res = await client.query('DROP TABLE IF EXISTS quantum.rpg')
        res = await client.query('DROP TABLE IF EXISTS quantum.accounts')
        res = await client.query('DROP TABLE IF EXISTS quantum.commands')
        res = await client.query(`create table if not exists quantum.accounts (
            user_id INT GENERATED ALWAYS AS IDENTITY,
            twitch_id INT UNIQUE NOT NULL,
            broadcaster VARCHAR ( 100 ) NOT NULL,
            channel VARCHAR ( 100 ) NOT NULL,
            created_on TIMESTAMP NOT NULL,
            PRIMARY KEY(user_id)
        );`)
        res = await client.query(`create table if not exists quantum.commands (
            command_id INT GENERATED ALWAYS AS IDENTITY,
            user_id INT NOT NULL,
            command VARCHAR ( 100 ) UNIQUE NOT NULL,
            response VARCHAR ( 1000 ) NOT NULL,
            access_type INT NOT NULL,
            created_on TIMESTAMP NOT NULL,
            counter INT,
            PRIMARY KEY(command_id),
            CONSTRAINT fk_accounts
                FOREIGN KEY(user_id) 
                REFERENCES quantum.accounts(user_id)
            );`)
        res = await client.query(`create table if not exists quantum.rpg (
            id INT GENERATED ALWAYS AS IDENTITY,
            broadcaster_id INT NOT NULL,
            username VARCHAR ( 100 ) NOT NULL,
            equipment_name VARCHAR ( 100 ) NOT NULL,
            equipment_slot INT NOT NULL,
            tier INT NOT NULL,
            value REAL NOT NULL,
            created_on TIMESTAMP NOT NULL,
            PRIMARY KEY(id),
            CONSTRAINT fk_accounts
                FOREIGN KEY(broadcaster_id) 
                REFERENCES quantum.accounts(twitch_id)
            );`)
            
    } finally {
        client.release()
    }      
}

// resetDB()
// .catch((err)=> {
//     console.log(err)
// });
// setCommands()
// .catch((err)=> {
//     console.log(err)
// });

addTestUser()
.catch((err)=> {
    console.log(err)
});