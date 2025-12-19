# mineflayer-bot-death

A Mineflayer plugin that tracks bot deaths and logs detailed information about each death event.

## Features

- Logs death location (X, Y, Z coordinates)
- Identifies player killers and their weapons
- Identifies mob killers
- Detects environmental deaths
- Saves all deaths to a `death.txt` file with timestamps
- Console logging for real-time death notifications

## 💬 Discord Community

Join our Discord server for support, updates, and community discussions. For faster support, please make a ticket:
https://discord.gg/RMC3PcKrpt

## Installation

```bash
npm install mineflayer-bot-death
```

Or install locally:
```bash
npm install ./mineflayer-bot-death
```

## Usage

```javascript
const mineflayer = require('mineflayer');
const botDeath = require('mineflayer-bot-death');

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 25565,
    username: 'Bot'
});

// Load the death tracking plugin
bot.loadPlugin(botDeath);
```

## What It Tracks

### Player Kills
When killed by a player, the plugin logs:
- Player's username
- Weapon used (e.g., netherite_sword, wooden_sword, flint_and_steel)
- Death location
- Timestamp

Example:
```
[10/14/2025, 1:46:46 PM] The bot has died at 10/14/2025, 1:46:46 PM at location: X: 0, Y: 74, Z: 9. Killed by player: FourTerms2 using netherite_sword.
```

### Mob Kills
When killed by a mob, the plugin logs:
- Mob type/name
- Death location
- Timestamp

Example:
```
[10/14/2025, 1:50:00 PM] The bot has died at 10/14/2025, 1:50:00 PM at location: X: 15, Y: 65, Z: -20. Killed by mob: zombie.
```

### Environmental Deaths
When killed by environmental damage (fall, lava, drowning, etc.), the plugin logs:
- Death location
- Timestamp
- "environmental damage or unknown cause"

Example:
```
[10/14/2025, 1:49:01 PM] The bot has died at 10/14/2025, 1:49:01 PM at location: X: 3, Y: 111, Z: -9. Killed by: environmental damage or unknown cause.
```

## Output

All deaths are logged to:
- **Console**: Real-time death notifications
- **death.txt**: Persistent log file with all death records

## API

This plugin automatically hooks into the bot's `death` event. No additional API calls are needed.

## Requirements

- Node.js
- Mineflayer

## License

MIT
