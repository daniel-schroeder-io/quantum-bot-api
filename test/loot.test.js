const lootService = require('../services/loot_service');
const {rollTier, rollSlot, rollBonus, rollAdjective, 
    randomDouble, getCritBonus, getArmor, getAttack} = require('../utils/loot-utils');
     

test('adds 1 + 2 to equal 3', () => {
    let roll = rollTier();
    console.log(roll)
    expect(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']).toContain(roll.name)    
});