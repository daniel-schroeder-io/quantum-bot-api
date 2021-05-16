const cacheService = require('../services/cache_service');
const Keyv = require('keyv');
const commands_cache = new Keyv(process.env.DEV_DATABASE_URL, { namespace: 'commands' });
const rpg_cache = new Keyv(process.env.DEV_DATABASE_URL, { namespace: 'rpg' });

test('get cache', async () => {
    let _cache = await cacheService.getCache('testing');
    expect(3).toBe(3)
});

test('Test Clear Cache', async () => {
    await commands_cache.get('testing');
    await cacheService.clearCache();
    // Both caches should be empty
    let commandShouldBeNull = await commands_cache.get('testing'); 
    let rpgShouldBeNull = await rpg_cache.get('testing'); 
    expect(commandShouldBeNull).toBeUndefined();
    expect(rpgShouldBeNull).toBeUndefined();
});