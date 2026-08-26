import { describe, it, expect } from 'vitest';
import request from 'supertest';
import Server from '../src/Server.js';

describe('Health Route Integration Tests', () => {
  it('GET /api/v1/health should return 200 and healthy status payload', async () => {
    const server = new Server({
      port: 0,
      server_url: 'http://localhost:8000'
    });

    await server.configServer();
    await server.mountRoutes();

    if (!server.api) {
      throw new Error('Express api was not initialized');
    }

    const response = await request(server.api).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.data.application).toBeDefined();
    expect(response.body.data.system).toBeDefined();
    expect(response.body.data.timestamp).toBeDefined();
  });
});
