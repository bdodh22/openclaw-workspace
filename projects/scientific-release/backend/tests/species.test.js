// backend/tests/species.test.js - 物种 API 测试

const request = require('supertest');
const app = require('../server');

describe('Species API', () => {
  describe('GET /api/species', () => {
    test('should return species list', async () => {
      const res = await request(app).get('/api/species');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('should support pagination', async () => {
      const res = await request(app)
        .get('/api/species')
        .query({ page: 1, limit: 5 });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });

    test('should support category filter', async () => {
      const res = await request(app)
        .get('/api/species')
        .query({ category: 'fish' });
      
      expect(res.statusCode).toBe(200);
      res.body.data.forEach(species => {
        expect(species.category).toBe('fish');
      });
    });
  });

  describe('GET /api/species/:id', () => {
    test('should return species by id', async () => {
      const res = await request(app).get('/api/species/1');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id', 1);
    });

    test('should return 404 for non-existent species', async () => {
      const res = await request(app).get('/api/species/99999');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/species/search', () => {
    test('should search species by keyword', async () => {
      const res = await request(app)
        .get('/api/species/search')
        .query({ q: '鲫' });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      res.body.data.forEach(species => {
        expect(species.name).toContain('鲫');
      });
    });
  });
});
