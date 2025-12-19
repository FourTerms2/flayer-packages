// Food class to handle automatic eating functionality
class Food {
  constructor(bot) {
    this.bot = bot;
    this.foodList = ['minecraft:cooked_beef', 'minecraft:cooked_chicken', 'minecraft:bread', 'minecraft:apple', 'minecraft:golden_apple', 'minecraft:porkchop', 'minecraft:cooked_porkchop']; // Default food list

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

module.exports = Food;
