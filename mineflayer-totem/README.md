# Mineflayer Auto Totem

A Mineflayer plugin that automatically equips a Totem of Undying to the off-hand when the bot's health drops below a threshold.

**GitHub Repository:** https://github.com/FourTerms2/mineflayer-totem

## Features

- Automatically equips totem when health drops below 10 HP
- Monitors health continuously (checks every 100ms)
- Searches entire inventory for totems
- Equips to off-hand slot for proper totem functionality
- Lightweight and efficient

## 💬 Discord Community

Join our Discord server for support, updates, and community discussions. For faster support, please make a ticket:
https://discord.gg/RMC3PcKrpt

## Installation

```bash
npm install mineflayer-totem
```

## Usage

```javascript
const mineflayer = require('mineflayer');
const { AutoTotem } = require('mineflayer-totem');

const bot = mineflayer.createBot({
  host: 'localhost',
  username: 'bot'
});

// Initialize and start the totem module
const autoTotem = new AutoTotem(bot);
autoTotem.start();
```

## Configuration

### Default Settings

- **Health Threshold:** 10 HP (5 hearts)
- **Check Interval:** 100ms
- **Target Slot:** Off-hand (slot 45)

### Customizing Health Threshold

```javascript
const autoTotem = new AutoTotem(bot);
autoTotem.lowHealthThreshold = 14; // Equip at 7 hearts instead
autoTotem.start();
```

## How It Works

1. The module listens to the bot's health events
2. Every 100ms, it checks if health is below the threshold
3. When health drops below threshold, it searches for a totem in inventory
4. If found, it equips the totem to the off-hand slot
5. The totem will activate automatically if the bot takes fatal damage

## API

### `new AutoTotem(bot)`

Creates a new AutoTotem instance.

**Parameters:**
- `bot` - The Mineflayer bot instance

**Properties:**
- `lowHealthThreshold` - Health level that triggers totem equipping (default: 10)
- `offhandSlot` - Inventory slot for off-hand (default: 45)

**Methods:**
- `start()` - Begins monitoring health and auto-equipping totems
- `handleAutoTotem()` - Checks health and triggers totem equipping if needed
- `equipTotem()` - Equips a totem to the off-hand
- `findTotemInInventory()` - Searches for a totem in the bot's inventory

## Notes

- The bot needs to have a Totem of Undying in its inventory for this to work
- Totems are consumed when they save the bot from death
- Make sure your bot has a way to obtain more totems (trading, looting, etc.)

## License

MIT
