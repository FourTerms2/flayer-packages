# Mineflayer Proxy System

A comprehensive proxy system for mineflayer bots that allows connections through various proxy types including SOCKS4, SOCKS5, HTTP, and HTTPS proxies.

## Features

- **Multiple Proxy Types**: Support for SOCKS4, SOCKS5, HTTP, and HTTPS proxies
- **Authentication**: Username/password authentication for proxies that require it
- **Proxy Testing**: Built-in proxy connection testing before bot creation
- **Proxy Server**: Create your own proxy server for bot connections
- **Connection Statistics**: Monitor data transfer and connection stats
- **Error Handling**: Comprehensive error handling and logging
- **Debug Mode**: Detailed logging for troubleshooting

## Installation

```bash
npm install
```

## Quick Start

### Using a Bot with Proxy

```javascript
const { MineflayerProxyClient } = require('./index');

const proxyClient = new MineflayerProxyClient({ debug: true });

// Configure proxy
const proxyConfig = {
  type: 'socks5',
  host: '127.0.0.1',
  port: 1080,
  username: 'user', // optional
  password: 'pass'  // optional
};

// Configure bot
const botConfig = {
  host: 'localhost',
  port: 25565,
  username: 'ProxyBot',
  version: '1.19.4'
};

// Create bot through proxy
const bot = await proxyClient.createBot(botConfig, proxyConfig);
```

### Running a Proxy Server

```javascript
const { MineflayerProxyServer } = require('./index');

const server = new MineflayerProxyServer({
  port: 25566,           // Port for clients to connect to
  targetHost: 'localhost', // Target Minecraft server
  targetPort: 25565,     // Target server port
  debug: true
});

await server.start();
```

## Proxy Types

### SOCKS5 Proxy
```javascript
const socksProxy = {
  type: 'socks5',
  host: '127.0.0.1',
  port: 1080,
  username: 'user', // optional
  password: 'pass'  // optional
};
```

### SOCKS4 Proxy
```javascript
const socks4Proxy = {
  type: 'socks4',
  host: '127.0.0.1',
  port: 1080,
  username: 'user' // optional (SOCKS4 doesn't use password)
};
```

### HTTP Proxy
```javascript
const httpProxy = {
  type: 'http',
  host: '127.0.0.1',
  port: 8080,
  username: 'user', // optional
  password: 'pass'  // optional
};
```

### HTTPS Proxy
```javascript
const httpsProxy = {
  type: 'https',
  host: '127.0.0.1',
  port: 8080,
  username: 'user', // optional
  password: 'pass'  // optional
};
```

## API Reference

### MineflayerProxyClient

#### Constructor
```javascript
new MineflayerProxyClient(options)
```
- `options.proxy` - Default proxy configuration
- `options.bot` - Default bot options
- `options.debug` - Enable debug logging

#### Methods

##### createBot(botOptions, proxyOptions)
Creates a mineflayer bot through a proxy.
- `botOptions` - Standard mineflayer bot options
- `proxyOptions` - Proxy configuration (optional)
- Returns: Promise<Bot>

##### testProxy(proxyOptions)
Tests proxy connection before using it.
- `proxyOptions` - Proxy configuration
- Returns: Promise<boolean>

### MineflayerProxyServer

#### Constructor
```javascript
new MineflayerProxyServer(options)
```
- `options.port` - Port to listen on (default: 25566)
- `options.host` - Host to bind to (default: 'localhost')
- `options.targetHost` - Target server host (default: 'localhost')
- `options.targetPort` - Target server port (default: 25565)
- `options.debug` - Enable debug logging

#### Methods

##### start()
Starts the proxy server.
- Returns: Promise<void>

##### stop()
Stops the proxy server.
- Returns: Promise<void>

##### getStats()
Returns connection statistics.
- Returns: Object with connection stats

##### setTarget(host, port)
Updates the target server.
- `host` - New target host
- `port` - New target port

#### Events

- `listening` - Server started listening
- `connected` - Client connected
- `disconnected` - Client disconnected
- `error` - Server error
- `clientError` - Client connection error
- `serverError` - Target server connection error
- `dataFromClient` - Data received from client
- `dataToClient` - Data sent to client

## Examples

### Basic Proxy Bot
```bash
node examples/basic-proxy-bot.js
```

### Proxy Server
```bash
node examples/proxy-server-example.js
```

### Run Tests
```bash
npm test
```

## Use Cases

1. **Bypassing IP Restrictions**: Connect to servers that have IP-based restrictions
2. **Load Balancing**: Distribute bot connections across multiple IP addresses
3. **Privacy**: Hide your real IP address when connecting bots
4. **Testing**: Create local proxy servers for testing bot behavior
5. **Network Routing**: Route bot traffic through specific network paths

## Configuration Tips

1. **SOCKS5 vs HTTP**: SOCKS5 is generally more reliable for Minecraft connections
2. **Authentication**: Always use authenticated proxies when available for better security
3. **Testing**: Always test proxy connections before creating bots
4. **Error Handling**: Implement proper error handling for proxy failures
5. **Logging**: Enable debug mode during development

## Troubleshooting

### Common Issues

1. **Connection Timeout**: Check proxy server availability and credentials
2. **Authentication Failed**: Verify username/password for authenticated proxies
3. **Protocol Mismatch**: Ensure proxy type matches the actual proxy server
4. **Firewall Issues**: Check if proxy ports are accessible

### Debug Mode

Enable debug logging to see detailed connection information:
```javascript
const client = new MineflayerProxyClient({ debug: true });
const server = new MineflayerProxyServer({ debug: true });
```

## License

MIT License - see LICENSE file for details.