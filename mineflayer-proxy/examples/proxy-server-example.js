const { MineflayerProxyServer } = require('../index');

async function startProxyServer() {
  const server = new MineflayerProxyServer({
    port: 25566,           // Port for clients to connect to
    host: '0.0.0.0',       // Listen on all interfaces
    targetHost: 'localhost', // Target Minecraft server
    targetPort: 25565,     // Target server port
    debug: true
  });

  // Event handlers
  server.on('listening', () => {
    console.log('🚀 Proxy server is ready!');
    console.log('📡 Clients can connect to localhost:25566');
    console.log('🎯 Traffic will be forwarded to localhost:25565');
  });

  server.on('connected', (connectionId, clientAddress) => {
    console.log(`✅ Client ${connectionId} connected from ${clientAddress}`);
  });

  server.on('disconnected', (connectionId) => {
    console.log(`❌ Client ${connectionId} disconnected`);
  });

  server.on('error', (error) => {
    console.error('🔥 Server error:', error.message);
  });

  server.on('clientError', (connectionId, error) => {
    console.error(`🔥 Client ${connectionId} error:`, error.message);
  });

  server.on('serverError', (connectionId, error) => {
    console.error(`🔥 Server connection ${connectionId} error:`, error.message);
  });

  // Optional: Log data transfer (be careful with this in production)
  server.on('dataFromClient', (connectionId, data) => {
    // console.log(`📤 Client ${connectionId} sent ${data.length} bytes`);
  });

  server.on('dataToClient', (connectionId, data) => {
    // console.log(`📥 Client ${connectionId} received ${data.length} bytes`);
  });

  try {
    await server.start();
    
    // Display stats every 30 seconds
    const statsInterval = setInterval(() => {
      const stats = server.getStats();
      if (stats.activeConnections > 0) {
        console.log('\n📊 === Proxy Server Statistics ===');
        console.log(`🔗 Active connections: ${stats.activeConnections}`);
        console.log(`📤 Total bytes from clients: ${formatBytes(stats.totalBytesFromClients)}`);
        console.log(`📥 Total bytes to clients: ${formatBytes(stats.totalBytesToClients)}`);
        
        stats.connections.forEach(conn => {
          console.log(`  Connection ${conn.id} (${conn.clientAddress}): ↑${formatBytes(conn.bytesFromClient)} ↓${formatBytes(conn.bytesToClient)}`);
        });
        console.log('================================\n');
      }
    }, 30000);

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down proxy server...');
      clearInterval(statsInterval);
      await server.stop();
      process.exit(0);
    });

    return server;

  } catch (error) {
    console.error('❌ Failed to start proxy server:', error.message);
    throw error;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run if executed directly
if (require.main === module) {
  startProxyServer().catch(console.error);
}

module.exports = startProxyServer;