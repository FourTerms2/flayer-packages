# Mineflayer Auto Eat

A Mineflayer plugin that automatically manages your bot's hunger by eating food from its inventory.

**GitHub Repository:** https://github.com/FourTerms2/mineflayer-eat

## Features

- Automatically eats food when hunger drops below 20
- Configurable food list with default options
- Normalizes food item names (handles both `cooked_beef` and `minecraft:cooked_beef`)
- Checks inventory every 2 seconds
- Error handling for consumption failures

## 💬 Discord Community

Join our Discord server for support, updates, and community discussions. For faster support, please make a ticket:
https://discord.gg/RMC3PcKrpt

## Installation

```bash
npm install mineflayer-eat
```

## Usage

```javascript
const mineflayer = require('mineflayer');
const Food = require('mineflayer-eat');

const bot = mineflayer.createBot({
  host: 'localhost',
  username: 'bot'
});

// Initialize the food module
const food = new Food(bot);
```

## Default Food List

The module comes with a default list of consumable foods:
- `minecraft:cooked_beef`
- `minecraft:cooked_chicken`
- `minecraft:bread`
- `minecraft:apple`
- `minecraft:golden_apple`
- `minecraft:porkchop`
- `minecraft:cooked_porkchop`

## How It Works

1. The module initializes when the bot spawns
2. Every 2 seconds, it checks the bot's hunger level
3. If hunger is below 20, it searches the inventory for food
4. When food is found, it equips it and consumes it
5. The process repeats automatically

## API

### `new Food(bot)`

Creates a new Food instance.

**Parameters:**
- `bot` - The Mineflayer bot instance

**Properties:**
- `foodList` - Array of food item names the bot will eat

**Methods:**
- `normalizeFoodName(foodName)` - Ensures food names have the `minecraft:` prefix
- `startAutoEat()` - Begins the automatic eating loop
- `tryToEat()` - Attempts to eat food from inventory
- `findFoodInInventory()` - Searches for consumable food in the bot's inventory

## License

MIT
