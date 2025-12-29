const net = require('net');
const EventEmitter = require('events');

class MineflayerProxyServer extends EventEmitter {
  constructor(options = {}) {
    super();
    this.port = options.port || 25566;
    this.host = options.host || 'localhost';
    this.targetHost = options.targetHost || 'localhost';
    this.targetPort = options.targetPort || 25565;
    this.debug = options.debug || false;
    this.server = null;
    this.connections = new Map();
    this.connectionId = 0;
  }

  /**
   * Start the proxy server
   */
  start() {
    return new Promise((resolve, reject) => {
      this.server = net.createServer((clientSocket) => {
        this.handleConnection(clientSocket);
      });

      this.server.on('error', (error) => {
        this.log(`Server error: ${error.message}`);
        this.emit('error', error);
        reject(error);
      });

      this.server.listen(this.port, this.host, () => {
        this.log(`Proxy server listening on ${this.host}:${this.port}`);
        this.log(`Forwarding to ${this.targetHost}:${this.targetPort}`);
        this.emit('listening');
        resolve();
      });
    });
  }

  /**
   * Stop the proxy server
   */
  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        // Close all active connections
        for (const [id, connection] of this.connections) {
          this.closeConnection(id);
        }

        this.server.close(() => {
          this.log('Proxy server stopped');
          this.emit('stopped');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Handle new client connection
   */
  handleConnection(clientSocket) {
    const connectionId = ++this.connectionId;
    const clientAddress = `${clientSocket.remoteAddress}:${clientSocket.remotePort}`;
    
    this.log(`New connection ${connectionId} from ${clientAddress}`);

    // Create connection to target server
    const serverSocket = net.createConnection({
      host: this.targetHost,
      port: this.targetPort
    });

    const connection = {
      id: connectionId,
      client: clientSocket,
      server: serverSocket,
      clientAddress,
      connected: false,
      bytesFromClient: 0,
      bytesToClient: 0
    };

    this.connections.set(connectionId, connection);

    // Handle server connection
    serverSocket.on('connect', () => {
      connection.connected = true;
      this.log(`Connection ${connectionId} established to target server`);
      this.emit('connected', connectionId, clientAddress);
    });

    serverSocket.on('error', (error) => {
      this.log(`Server connection ${connectionId} error: ${error.message}`);
      this.emit('serverError', connectionId, error);
      this.closeConnection(connectionId);
    });

    serverSocket.on('close', () => {
      this.log(`Server connection ${connectionId} closed`);
      this.closeConnection(connectionId);
    });

    // Handle client connection
    clientSocket.on('error', (error) => {
      this.log(`Client connection ${connectionId} error: ${error.message}`);
      this.emit('clientError', connectionId, error);
      this.closeConnection(connectionId);
    });

    clientSocket.on('close', () => {
      this.log(`Client connection ${connectionId} closed`);
      this.closeConnection(connectionId);
    });

    // Set up data forwarding
    this.setupDataForwarding(connection);
  }

  /**
   * Set up bidirectional data forwarding
   */
  setupDataForwarding(connection) {
    const { client, server, id } = connection;

    // Forward data from client to server
    client.on('data', (data) => {
      if (connection.connected && !server.destroyed) {
        connection.bytesFromClient += data.length;
        server.write(data);
        this.emit('dataFromClient', id, data);
      }
    });

    // Forward data from server to client
    server.on('data', (data) => {
      if (!client.destroyed) {
        connection.bytesToClient += data.length;
        client.write(data);
        this.emit('dataToClient', id, data);
      }
    });
  }

  /**
   * Close a specific connection
   */
  closeConnection(connectionId) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const { client, server } = connection;

    if (!client.destroyed) {
      client.destroy();
    }

    if (!server.destroyed) {
      server.destroy();
    }

    this.log(`Connection ${connectionId} closed - Bytes: ${connection.bytesFromClient} up, ${connection.bytesToClient} down`);
    this.connections.delete(connectionId);
    this.emit('disconnected', connectionId);
  }

  /**
   * Get connection statistics
   */
  getStats() {
    const connections = Array.from(this.connections.values());
    return {
      activeConnections: connections.length,
      totalBytesFromClients: connections.reduce((sum, conn) => sum + conn.bytesFromClient, 0),
      totalBytesToClients: connections.reduce((sum, conn) => sum + conn.bytesToClient, 0),
      connections: connections.map(conn => ({
        id: conn.id,
        clientAddress: conn.clientAddress,
        connected: conn.connected,
        bytesFromClient: conn.bytesFromClient,
        bytesToClient: conn.bytesToClient
      }))
    };
  }

  /**
   * Update target server
   */
  setTarget(host, port) {
    this.targetHost = host;
    this.targetPort = port;
    this.log(`Target updated to ${host}:${port}`);
  }

  /**
   * Logging utility
   */
  log(message) {
    if (this.debug) {
      console.log(`[ProxyServer] ${new Date().toISOString()} - ${message}`);
    }
  }
}

module.exports = MineflayerProxyServer;