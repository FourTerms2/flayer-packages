const { MineflayerProxyClient } = require('../index');

async function createProxyBot() {
  const proxyClient = new MineflayerProxyClient({ debug: true });

  // Configure your proxy here
  const proxyConfig = {
    type: 'socks5', // or 'socks4', 'http', 'https'
    host: '127.0.0.1',
    port: 1080,
    username: 'your_username', // optional
    password: 'your_password'  // optional
  };

  // Configure your bot
  const botConfig = {
    host: 'play.hypixel.net', // or your server
    port: 25565,
    username: 'YourBotName',
    version: '1.19.4'
  };

  try {
    console.log('Testing proxy connection...');
    await proxyClient.testProxy(proxyConfig);
    console.log('Proxy test successful!');

    console.log('Creating bot through proxy...');
    const bot = await proxyClient.createBot(botConfig, proxyConfig);

    bot.on('login', () => {
      console.log(`✅ Bot logged in as ${bot.username}`);
    });

    bot.on('spawn', () => {
      console.log('🎮 Bot spawned in game');
      console.log(`📍 Position: ${bot.entity.position}`);
      
      // Basic bot behavior
      bot.chat('Hello from proxy bot!');
    });

    bot.on('chat', (username, message) => {
      if (username === bot.username) return;
      console.log(`💬 ${username}: ${message}`);
      
      // Echo messages that mention the bot
      if (message.toLowerCase().includes(bot.username.toLowerCase())) {
        bot.chat(`Hello ${username}!`);
      }
    });

    bot.on('error', (err) => {
      console.error('❌ Bot error:', err.message);
    });

    bot.on('end', () => {
      console.log('🔌 Bot disconnected');
    });

    return bot;

  } catch (error) {
    console.error('❌ Failed to create proxy bot:', error.message);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  createProxyBot().catch(console.error);
}

module.exports = createProxyBot;