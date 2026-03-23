// backend/tests/health.test.js - 健康检查测试

const request = require('supertest');
const app = require('../server');

describe('Health Check', () => {
  describe('GET /health', () => {
    test('should return status ok', async () => {
      const res = await request(app).get('/health');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('memory');
      expect(res.body.memory).toHaveProperty('status');
      expect(res.body.memory).toHaveProperty('heapUsed');
    });

    test('should return memory status', async () => {
      const res = await request(app).get('/health');
      
      expect(res.body.memory).toHaveProperty('heapUsedPercent');
      expect(res.body.memory.heapUsedPercent).toBeGreaterThanOrEqual(0);
      expect(res.body.memory.heapUsedPercent).toBeLessThanOrEqual(100);
    });

    test('should include uptime in seconds', async () => {
      const res = await request(app).get('/health');
      
      expect(res.body.uptime).toBeGreaterThanOrEqual(0);
    });
  });
});
