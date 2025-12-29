const mineflayer = require('mineflayer');
const { SocksClient } = require('socks');
const { HttpProxyAgent } = require('http-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const net = require('net');

class MineflayerProxyClient {
  constructor(options = {}) {
    this.proxyConfig = options.proxy || null;
    this.botOptions = options.bot || {};
    this.debug = options.debug || false;
  }

  /**
   * Create a bot connection through a proxy
   * @param {Object} botOptions - Mineflayer bot options
   * @param {Object} proxyOptions - Proxy configuration
   * @returns {Promise<Object>} - Mineflayer bot instance
   */
  async createBot(botOptions = {}, proxyOptions = null) {
    const proxy = proxyOptions || this.proxyConfig;
    const options = { ...this.botOptions, ...botOptions };

    if (!proxy) {
      this.log('No proxy configured, creating direct connection');
      return mineflayer.createBot(options);
    }

    this.log(`Creating bot connection through ${proxy.type} proxy: ${proxy.host}:${proxy.port}`);

    try {
      switch (proxy.type.toLowerCase()) {
        case 'socks4':
        case 'socks5':
          return await this.createSocksBot(options, proxy);
        case 'http':
        case 'https':
          return await this.createHttpBot(options, proxy);
        default:
          throw new Error(`Unsupported proxy type: ${proxy.type}`);
      }
    } catch (error) {
      this.log(`Failed to create bot through proxy: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create bot connection through SOCKS proxy
   */
  async createSocksBot(botOptions, proxy) {
    const socksOptions = {
      proxy: {
        host: proxy.host,
        port: proxy.port,
        type: proxy.type === 'socks4' ? 4 : 5,
        userId: proxy.username,
        password: proxy.password
      },
      command: 'connect',
      destination: {
        host: botOptions.host || 'localhost',
        port: botOptions.port || 25565
      }
    };

    this.log('Establishing SOCKS connection...');
    const info = await SocksClient.createConnection(socksOptions);
    
    const options = {
      ...botOptions,
      stream: info.socket
    };

    return mineflayer.createBot(options);
  }

  /**
   * Create bot connection through HTTP proxy
   */
  async createHttpBot(botOptions, proxy) {
    const proxyUrl = this.buildProxyUrl(proxy);
    const agent = proxy.type === 'https' 
      ? new HttpsProxyAgent(proxyUrl)
      : new HttpProxyAgent(proxyUrl);

    // For HTTP proxies, we need to establish a CONNECT tunnel
    return new Promise((resolve, reject) => {
      const host = botOptions.host || 'localhost';
      const port = botOptions.port || 25565;

      this.log(`Establishing HTTP CONNECT tunnel to ${host}:${port}`);
      
      const req = require('http').request({
        method: 'CONNECT',
        host: proxy.host,
        port: proxy.port,
        path: `${host}:${port}`,
        headers: proxy.username ? {
          'Proxy-Authorization': `Basic ${Buffer.from(`${proxy.username}:${proxy.password}`).toString('base64')}`
        } : {}
      });

      req.on('connect', (res, socket) => {
        if (res.statusCode === 200) {
          this.log('HTTP CONNECT tunnel established');
          const options = {
            ...botOptions,
            stream: socket
          };
          resolve(mineflayer.createBot(options));
        } else {
          reject(new Error(`HTTP CONNECT failed: ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.end();
    });
  }

  /**
   * Build proxy URL from configuration
   */
  buildProxyUrl(proxy) {
    const auth = proxy.username && proxy.password 
      ? `${proxy.username}:${proxy.password}@` 
      : '';
    return `${proxy.type}://${auth}${proxy.host}:${proxy.port}`;
  }

  /**
   * Test proxy connection
   */
  async testProxy(proxyOptions = null) {
    const proxy = proxyOptions || this.proxyConfig;
    
    if (!proxy) {
      throw new Error('No proxy configuration provided');
    }

    this.log(`Testing ${proxy.type} proxy: ${proxy.host}:${proxy.port}`);

    try {
      switch (proxy.type.toLowerCase()) {
        case 'socks4':
        case 'socks5':
          return await this.testSocksProxy(proxy);
        case 'http':
        case 'https':
          return await this.testHttpProxy(proxy);
        default:
          throw new Error(`Unsupported proxy type: ${proxy.type}`);
      }
    } catch (error) {
      this.log(`Proxy test failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Test SOCKS proxy connection
   */
  async testSocksProxy(proxy) {
    const socksOptions = {
      proxy: {
        host: proxy.host,
        port: proxy.port,
        type: proxy.type === 'socks4' ? 4 : 5,
        userId: proxy.username,
        password: proxy.password
      },
      command: 'connect',
      destination: {
        host: 'google.com',
        port: 80
      }
    };

    const info = await SocksClient.createConnection(socksOptions);
    info.socket.destroy();
    this.log('SOCKS proxy test successful');
    return true;
  }

  /**
   * Test HTTP proxy connection
   */
  async testHttpProxy(proxy) {
    return new Promise((resolve, reject) => {
      const req = require('http').request({
        method: 'CONNECT',
        host: proxy.host,
        port: proxy.port,
        path: 'google.com:80',
        headers: proxy.username ? {
          'Proxy-Authorization': `Basic ${Buffer.from(`${proxy.username}:${proxy.password}`).toString('base64')}`
        } : {}
      });

      req.on('connect', (res, socket) => {
        socket.destroy();
        if (res.statusCode === 200) {
          this.log('HTTP proxy test successful');
          resolve(true);
        } else {
          reject(new Error(`HTTP proxy test failed: ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('Proxy test timeout'));
      });
      
      req.end();
    });
  }

  /**
   * Get proxy chain support for multiple proxies
   */
  async createBotWithChain(botOptions, proxyChain) {
    if (!Array.isArray(proxyChain) || proxyChain.length === 0) {
      return this.createBot(botOptions);
    }

    if (proxyChain.length === 1) {
      return this.createBot(botOptions, proxyChain[0]);
    }

    // For proxy chains, we need to establish connections sequentially
    throw new Error('Proxy chaining not yet implemented');
  }

  /**
   * Logging utility
   */
  log(message) {
    if (this.debug) {
      console.log(`[MineflayerProxy] ${new Date().toISOString()} - ${message}`);
    }
  }
}

module.exports = MineflayerProxyClient;