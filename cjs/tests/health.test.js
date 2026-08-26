const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const Server = require('../src/Server');

test('Health Route Integration Tests', async (t) => {
  const server = new Server({
    port: 0,
    server_url: 'http://localhost:8000',
  });

  await server.configServer();
  await server.mountRoutes();

  await t.test(
    'GET /api/v1/health should return 200 and healthy status payload',
    async () => {
      const response = await request(server.api).get('/api/v1/health');

      assert.equal(response.status, 200);
      assert.equal(response.body.success, true);
      assert.equal(response.body.statusCode, 200);
      assert.ok(response.body.data.application);
      assert.ok(response.body.data.system);
      assert.ok(response.body.data.timestamp);
    },
  );
});
