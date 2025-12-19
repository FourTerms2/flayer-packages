const fs = require('fs');

// Food class to handle automatic eating functionality
class Food {
  constructor(bot) {
    this.bot = bot;
    this.foodList = ['minecraft:cooked_beef', 'minecraft:cooked_chicken', 'minecraft:bread']; // Default food list

    this.bot.once('spawn', () => {
      console.log('Food module initialized. Loaded food list:', this.foodList);
      this.startAutoEat();
    });
  }

  normalizeFoodName(foodName) {
    return foodName.startsWith('minecraft:') ? foodName : `minecraft:${foodName}`;
  }

  startAutoEat() {
    setInterval(() => {
      const hunger = this.bot.food;
      if (hunger === undefined || hunger >= 20) return;
      this.tryToEat();
    }, 2000);
  }

  async tryToEat() {
    const foodItem = this.findFoodInInventory();
    if (foodItem) {
      try {
        await this.bot.equip(foodItem, 'hand');
        await this.bot.consume();
      } catch (error) {
        console.error('Error consuming food:', error);
      }
    }
  }

  findFoodInInventory() {
    for (let i = 0; i < 40; i++) {
      const item = this.bot.inventory.slots[i];
      if (item && this.foodList.includes(this.normalizeFoodName(item.name))) {
        return item;
      }
    }
    return null;
  }
}

// AutoTotem class to handle totem management
class AutoTotem {
  constructor(bot) {
    this.bot = bot;
    this.lowHealthThreshold = 10;
    this.offhandSlot = 45;
  }

  start() {
    this.bot.on('health', () => this.handleAutoTotem());
    setInterval(() => this.handleAutoTotem(), 100);
  }

  handleAutoTotem() {
    if (this.bot.health < this.lowHealthThreshold) {
      this.equipTotem();
    }
  }

  async equipTotem() {
    const totemItem = this.findTotemInInventory();
    if (totemItem) {
      try {
        await this.bot.equip(totemItem, 'off-hand');
      } catch (err) {
        console.error('Error equipping totem:', err);
      }
    } else {
    }
  }

  findTotemInInventory() {
    for (let i = 0; i < this.bot.inventory.slots.length; i++) {
      const item = this.bot.inventory.slots[i];
      if (item && item.name === 'totem_of_undying') {
        return item;
      }
    }
    return null;
  }
}

// BotDeath class to handle death tracking and logging
class BotDeath {
  constructor(bot) {
    this.bot = bot;
    this.setupDeathHandler();
  }

  getKillerWeapon(killer) {
    const heldItem = killer.heldItem;
    return heldItem ? heldItem.name : 'unknown weapon';
  }

  setupDeathHandler() {
    this.bot.on('death', () => {
      const now = new Date();
      const localTime = now.toLocaleString();

      // Get death location
      const position = this.bot.entity.position;
      const location = `X: ${Math.floor(position.x)}, Y: ${Math.floor(position.y)}, Z: ${Math.floor(position.z)}`;

      // Check for player killer
      const playerKiller = Object.values(this.bot.entities).find(
        (entity) => entity.type === 'player' && entity !== this.bot.entity
      );

      // Check for mob killer
      const mobKiller = Object.values(this.bot.entities).find(
        (entity) => entity.type === 'mob' && entity.position.distanceTo(this.bot.entity.position) < 10
      );

      let deathMessage = `The bot has died at ${localTime} at location: ${location}.`;

      if (playerKiller) {
        const killerWeapon = this.getKillerWeapon(playerKiller);
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
}

module.exports = { Food, AutoTotem, BotDeath };
