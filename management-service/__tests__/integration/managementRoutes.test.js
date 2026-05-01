jest.mock('../../db/database', () => require('../mocks/database'));

const request = require('supertest');
const express = require('express');
const mockPool = require('../mocks/database');
const managementRoutes = require('../../routes/managementRoutes');

// Create a test app
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.locals.replicaId = 'test-replica-1';
  next();
});
app.use('/api/products', managementRoutes);

describe('Management Service - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/products', () => {
    it('should create a product successfully', async () => {
      const newProduct = { id: 1, name: 'New Product', price: 15.99 };
      mockPool.query.mockResolvedValue({ rows: [newProduct] });

      const response = await request(app)
        .post('/api/products')
        .send({ name: 'New Product', price: 15.99 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        service: 'management',
        replicaId: 'test-replica-1',
        product: newProduct,
      });
    });

    it('should return 400 for missing product name', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({ price: 15.99 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for negative price', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({ name: 'Product', price: -5 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle database errors', async () => {
      mockPool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/products')
        .send({ name: 'Product', price: 15.99 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Failed to create product',
      });
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product successfully', async () => {
      const existingProduct = { id: 1, name: 'Old Name', price: 15.99 };
      const updatedProduct = { id: 1, name: 'New Name', price: 15.99 };

      mockPool.query.mockResolvedValueOnce({ rows: [existingProduct] });
      mockPool.query.mockResolvedValueOnce({ rows: [updatedProduct] });

      const response = await request(app)
        .put('/api/products/1')
        .send({ name: 'New Name' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        service: 'management',
        replicaId: 'test-replica-1',
        product: updatedProduct,
      });
    });

    it('should return 404 when product not found', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/products/999')
        .send({ name: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Product not found',
      });
    });

    it('should return 400 for invalid product ID', async () => {
      const response = await request(app)
        .put('/api/products/invalid')
        .send({ name: 'New Name' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Product ID must be a valid number',
      });
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product successfully', async () => {
      const existingProduct = { id: 1, name: 'Product', price: 15.99 };
      mockPool.query.mockResolvedValueOnce({ rows: [existingProduct] });
      mockPool.query.mockResolvedValueOnce({});

      const response = await request(app).delete('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        service: 'management',
        replicaId: 'test-replica-1',
        message: 'Product with ID 1 has been deleted successfully',
      });
    });

    it('should return 404 when product not found', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/products/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Product not found',
      });
    });

    it('should return 400 for invalid product ID', async () => {
      const response = await request(app).delete('/api/products/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Product ID must be a valid number',
      });
    });
  });
});
