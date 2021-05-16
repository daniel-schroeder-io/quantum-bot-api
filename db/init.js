const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "quantumdb",
  password: "Welcome1!",
  port: "5432"
});
const initDBTables = async (pool) => {
    await pool.query(
        `create table if not exists accounts (
            user_id INT GENERATED ALWAYS AS IDENTITY,
            twitch_id INT NOT NULL,
            broadcaster VARCHAR ( 100 ) NOT NULL,
            channel VARCHAR ( 100 ) NOT NULL,
            created_on TIMESTAMP NOT NULL,
            PRIMARY KEY(user_id)
        );`,
        (err, res) => {
          console.log(err, res); 
        }
      );

      await pool.query(
        `create table if not exists commands (
            command_id INT GENERATED ALWAYS AS IDENTITY,
            user_id INT NOT NULL,
            command VARCHAR ( 100 ) NOT NULL,
            response VARCHAR ( 1000 ) NOT NULL,
            access_type INT NOT NULL,
            created_on TIMESTAMP NOT NULL,
            PRIMARY KEY(command_id),
            CONSTRAINT fk_accounts
                FOREIGN KEY(user_id) 
                REFERENCES accounts(user_id)
            );`,
        (err, res) => {
          console.log(err, res); 
        }
      );

      await pool.query(
        `create table if not exists rpg (
            id INT GENERATED ALWAYS AS IDENTITY,
            broadcaster_id INT NOT NULL,
            username VARCHAR ( 100 ) NOT NULL,
            equipment_name VARCHAR ( 100 ) NOT NULL,
            equipment_slot INT NOT NULL,
            tier INT NOT NULL,
            value REAL NOT NULL,
            created_on TIMESTAMP NOT NULL,
            PRIMARY KEY(command_id),
            CONSTRAINT fk_accounts
                FOREIGN KEY(broadcaster_id) 
                REFERENCES accounts(twitch_id)
            );`,
        (err, res) => {
          console.log(err, res); 
        }
      );
    // await  pool.query(
    //     "INSERT INTO commands(user_id, command, response, access_type, created_on)VALUES(1, '!music', 'checkit', '1', NOW())",
    //     (err, res) => {
    //       console.log(err, res);
    //       
    //     }
    //   );
    // await  pool.query(
    //     "SELECT * FROM quantum.commands INNER JOIN quantum.accounts ON quantum.accounts.user_id = quantum.commands.user_id;",
    //     (err, res) => {
    //       console.log(res.rows);
          
    //     }
    //   );
    pool.end();
}
initDBTables(pool)

// pool.connect(pgConString, function (err, client, done) {
//     if (err) {
//         callBack("DB connection failed. " + err, null);
//         return;
//     }
//     pool.query(
//         `create table commands (
//             command_id serial PRIMARY KEY,
//             user_id INT NOT NULL,
//             command VARCHAR ( 100 ) NOT NULL,
//             response VARCHAR ( 1000 ) NOT NULL,
//             access_type INT NOT NULL,
//             created_on TIMESTAMP NOT NULL
//         );`,
//         (err, res) => {
//           console.log(err, res);
          
//         }
//       );
     
//       pool.end();

// });



  



