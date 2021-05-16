const dbHelper = require('../utils/databaseHelper')
const cacheService = require('./cache_service');
const {rollTier, rollSlot, rollBonus, rollAdjective, 
    randomDouble, getCritBonus, getArmor, getAttack} = require('../utils/loot-utils');

module.exports = {
    openLootBox: async (channel, broadcaster, username) => {
        let tier = rollTier();
        let slot = rollSlot();
        let value = (tier.base_stat + rollBonus()).toFixed(3);
        let adjective = rollAdjective();
        let item_name = adjective + " " + slot.name;
        // Check current equipment and change if better
        let current = await dbHelper.getUserEquipmentBySlot(username, slot.slot, broadcaster)
       
        // If no equipment, Add it
        if(current == null){
            await dbHelper.addEquipmentByUser(broadcaster, username, {name: item_name, slot: slot.slot, tier: tier.id, value: value})
            await cacheService.updateRPGCache(channel, broadcaster)
        }
        // Else replace if its better
        else {
            if(current.value < value){
                await dbHelper.updateUserEquipmentBySlot(username, slot.slot, {name: item_name, tier: tier.id, value: value})
                await cacheService.updateRPGCache(channel, broadcaster)
                return `@${username} just got a ${tier.name} ${item_name} with value: ${value}, replacing their old ${current.equipment_name}!`
            } 
        }
        return `@${username} just got a ${tier.name} ${item_name} with value: ${value}`

       
    },
    getLoadOut: async (channel, broadcaster, username) => {
        let _cache          = await cacheService.getCache(channel); 
        let myslots         = _cache.rpg.filter((x) => x.username == username);
        if(myslots.length == 0){
            return `@${username}, you have no loot. Time to !loot up.`;
        }
        else{
            let message = "";
            myslots.forEach((row) => {
                message = message + `${row.equipment_name}: ${row.value} -- `
            });
            return message.substring(0, message.length - 3);
        }

    },
    battle: async (channel, broadcaster, username, battleUser) => { 
        
        let _cache          = await cacheService.getCache(channel); 
        let myStats         = _cache.rpg.filter((x) => x.username == username);
        let opponentStats   = _cache.rpg.filter((x) => x.username == battleUser); 
        let myArmor         = getArmor(myStats);
        let myAttack        = getAttack(myStats);
        let oppArmor        = getArmor(opponentStats);
        let oppAttack       = getAttack(opponentStats);
        console.log(`My Attack ${myAttack}`)
        console.log(`My Armor ${myArmor}`)
        console.log(`Opp Attack ${oppAttack}`)
        console.log(`Opp Armor ${oppArmor}`)
        let endBattle = false;
        let myTotalCrit = 0;
        let oppTotalCrit = 0;
        let log = "";
        do {
            let myCrit = getCritBonus();
            myTotalCrit+=myCrit;
            let myAttackHit = (myAttack + myCrit).toFixed(3);
            oppArmor-=myAttackHit;
            let oppCrit = getCritBonus();
            oppTotalCrit+=oppCrit;
            let oppAttackHit = (oppAttack + oppCrit).toFixed(3);
            myArmor-=oppAttackHit

            console.log(`My Armor Left ${myArmor}`)
            console.log(`Opp Armor Left ${oppArmor}`)
            log = log + `${username} hit for ${myAttackHit} and ${battleUser} hit for ${oppAttackHit} --`
            if(myArmor <= 0 || oppArmor<= 0){
                endBattle = true;
            }
        }while(!endBattle)


        console.log(`My Armor  ${(myArmor).toFixed(3)}`)
        console.log(`Opp Armor ${(oppArmor).toFixed(3)}`)
        console.log(`${(parseFloat((oppArmor).toFixed(3)) < parseFloat((myArmor).toFixed(3)))}`)
        if(parseFloat((oppArmor).toFixed(3)) < parseFloat((myArmor).toFixed(3))){
            log = log + `${username} had ${myArmor} armor left and ${battleUser} had ${oppArmor} armor left.`;
            return {log: log, battle: true};
        }
        log = log + `${username} had ${myArmor} armor left and ${battleUser} had ${oppArmor} armor left.`;
        return {log: log, battle: false};
    }
}

