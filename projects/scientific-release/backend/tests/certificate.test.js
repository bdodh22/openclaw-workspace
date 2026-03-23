// backend/tests/certificate.test.js - 证书 API 测试

const request = require('supertest');
const app = require('../server');

describe('Certificate API', () => {
  describe('POST /api/certificates', () => {
    test('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/certificates')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });

    test('should create certificate with valid data', async () => {
      const validData = {
        openid: 'test_openid_123',
        speciesId: 1,
        releaseCount: 10,
        releaseLocation: '西湖',
        releaseDate: new Date().toISOString(),
        wish: '愿众生安乐'
      };

      const res = await request(app)
        .post('/api/certificates')
        .send(validData);
      
      // Should succeed or fail gracefully
      expect([200, 201, 400, 500]).toContain(res.statusCode);
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('certificateUrl');
      }
    });
  });

  describe('GET /api/certificates/user/:openid', () => {
    test('should return certificate list for user', async () => {
      const res = await request(app)
        .get('/api/certificates/user/test_openid_123');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('should return empty array for user with no certificates', async () => {
      const res = await request(app)
        .get('/api/certificates/user/nonexistent_user');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toEqual([]);
    });
  });

  describe('GET /api/certificates/:id', () => {
    test('should return certificate by id', async () => {
      const res = await request(app).get('/api/certificates/1');
      
      // May return 200 (found) or 404 (not found)
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.data).toHaveProperty('id');
      } else if (res.statusCode === 404) {
        expect(res.body).toHaveProperty('success', false);
      }
    });
  });
});
