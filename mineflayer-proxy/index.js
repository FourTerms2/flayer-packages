const MineflayerProxyClient = require('./proxy-client');
const MineflayerProxyServer = require('./proxy-server');

// Example usage and configuration
async function main() {
  console.log('Mineflayer Proxy System Demo');
  console.log('============================');

  // Example 1: Create a bot through SOCKS5 proxy
  const proxyClient = new MineflayerProxyClient({ debug: true });

  const socksProxy = {
    type: 'socks5',
    host: '127.0.0.1',
    port: 1080,
    username: 'user', // optional
    password: 'pass'  // optional
  };

  const httpProxy = {
    type: 'http',
    host: '127.0.0.1',
    port: 8080,
    username: 'user', // optional
    password: 'pass'  // optional
  };

  // Bot configuration
  const botOptions = {
    host: 'localhost',
    port: 25565,
    username: 'ProxyBot',
    version: '1.19.4'
  };

  try {
    // Test proxy connection first
    console.log('\n--- Testing Proxy Connection ---');
    // await proxyClient.testProxy(socksProxy);
    
    // Create bot through proxy (uncomment to use)
    console.log('\n--- Creating Bot Through Proxy ---');
    // const bot = await proxyClient.createBot(botOptions, socksProxy);
    
    // Or create bot without proxy
    console.log('\n--- Creating Direct Bot Connection ---');
    const bot = await proxyClient.createBot(botOptions);

    bot.on('login', () => {
      console.log(`Bot logged in as ${bot.username}`);
    });

    bot.on('spawn', () => {
      console.log('Bot spawned in game');
      console.log(`Position: ${bot.entity.position}`);
    });

    bot.on('error', (err) => {
      console.error('Bot error:', err.message);
    });

    bot.on('end', () => {
      console.log('Bot disconnected');
    });

  } catch (error) {
    console.error('Failed to create bot:', error.message);
  }

  // Example 2: Start a proxy server
  console.log('\n--- Starting Proxy Server ---');
  const proxyServer = new MineflayerProxyServer({
    port: 25566,
    host: 'localhost',
    targetHost: 'localhost',
    targetPort: 25565,
    debug: true
  });

  proxyServer.on('connected', (id, address) => {
    console.log(`Client ${id} connected from ${address}`);
  });

  proxyServer.on('disconnected', (id) => {
    console.log(`Client ${id} disconnected`);
  });

  try {
    await proxyServer.start();
    console.log('Proxy server started successfully');
    
    // Show stats every 10 seconds
    setInterval(() => {
      const stats = proxyServer.getStats();
      if (stats.activeConnections > 0) {
        console.log('\n--- Proxy Server Stats ---');
        console.log(`Active connections: ${stats.activeConnections}`);
        console.log(`Total bytes up: ${stats.totalBytesFromClients}`);
        console.log(`Total bytes down: ${stats.totalBytesToClients}`);
      }
    }, 10000);

  } catch (error) {
    console.error('Failed to start proxy server:', error.message);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  process.exit(0);
});

// Export classes for use as modules
module.exports = {
  MineflayerProxyClient,
  MineflayerProxyServer
};

// Run demo if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}