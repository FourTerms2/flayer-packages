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

module.exports = { Food, AutoTotem };
