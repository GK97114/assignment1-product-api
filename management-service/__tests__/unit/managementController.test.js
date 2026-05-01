jest.mock('../../db/database', () => require('../mocks/database'));

const mockPool = require('../mocks/database');
const { createProduct, updateProduct, deleteProduct } = require('../../controller/managementController');

describe('Management Controller - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const newProduct = { id: 1, name: 'New Product', price: 15.99 };
      mockPool.query.mockResolvedValue({ rows: [newProduct] });

      const req = {
        body: { name: 'New Product', price: 15.99 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        service: 'management',
        replicaId: 'test-replica-1',
        product: newProduct,
      });
    });

    it('should reject empty product name', async () => {
      const req = {
        body: { name: '', price: 15.99 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Product name is required and must be a non-empty string',
      });
    });

    it('should reject negative or missing price', async () => {
      const req = {
        body: { name: 'Product', price: -5 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Product price is required and must be a non-negative number',
      });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      mockPool.query.mockRejectedValue(mockError);

      const req = {
        body: { name: 'Product', price: 15.99 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Failed to create product',
      });
    });
  });

  describe('updateProduct', () => {
    it('should update product name only', async () => {
      const existingProduct = { id: 1, name: 'Old Name', price: 15.99 };
      const updatedProduct = { id: 1, name: 'New Name', price: 15.99 };

      mockPool.query.mockResolvedValueOnce({ rows: [existingProduct] });
      mockPool.query.mockResolvedValueOnce({ rows: [updatedProduct] });

      const req = {
        params: { id: '1' },
        body: { name: 'New Name' },
      };
      const res = {
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await updateProduct(req, res);

      expect(res.json).toHaveBeenCalledWith({
        service: 'management',
        replicaId: 'test-replica-1',
        product: updatedProduct,
      });
    });

    it('should reject invalid product ID', async () => {
      const req = {
        params: { id: 'invalid' },
        body: { name: 'New Name' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Product ID must be a valid number',
      });
    });

    it('should return 404 when product not found', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const req = {
        params: { id: '999' },
        body: { name: 'New Name' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Product not found',
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const existingProduct = { id: 1, name: 'Product', price: 15.99 };
      mockPool.query.mockResolvedValueOnce({ rows: [existingProduct] });
      mockPool.query.mockResolvedValueOnce({});

      const req = { params: { id: '1' } };
      const res = {
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await deleteProduct(req, res);

      expect(res.json).toHaveBeenCalledWith({
        service: 'management',
        replicaId: 'test-replica-1',
        message: 'Product with ID 1 has been deleted successfully',
      });
    });

    it('should return 404 when product not found', async () => {
      mockPool.query.mockResolvedValue({ rows: [] });

      const req = { params: { id: '999' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Product not found',
      });
    });

    it('should reject invalid product ID', async () => {
      const req = { params: { id: 'invalid' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        locals: { replicaId: 'test-replica-1' },
      };

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Product ID must be a valid number',
      });
    });
  });
});
