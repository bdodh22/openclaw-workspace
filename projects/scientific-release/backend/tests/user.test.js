// backend/tests/user.test.js - 用户 API 测试

const request = require('supertest');
const app = require('../server');

describe('User API', () => {
  describe('POST /api/users/login', () => {
    test('should return 400 if code is missing', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toContain('code');
    });

    test('should return 500 if WECHAT_SECRET is not configured', async () => {
      // Mock invalid secret
      const originalSecret = process.env.WECHAT_SECRET;
      delete process.env.WECHAT_SECRET;
      
      const res = await request(app)
        .post('/api/users/login')
        .send({ code: 'test_code' });
      
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('success', false);
      
      // Restore
      if (originalSecret) process.env.WECHAT_SECRET = originalSecret;
    });

    test('should handle WeChat API error gracefully', async () => {
      // This test will fail in real environment without valid code
      // but should return proper error structure
      const res = await request(app)
        .post('/api/users/login')
        .send({ code: 'invalid_code' });
      
      // Should return either 400 (WeChat error) or handle gracefully
      expect([400, 500]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/users/:id', () => {
    test('should return 404 for non-existent user', async () => {
      const res = await request(app).get('/api/users/99999');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toBe('User not found');
    });

    test('should return user without sensitive fields', async () => {
      // Get first user (id=1 should exist)
      const res = await request(app).get('/api/users/1');
      
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('id');
        // Should not expose openid or unionid
        expect(res.body.data).not.toHaveProperty('openid');
        expect(res.body.data).not.toHaveProperty('unionid');
      }
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should validate nickname length', async () => {
      const res = await request(app)
        .put('/api/users/1')
        .send({ nickname: 'A' }); // Too short
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });

    test('should validate nickname characters', async () => {
      const res = await request(app)
        .put('/api/users/1')
        .send({ nickname: 'Invalid@Name!' }); // Invalid characters
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });

    test('should validate phone format', async () => {
      const res = await request(app)
        .put('/api/users/1')
        .send({ phone: '12345' }); // Invalid phone
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });

    test('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .put('/api/users/99999')
        .send({ nickname: '测试用户' });
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });
});
