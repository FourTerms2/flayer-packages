# Mineflayer Utility Bot

A comprehensive Mineflayer utility package that combines automatic eating, totem management, and death tracking into a single module.

**GitHub Repository:** https://github.com/FourTerms2/mineflayer-utility-bot

## 💬 Discord Community

Join our Discord server for support, updates, and community discussions. For faster support, please make a ticket:
https://discord.gg/RMC3PcKrpt

## Features

### Auto Eat
- Automatically eats food when hunger drops below 20
- Configurable food list with sensible defaults
- Checks inventory every 2 seconds

### Auto Totem
- Automatically equips Totem of Undying when health drops below 10 HP
- Continuous health monitoring (100ms intervals)
- Searches entire inventory for totems

### Death Tracking
- Logs all bot deaths with timestamps
- Records death location (X, Y, Z coordinates)
- Identifies killer (player, mob, or environmental)
- Logs weapon used by player killers
- Saves death log to `death.txt` file



## Installation

```bash
npm install mineflayer-utility-bot
```

## Usage

### Basic Setup

```javascript
const mineflayer = require('mineflayer');
const { Food, AutoTotem, BotDeath } = require('mineflayer-utility-bot');

const bot = mineflayer.createBot({
  host: 'localhost',
  username: 'bot'
});

// Initialize all utilities
const food = new Food(bot);
const autoTotem = new AutoTotem(bot);
autoTotem.start();
const deathTracker = new BotDeath(bot);
```

### Using Individual Modules

You can use only the modules you need:

```javascript
// Only auto-eating
const { Food } = require('mineflayer-utility-bot');
const food = new Food(bot);

// Only totem management
const { AutoTotem } = require('mineflayer-utility-bot');
const autoTotem = new AutoTotem(bot);
autoTotem.start();

// Only death tracking
const { BotDeath } = require('mineflayer-utility-bot');
const deathTracker = new BotDeath(bot);
```

## API Reference

### Food Class

**Constructor:** `new Food(bot)`

**Properties:**
- `foodList` - Array of food items the bot will eat

**Default Food List:**
- `minecraft:cooked_beef`
- `minecraft:cooked_chicken`
- `minecraft:bread`

**Methods:**
- `normalizeFoodName(foodName)` - Adds `minecraft:` prefix if missing
- `startAutoEat()` - Begins automatic eating loop
- `tryToEat()` - Attempts to eat food from inventory
- `findFoodInInventory()` - Searches for consumable food

### AutoTotem Class

**Constructor:** `new AutoTotem(bot)`

**Properties:**
- `lowHealthThreshold` - Health level that triggers totem equipping (default: 10)
- `offhandSlot` - Off-hand inventory slot (default: 45)

**Methods:**
- `start()` - Begins health monitoring and auto-equipping
- `handleAutoTotem()` - Checks health and triggers totem equipping
- `equipTotem()` - Equips totem to off-hand
- `findTotemInInventory()` - Searches for totem in inventory

### BotDeath Class

**Constructor:** `new BotDeath(bot)`

**Methods:**
- `getKillerWeapon(killer)` - Gets the weapon used by a killer
- `setupDeathHandler()` - Sets up death event listener

**Death Log Format:**
```
[MM/DD/YYYY, HH:MM:SS AM/PM] The bot has died at [timestamp] at location: X: 100, Y: 64, Z: -200. Killed by player: Steve using diamond_sword.
```

## Configuration Examples

### Custom Food List

```javascript
const food = new Food(bot);
food.foodList = [
  'minecraft:golden_apple',
  'minecraft:cooked_porkchop',
  'minecraft:steak'
];
```

### Custom Health Threshold

```javascript
const autoTotem = new AutoTotem(bot);
autoTotem.lowHealthThreshold = 14; // Equip at 7 hearts
autoTotem.start();
```

## Output Files

- `death.txt` - Contains timestamped death logs with location and killer information

## Requirements

- Node.js
- Mineflayer

## License

MIT
