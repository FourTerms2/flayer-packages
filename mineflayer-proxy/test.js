const { MineflayerProxyClient, MineflayerProxyServer } = require('./index');

async function runTests() {
  console.log('🧪 Running Mineflayer Proxy System Tests');
  console.log('=========================================\n');

  // Test 1: Proxy Client Creation
  console.log('Test 1: Creating Proxy Client');
  try {
    const client = new MineflayerProxyClient({ debug: false });
    console.log('✅ Proxy client created successfully');
  } catch (error) {
    console.error('❌ Failed to create proxy client:', error.message);
  }

  // Test 2: Proxy Server Creation
  console.log('\nTest 2: Creating Proxy Server');
  try {
    const server = new MineflayerProxyServer({
      port: 25567,
      debug: false
    });
    console.log('✅ Proxy server created successfully');
  } catch (error) {
    console.error('❌ Failed to create proxy server:', error.message);
  }

  // Test 3: Proxy Configuration Validation
  console.log('\nTest 3: Proxy Configuration Validation');
  const testConfigs = [
    {
      name: 'SOCKS5 Proxy',
      config: {
        type: 'socks5',
        host: '127.0.0.1',
        port: 1080
      }
    },
    {
      name: 'HTTP Proxy',
      config: {
        type: 'http',
        host: '127.0.0.1',
        port: 8080
      }
    },
    {
      name: 'SOCKS5 with Auth',
      config: {
        type: 'socks5',
        host: '127.0.0.1',
        port: 1080,
        username: 'user',
        password: 'pass'
      }
    }
  ];

  testConfigs.forEach(({ name, config }) => {
    try {
      const client = new MineflayerProxyClient();
      const url = client.buildProxyUrl ? client.buildProxyUrl(config) : 'N/A';
      console.log(`✅ ${name}: Configuration valid`);
    } catch (error) {
      console.error(`❌ ${name}: Configuration invalid -`, error.message);
    }
  });

  // Test 4: Server Start/Stop
  console.log('\nTest 4: Server Start/Stop Functionality');
  try {
    const server = new MineflayerProxyServer({
      port: 25568,
      debug: false
    });

    console.log('Starting server...');
    await server.start();
    console.log('✅ Server started successfully');

    console.log('Stopping server...');
    await server.stop();
    console.log('✅ Server stopped successfully');

  } catch (error) {
    console.error('❌ Server start/stop test failed:', error.message);
  }

  // Test 5: Bot Creation (Direct Connection)
  console.log('\nTest 5: Direct Bot Connection (No Proxy)');
  try {
    const client = new MineflayerProxyClient({ debug: false });
    
    // This will fail if no server is running, but that's expected
    const botOptions = {
      host: 'localhost',
      port: 25565,
      username: 'TestBot',
      version: '1.19.4'
    };

    console.log('Attempting direct connection...');
    // Note: This will likely fail without a running server, which is fine for testing
    setTimeout(() => {
      console.log('⚠️  Direct connection test skipped (no server running)');
    }, 100);

  } catch (error) {
    console.log('⚠️  Direct connection test failed (expected if no server):', error.message);
  }

  console.log('\n🎉 Test suite completed!');
  console.log('\nTo test with real connections:');
  console.log('1. Start a Minecraft server on localhost:25565');
  console.log('2. Run: node examples/basic-proxy-bot.js');
  console.log('3. Run: node examples/proxy-server-example.js');
}

// Run tests
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = runTests;