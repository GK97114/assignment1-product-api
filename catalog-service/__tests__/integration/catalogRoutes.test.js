jest.mock('../../db/database', () => require('../mocks/database'));

const request = require('supertest');
const express = require('express');
const mockPool = require('../mocks/database');
const catalogRoutes = require('../../routes/catalogRoutes');

// Create a test app
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.locals.replicaId = 'test-replica-1';
  next();
});
app.use('/api/catalog', catalogRoutes);

describe('Catalog Service - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/catalog', () => {
    it('should return all products with 200 status', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', price: 10.99 },
        { id: 2, name: 'Product 2', price: 20.99 },
      ];
      mockPool.query.mockResolvedValue({ rows: mockProducts });

      const response = await request(app).get('/api/catalog');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        service: 'catalog',
        replicaId: 'test-replica-1',
        products: mockProducts,
      });
    });

    it('should handle database errors gracefully', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/catalog');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to fetch products',
      });
    });
  });

  describe('GET /api/catalog/:id', () => {
    it('should return a single product with 200 status', async () => {
      const mockProduct = { id: 1, name: 'Product 1', price: 10.99 };
      mockPool.query.mockResolvedValue({ rows: [mockProduct] });

      const response = await request(app).get('/api/catalog/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        service: 'catalog',
        replicaId: 'test-replica-1',
        product: mockProduct,
      });
    });

    it('should return 404 when product not found', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/catalog/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Product not found',
      });
    });

    it('should return 400 for invalid product ID', async () => {
      const response = await request(app).get('/api/catalog/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Product ID must be a valid number',
      });
    });

    it('should handle database errors', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/catalog/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to fetch product',
      });
    });
  });
});
