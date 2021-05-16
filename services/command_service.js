// Handle client and message parsing
const commandMap = new Map();
const dbHelper = require('../utils/databaseHelper');

const loadCommands = async(user_id) => {
    let commands = dbHelper.listCommandsByUser(user_id)

}

exports.commandMap = commandMap;
exports.loadCommands = loadCommands;