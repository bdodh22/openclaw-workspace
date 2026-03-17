// backend/tests/health.test.js - 健康检查测试

const request = require('supertest');
const app = require('../server');

describe('Health Check', () => {
  test('GET /health should return status ok', async () => {
    const res = await request(app).get('/health');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
  });
});
