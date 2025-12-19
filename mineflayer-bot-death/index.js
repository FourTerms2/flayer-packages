const fs = require('fs');

function botDeath(bot) {
    // Get killer's weapon
    function getKillerWeapon(killer) {
        const heldItem = killer.heldItem;
        return heldItem ? heldItem.name : 'unknown weapon';
    }

    // Handle bot death and log details
    bot.on('death', () => {
        const now = new Date();
        const localTime = now.toLocaleString();

        // Get death location
        const position = bot.entity.position;
        const location = `X: ${Math.floor(position.x)}, Y: ${Math.floor(position.y)}, Z: ${Math.floor(position.z)}`;

        // Check for player killer
        const playerKiller = Object.values(bot.entities).find(
            (entity) => entity.type === 'player' && entity !== bot.entity
        );

        // Check for mob killer
        const mobKiller = Object.values(bot.entities).find(
            (entity) => entity.type === 'mob' && entity.position.distanceTo(bot.entity.position) < 10
        );

        let deathMessage = `The bot has died at ${localTime} at location: ${location}.`;

        if (playerKiller) {
            const killerWeapon = getKillerWeapon(playerKiller);
            deathMessage += ` Killed by player: ${playerKiller.username} using ${killerWeapon}.`;
        } else if (mobKiller) {
            const mobName = mobKiller.name || mobKiller.displayName || 'unknown mob';
            deathMessage += ` Killed by mob: ${mobName}.`;
        } else {
            deathMessage += ' Killed by: environmental damage or unknown cause.';
        }

        console.log('Death details:', deathMessage);

        try {
            fs.appendFileSync('death.txt', `[${localTime}] ${deathMessage}\n`);
        } catch (err) {
            console.error('Error writing to death.txt:', err);
        }
    });
}

module.exports = botDeath;
