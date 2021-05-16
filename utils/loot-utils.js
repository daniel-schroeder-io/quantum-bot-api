const adjectives = ['Fluffy', 'Effervescent', 'Vivacious', 'Chemical', 'Rubber', 'Molten', 'Charred', 'Chipped', 
'Rusted', 'Deep-fried', 'Cursed', 'Magical', 'Voluptuous', 'Sparkling', 'Fuzzy', 'Oversized', 'Miniature', 
'Silent', 'Bluetooth', 'Bright', 'Blue ', 'Purple ', 'Yellow', 'Brown', 'Black', 'White', 'Red', 
'Green', 'Camouflage ', 'Gold-plated', 'Spiked', 'Metallic', 'Swag-Dripped', 'Slimy', 'Holy', 'Wet', 'Draconian', 
'Victorian', 'Ethereal', 'Intransigent', 'Jejune', 'Noxious', 'Placid', 'Squalid', 'Turbulent', 'Verdant', 'Invisible'];

const tier_enum = {
    COMMON:     {name: 'Common',    id:  1, base_stat: 10.0},
    UNCOMMON:   {name: 'Uncommon',  id:  2, base_stat: 20.0},
    RARE:       {name: 'Rare',      id:  3, base_stat: 30.0},
    EPIC:       {name: 'Epic',      id:  4, base_stat: 40.0},
    LEGENDARY:  {name: 'Legendary', id:  5, base_stat: 50.0},
}
const slot_enum = {
    BOOTS:  {name: 'Boots',     slot: 1},
    ARMOR:  {name: 'Armor',     slot: 2},
    GLOVES: {name: 'Gloves',    slot: 3},
    HELMET: {name: 'Helmet',    slot: 4},
    LEGS:   {name: 'Legs',      slot: 5},
    WEAPON: {name: 'Weapon',    slot: 6},
}
const randomDouble = (max) => {
    var precision = 1000; // 2 decimals
    var randomnum = Math.floor(Math.random() * (max * precision - 1 * precision) + 1 * precision) / (1*precision);
    return randomnum;
} 
module.exports.rollTier = () => {
    let roll = Math.floor(Math.random() * 10000);
    switch(true) {
        case (roll >= 9900):                 // 1%
          return tier_enum.LEGENDARY;
        case (roll >= 9500 && roll < 9900):  // 4%
            return tier_enum.EPIC;
        case (roll >= 8300 && roll < 9500):  // 12%
            return tier_enum.RARE;
        case (roll >= 6000 && roll < 8300):  // 23%
            return tier_enum.UNCOMMON;
        default:
            return tier_enum.COMMON;         // 60%
    }
}

module.exports.rollSlot = () => {
    let roll = Math.floor(Math.random() * 6000);
    switch(true) {
        case (roll >= 5000):                 // 1/6
          return slot_enum.BOOTS;
        case (roll >= 4000 && roll < 5000):  // 1/6
            return slot_enum.ARMOR;
        case (roll >= 3000 && roll < 4000):  // 1/6
            return slot_enum.GLOVES;
        case (roll >= 2000 && roll < 3000):  // 1/6
            return slot_enum.HELMET;
        case (roll >= 1000 && roll < 2000):  // 1/6
            return slot_enum.LEGS;
        default:
            return slot_enum.WEAPON;         // 1/6
    }
}

module.exports.getCritBonus = () => {
    let roll = Math.floor(Math.random() * 10000);
    switch(true) {
        case (roll >= 9900):                // 1%
          return randomDouble(7);
        case (roll >= 9500 && roll < 9900): // 4%
            return randomDouble(5);
        case (roll >= 8300 && roll < 9500): // 12%
            return randomDouble(3);
        case (roll >= 6000 && roll < 8300): // 23%
            return randomDouble(2);
        default:
            return 0;                       // 60%
    }
}

module.exports.rollBonus = () => {
    var precision = 1000; // 2 decimals
    var randomnum = Math.floor(Math.random() * (5 * precision - 1 * precision) + 1 * precision) / (1*precision);
    return randomnum;
}

module.exports.rollAdjective = () => {
    let index = Math.floor(Math.random() * adjectives.length);
    return adjectives[index]
} 

module.exports.randomDouble = (max) => {
    var precision = 1000; // 2 decimals
    var randomnum = Math.floor(Math.random() * (max * precision - 1 * precision) + 1 * precision) / (1*precision);
    return randomnum;
} 

module.exports.getArmor = (arr) => {

    let armor = 0.0;
    arr.forEach((item)=> {
        if(item.equipment_slot != 6){
            armor = (parseFloat(armor) + parseFloat(item.value)).toFixed(3);
        }
    })
    return armor;
}

module.exports.getAttack = (arr) => {
    let attack = arr.find((x) => x.equipment_slot == 6)
    return attack != null ? attack.value : 1;
}